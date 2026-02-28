"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
    CreditCard, FileText, Plane, CheckCircle2, Clock,
    AlertCircle, ChevronDown, ChevronRight, Share2, Copy, ArrowLeft,
    Hotel, Calendar, User, Phone, MapPin, ExternalLink, Sun,
    BedDouble, Compass, UserCheck, PhoneCall, Navigation,
    Bell, X, BookOpen, ShieldCheck, Wallet, Info
} from "lucide-react";

// ── Notification Types ─────────────────────────────────────────────────────────
type NotifCategory = "manasik" | "visa" | "pelunasan" | "keberangkatan";

interface Notification {
    id: string;
    category: NotifCategory;
    title: string;
    body: string;
    time: string;
    read: boolean;
    actionLabel?: string;
    actionHref?: string;
    urgent?: boolean;
}

// ── Types ──────────────────────────────────────────────────────────────────────
interface Stage {
    id: string;
    label: string;
    desc: string;
    done: boolean;
    date?: string;
}

interface TrackingSection {
    stages: Stage[];
}

interface DailySchedule {
    day: number;
    title: string;
    activities: string[];
    location: string;
}

interface HotelDetail {
    name: string;
    city: string;
    roomNumber?: string;
    mapsUrl: string;
    mapsEmbed?: string;
    starRating: number;
    checkIn: string;
    checkOut: string;
}

interface MutawifDetail {
    name: string;
    phone: string;
    whatsapp: string;
    photo?: string;
    region: string;
}

interface TripDetail {
    itinerary: DailySchedule[];
    hotels: HotelDetail[];
    mutawif: MutawifDetail;
}

interface Booking {
    invoiceId: string;
    packageName: string;
    jamaahName: string;
    email: string;
    whatsapp: string;
    airlines: string;
    flightCode: string;
    departureDate: string;
    hotelMakkah: string;
    hotelMadinah: string;
    bookedAt: string;
    ktpUrl?: string | null;
    passportUrl?: string | null;
    tripDetail: TripDetail;
    payment: TrackingSection & {
        scheme: string;
        total: number;
        paid: number;
    };
    document: TrackingSection;
    visa: TrackingSection;
    departure: TrackingSection;
}

// ────────────────────────────────────────────────────────────────────────────────
function formatIDR(n: number) {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
}

// ── Build Notifications from booking state ────────────────────────────────────
function buildNotifications(booking: Booking): Notification[] {
    const notifs: Notification[] = [];

    // 1. REMINDER PELUNASAN — jika belum lunas
    const lunasDone = booking.payment.stages.find(s => s.id === "lunas")?.done;
    const paid = booking.payment.paid;
    const total = booking.payment.total;
    const sisa = total - paid;
    if (!lunasDone && sisa > 0) {
        notifs.push({
            id: "notif-pelunasan",
            category: "pelunasan",
            title: "⚠️ Reminder Pelunasan",
            body: `Sisa pembayaran Anda sebesar ${new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(sisa)} belum dilunasi. Segera lakukan pelunasan sebelum batas waktu agar keberangkatan tidak terganggu.`,
            time: "Hari ini",
            read: false,
            urgent: true,
            actionLabel: "Hubungi Admin",
            actionHref: `https://wa.me/6281234567890?text=Assalamualaikum%2C%20saya%20ingin%20melakukan%20pelunasan%20invoice%20${booking.invoiceId}`,
        });
    }

    // 2. INFO VISA SELESAI — jika visa approved
    const visaApproved = booking.visa.stages.find(s => s.id === "approved")?.done;
    if (visaApproved) {
        notifs.push({
            id: "notif-visa",
            category: "visa",
            title: "✅ Visa Umroh Telah Terbit!",
            body: `Alhamdulillah, visa Umroh Anda untuk paket "${booking.packageName}" telah diterbitkan. Silakan konfirmasi ke admin untuk pengambilan dokumen.`,
            time: "2 hari lalu",
            read: false,
            actionLabel: "Konfirmasi ke Admin",
            actionHref: `https://wa.me/6281234567890?text=Assalamualaikum%2C%20visa%20saya%20sudah%20terbit%20untuk%20invoice%20${booking.invoiceId}`,
        });
    } else {
        // Jika proses pengajuan sudah dimulai
        const visaSubmitted = booking.visa.stages.find(s => s.id === "submit")?.done;
        if (visaSubmitted) {
            notifs.push({
                id: "notif-visa-proses",
                category: "visa",
                title: "🛂 Visa Sedang Diproses",
                body: `Dokumen visa Anda sedang dalam proses verifikasi oleh Kedutaan Arab Saudi. Estimasi selesai 14–21 hari kerja. Kami akan segera memberitahu jika ada update.`,
                time: "3 hari lalu",
                read: false,
            });
        }
    }

    // 3. REMINDER MANASIK — jika ada tahap manasik belum selesai di departure
    const manasikDone = booking.departure.stages.find(s => s.id === "briefing")?.done;
    const scheduled = booking.departure.stages.find(s => s.id === "scheduled")?.done;
    if (scheduled && !manasikDone) {
        notifs.push({
            id: "notif-manasik",
            category: "manasik",
            title: "📚 Reminder: Jadwal Manasik",
            body: `Pertemuan manasik dan briefing sebelum keberangkatan akan segera dilaksanakan. Pastikan kehadiran Anda beserta anggota kelompok yang terdaftar. Informasi detail akan dikirim via WhatsApp.`,
            time: "1 minggu lalu",
            read: false,
            urgent: false,
            actionLabel: "Lihat Jadwal",
            actionHref: `/tracking/${booking.invoiceId}`,
        });
    } else if (!scheduled) {
        notifs.push({
            id: "notif-manasik-info",
            category: "manasik",
            title: "📚 Info Manasik",
            body: `Jadwal manasik untuk rombongan Anda akan diinformasikan setelah jadwal penerbangan ditetapkan. Pantau terus halaman tracking ini untuk update terbaru.`,
            time: "2 minggu lalu",
            read: true,
        });
    }

    // 4. INFO KEBERANGKATAN — jika jadwal sudah ditetapkan
    const depScheduled = booking.departure.stages.find(s => s.id === "scheduled")?.done;
    if (depScheduled) {
        notifs.push({
            id: "notif-keberangkatan",
            category: "keberangkatan",
            title: "✈️ Jadwal Keberangkatan Ditetapkan!",
            body: `Penerbangan Anda dengan ${booking.airlines} (${booking.flightCode}) telah dijadwalkan pada ${booking.departureDate}. Harap tiba di bandara minimal 3 jam sebelum keberangkatan dengan membawa seluruh dokumen lengkap.`,
            time: "5 hari lalu",
            read: false,
            actionLabel: "Cek Detail Perjalanan",
            actionHref: `/tracking/${booking.invoiceId}`,
        });
    }

    // 5. Notifikasi selamat datang (selalu ada)
    notifs.push({
        id: "notif-welcome",
        category: "keberangkatan",
        title: "🤲 Selamat Bergabung!",
        body: `Pemesanan untuk paket "${booking.packageName}" berhasil dikonfirmasi. Tim Jawara Wisata akan mendampingi perjalanan ibadah Anda. Semoga menjadi ibadah yang mabrur.`,
        time: booking.bookedAt,
        read: true,
    });

    return notifs;
}

// ── Notification Category Config ──────────────────────────────────────────────
const NOTIF_CONFIG: Record<NotifCategory, { color: string; bg: string; border: string; icon: any }> = {
    manasik: { color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-200", icon: BookOpen },
    visa: { color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200", icon: ShieldCheck },
    pelunasan: { color: "text-red-600", bg: "bg-red-50", border: "border-red-200", icon: Wallet },
    keberangkatan: { color: "text-green-600", bg: "bg-green-50", border: "border-green-200", icon: Plane },
};

// ── NotificationCenter Component ──────────────────────────────────────────────
function NotificationCenter({ notifications: initial }: { notifications: Notification[] }) {
    const [open, setOpen] = useState(false);
    const [notifs, setNotifs] = useState<Notification[]>(initial);
    const panelRef = useRef<HTMLDivElement>(null);

    const unread = notifs.filter(n => !n.read).length;

    // Close on outside click
    useEffect(() => {
        function handle(e: MouseEvent) {
            if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        if (open) document.addEventListener("mousedown", handle);
        return () => document.removeEventListener("mousedown", handle);
    }, [open]);

    const markRead = (id: string) =>
        setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

    const dismiss = (id: string) =>
        setNotifs(prev => prev.filter(n => n.id !== id));

    const markAllRead = () =>
        setNotifs(prev => prev.map(n => ({ ...n, read: true })));

    return (
        <div className="relative" ref={panelRef}>
            {/* Bell Button */}
            <button
                onClick={() => { setOpen(o => !o); }}
                className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all hover:scale-105"
                aria-label="Notifikasi"
            >
                <Bell className="w-5 h-5" />
                {unread > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center shadow-lg animate-bounce">
                        {unread > 9 ? "9+" : unread}
                    </span>
                )}
            </button>

            {/* Panel */}
            {open && (
                <div
                    className="absolute right-0 top-12 w-[340px] md:w-[400px] bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden"
                    style={{ animation: "slideDown 0.2s ease" }}
                >
                    <style>{`
                        @keyframes slideDown {
                            from { opacity: 0; transform: translateY(-8px) scale(0.97); }
                            to   { opacity: 1; transform: translateY(0) scale(1); }
                        }
                        @keyframes fadeIn {
                            from { opacity: 0; transform: translateX(8px); }
                            to   { opacity: 1; transform: translateX(0); }
                        }
                    `}</style>

                    {/* Header */}
                    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                            <Bell className="w-4 h-4 text-[#d4a017]" />
                            <h3 className="font-bold text-gray-900 text-sm">Notifikasi</h3>
                            {unread > 0 && (
                                <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-600 text-[10px] font-black">
                                    {unread} baru
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            {unread > 0 && (
                                <button
                                    onClick={markAllRead}
                                    className="text-[11px] text-[#d4a017] font-semibold hover:underline"
                                >
                                    Tandai semua dibaca
                                </button>
                            )}
                            <button
                                onClick={() => setOpen(false)}
                                className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* List */}
                    <div className="max-h-[420px] overflow-y-auto divide-y divide-gray-50">
                        {notifs.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-3">
                                    <Bell className="w-6 h-6 text-gray-300" />
                                </div>
                                <p className="text-sm font-semibold text-gray-400">Tidak ada notifikasi</p>
                                <p className="text-xs text-gray-300 mt-1">Semua notifikasi telah dibaca</p>
                            </div>
                        ) : (
                            notifs.map((n) => {
                                const cfg = NOTIF_CONFIG[n.category];
                                const Icon = cfg.icon;
                                return (
                                    <div
                                        key={n.id}
                                        className={`relative p-4 transition-all hover:bg-gray-50/70 ${!n.read ? "bg-amber-50/30" : ""
                                            }`}
                                        style={{ animation: "fadeIn 0.15s ease" }}
                                        onClick={() => markRead(n.id)}
                                    >
                                        <div className="flex gap-3">
                                            {/* Icon */}
                                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.bg} ${n.urgent ? "ring-2 ring-red-400 ring-offset-1" : ""}`}>
                                                <Icon className={`w-4 h-4 ${cfg.color}`} />
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-1 mb-0.5">
                                                    <p className={`text-xs font-bold leading-tight ${n.read ? "text-gray-700" : "text-gray-900"
                                                        }`}>{n.title}</p>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); dismiss(n.id); }}
                                                        className="flex-shrink-0 w-5 h-5 rounded hover:bg-gray-200 flex items-center justify-center text-gray-300 hover:text-gray-500 transition-colors"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </div>
                                                <p className="text-[11px] text-gray-500 leading-relaxed">{n.body}</p>

                                                <div className="flex items-center justify-between mt-2 gap-2">
                                                    <span className="text-[10px] text-gray-400 font-medium">{n.time}</span>
                                                    {n.actionLabel && n.actionHref && (
                                                        <a
                                                            href={n.actionHref}
                                                            target={n.actionHref.startsWith("http") ? "_blank" : undefined}
                                                            rel={n.actionHref.startsWith("http") ? "noopener noreferrer" : undefined}
                                                            onClick={(e) => e.stopPropagation()}
                                                            className={`text-[10px] font-bold px-2.5 py-1 rounded-lg transition-colors ${cfg.bg} ${cfg.color} hover:opacity-80`}
                                                        >
                                                            {n.actionLabel} →
                                                        </a>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Unread dot */}
                                            {!n.read && (
                                                <span className="w-2 h-2 rounded-full bg-[#d4a017] flex-shrink-0 mt-1 self-start" />
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* Footer */}
                    <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/50">
                        <p className="text-[10px] text-gray-400 text-center">
                            Notifikasi dikirim otomatis berdasarkan status booking Anda
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

function getProgressPercent(stages: Stage[]) {
    const done = stages.filter((s) => s.done).length;
    return Math.round((done / stages.length) * 100);
}

function getOverallStatus(stages: Stage[]): "selesai" | "berjalan" | "menunggu" {
    if (stages.every((s) => s.done)) return "selesai";
    if (stages.some((s) => s.done)) return "berjalan";
    return "menunggu";
}

// ── StatusBadge ───────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: "selesai" | "berjalan" | "menunggu" }) {
    const config = {
        selesai: { bg: "bg-green-100", text: "text-green-700", dot: "bg-green-500", label: "Selesai" },
        berjalan: { bg: "bg-blue-100", text: "text-blue-700", dot: "bg-blue-500 animate-pulse", label: "Berjalan" },
        menunggu: { bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-400", label: "Menunggu" },
    }[status];

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${config.bg} ${config.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
            {config.label}
        </span>
    );
}

// ── Timeline ──────────────────────────────────────────────────────────────────
function Timeline({ stages }: { stages: Stage[] }) {
    const activeIdx = stages.findIndex((s) => !s.done);

    return (
        <div className="space-y-0">
            {stages.map((stage, i) => {
                const isLast = i === stages.length - 1;
                const isActive = i === activeIdx;

                return (
                    <div key={stage.id} className="flex gap-4">
                        {/* Line + Node */}
                        <div className="flex flex-col items-center">
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-all ${stage.done
                                    ? "bg-[#d4a017] border-[#d4a017] shadow-md"
                                    : isActive
                                        ? "bg-white border-blue-400 shadow-blue-100 shadow-md"
                                        : "bg-white border-gray-200"
                                    }`}
                            >
                                {stage.done ? (
                                    <CheckCircle2 className="w-4 h-4 text-white" />
                                ) : isActive ? (
                                    <Clock className="w-4 h-4 text-blue-400 animate-pulse" />
                                ) : (
                                    <div className="w-2 h-2 rounded-full bg-gray-300" />
                                )}
                            </div>
                            {!isLast && (
                                <div className={`w-0.5 flex-1 my-1 ${stage.done ? "bg-[#d4a017]" : "bg-gray-200"}`} />
                            )}
                        </div>

                        {/* Content */}
                        <div className={`pb-6 flex-1 ${isLast ? "pb-0" : ""}`}>
                            <div className="flex items-start justify-between gap-2">
                                <div>
                                    <p className={`font-bold text-sm ${stage.done ? "text-gray-800" : isActive ? "text-blue-600" : "text-gray-400"}`}>
                                        {stage.label}
                                        {isActive && <span className="ml-2 text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-semibold">Saat Ini</span>}
                                    </p>
                                    <p className={`text-xs mt-0.5 leading-relaxed ${stage.done ? "text-gray-500" : "text-gray-400"}`}>
                                        {stage.desc}
                                    </p>
                                </div>
                                {stage.date && (
                                    <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap mt-0.5 flex-shrink-0">
                                        {stage.date}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

// ── Section Card ─────────────────────────────────────────────────────────────
function TrackingCard({
    icon: Icon,
    emoji,
    title,
    color,
    stages,
    extra,
}: {
    icon?: any;
    emoji?: string;
    title: string;
    color: string;
    stages: Stage[];
    extra?: React.ReactNode;
}) {
    const [expanded, setExpanded] = useState(true);
    const progress = getProgressPercent(stages);
    const status = getOverallStatus(stages);

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Header */}
            <button
                type="button"
                onClick={() => setExpanded((e) => !e)}
                className="w-full flex items-center gap-4 p-5 text-left hover:bg-gray-50/50 transition-colors"
            >
                {/* Icon */}
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                    {emoji ? (
                        <span className="text-xl">{emoji}</span>
                    ) : Icon ? (
                        <Icon className="w-5 h-5 text-white" />
                    ) : null}
                </div>

                {/* Title + status */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-gray-800 text-base">{title}</h3>
                        <StatusBadge status={status} />
                    </div>
                    {/* Progress bar */}
                    <div className="mt-2 flex items-center gap-3">
                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full transition-all duration-700"
                                style={{
                                    width: `${progress}%`,
                                    background: status === "selesai" ? "#22c55e" : status === "berjalan" ? "#d4a017" : "#d1d5db",
                                }}
                            />
                        </div>
                        <span className="text-xs font-bold text-gray-500">{progress}%</span>
                    </div>
                </div>

                <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform flex-shrink-0 ${expanded ? "rotate-180" : ""}`}
                />
            </button>

            {/* Body */}
            {expanded && (
                <div className="px-5 pb-5 pt-2 border-t border-gray-100">
                    {extra && <div className="mb-4">{extra}</div>}
                    <Timeline stages={stages} />
                </div>
            )}
        </div>
    );
}

// ── Star Rating ───────────────────────────────────────────────────────────────
function StarRating({ count }: { count: number }) {
    return (
        <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className={i < count ? "text-[#d4a017]" : "text-gray-200"} style={{ fontSize: 12 }}>★</span>
            ))}
        </div>
    );
}

// ── Detail Perjalanan Card ────────────────────────────────────────────────────
function DetailPerjalananCard({ tripDetail }: { tripDetail: TripDetail }) {
    const [activeTab, setActiveTab] = useState<"jadwal" | "hotel" | "mutawif">("jadwal");
    const [expandedDay, setExpandedDay] = useState<number | null>(1);

    const tabs = [
        { id: "jadwal", label: "Jadwal Harian", icon: Calendar },
        { id: "hotel", label: "Hotel", icon: Hotel },
        { id: "mutawif", label: "Mutawif", icon: UserCheck },
    ] as const;

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-4 p-5 border-b border-gray-100">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-[#d4a017] to-[#b88a10]">
                    <Compass className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h3 className="font-bold text-gray-800 text-base">Detail Perjalanan</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Jadwal, hotel, & informasi mutawif Anda</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-100 bg-gray-50/50">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-bold transition-all border-b-2 ${activeTab === tab.id
                                ? "border-[#d4a017] text-[#d4a017] bg-amber-50/50"
                                : "border-transparent text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            <Icon className="w-3.5 h-3.5" />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Tab Content */}
            <div className="p-5">

                {/* ── Tab: Jadwal Harian ── */}
                {activeTab === "jadwal" && (
                    <div className="space-y-3">
                        <p className="text-xs text-gray-500 font-medium mb-4">
                            📅 Total <strong>{tripDetail.itinerary.length} hari</strong> perjalanan ibadah
                        </p>
                        {tripDetail.itinerary.map((day) => (
                            <div key={day.day} className="border border-gray-100 rounded-xl overflow-hidden">
                                <button
                                    onClick={() => setExpandedDay(expandedDay === day.day ? null : day.day)}
                                    className="w-full flex items-center gap-3 p-4 text-left bg-gray-50/50 hover:bg-gray-100/50 transition-colors"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#d4a017] to-[#b88a10] flex items-center justify-center flex-shrink-0">
                                        <span className="text-white text-xs font-black">{day.day}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-gray-800 text-sm">{day.title}</p>
                                        <div className="flex items-center gap-1 mt-0.5">
                                            <MapPin className="w-3 h-3 text-gray-400" />
                                            <p className="text-xs text-gray-500">{day.location}</p>
                                        </div>
                                    </div>
                                    <ChevronDown
                                        className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${expandedDay === day.day ? "rotate-180" : ""}`}
                                    />
                                </button>
                                {expandedDay === day.day && (
                                    <div className="px-4 pb-4 pt-3 border-t border-gray-100 space-y-2">
                                        {day.activities.map((activity, idx) => (
                                            <div key={idx} className="flex items-start gap-2.5">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#d4a017] mt-1.5 flex-shrink-0" />
                                                <p className="text-sm text-gray-600 leading-relaxed">{activity}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* ── Tab: Hotel ── */}
                {activeTab === "hotel" && (
                    <div className="space-y-4">
                        {tripDetail.hotels.map((hotel, idx) => (
                            <div key={idx} className="border border-gray-100 rounded-xl overflow-hidden">
                                {/* Hotel Header */}
                                <div className="p-4 bg-gradient-to-r from-gray-50 to-amber-50/30">
                                    <div className="flex items-start justify-between gap-3 mb-3">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-[#d4a017] bg-amber-100 px-2.5 py-1 rounded-full">
                                                    {hotel.city}
                                                </span>
                                            </div>
                                            <h4 className="font-bold text-gray-900 text-base leading-tight">{hotel.name}</h4>
                                            <StarRating count={hotel.starRating} />
                                        </div>
                                        {hotel.roomNumber && (
                                            <div className="text-right flex-shrink-0">
                                                <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">Nomor Kamar</p>
                                                <div className="flex items-center gap-1.5 mt-1">
                                                    <BedDouble className="w-4 h-4 text-[#d4a017]" />
                                                    <p className="text-xl font-black text-gray-900">{hotel.roomNumber}</p>
                                                </div>
                                            </div>
                                        )}
                                        {!hotel.roomNumber && (
                                            <div className="text-right flex-shrink-0">
                                                <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">Nomor Kamar</p>
                                                <span className="inline-block mt-1 text-xs text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full font-semibold">
                                                    Menyusul
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Check-in / Check-out */}
                                    <div className="grid grid-cols-2 gap-3 mt-3">
                                        <div className="bg-white rounded-lg p-3 border border-gray-100">
                                            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">Check-in</p>
                                            <p className="text-sm font-bold text-gray-800 mt-0.5">{hotel.checkIn}</p>
                                        </div>
                                        <div className="bg-white rounded-lg p-3 border border-gray-100">
                                            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">Check-out</p>
                                            <p className="text-sm font-bold text-gray-800 mt-0.5">{hotel.checkOut}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Maps Button */}
                                <div className="p-4 border-t border-gray-100">
                                    <a
                                        href={hotel.mapsUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-sm text-white transition-all hover:scale-[1.02] hover:shadow-md active:scale-[0.98]"
                                        style={{ background: "linear-gradient(135deg, #4285F4, #1a73e8)" }}
                                    >
                                        <Navigation className="w-4 h-4" />
                                        Lihat Lokasi di Google Maps
                                        <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* ── Tab: Mutawif ── */}
                {activeTab === "mutawif" && (
                    <div>
                        {/* Mutawif Card */}
                        <div className="border border-gray-100 rounded-xl overflow-hidden">
                            {/* Avatar + Name */}
                            <div className="p-5 bg-gradient-to-br from-amber-50 to-orange-50/30 flex items-center gap-4">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#d4a017] to-[#b88a10] flex items-center justify-center flex-shrink-0 shadow-lg">
                                    {tripDetail.mutawif.photo ? (
                                        <img
                                            src={tripDetail.mutawif.photo}
                                            alt={tripDetail.mutawif.name}
                                            className="w-full h-full object-cover rounded-2xl"
                                        />
                                    ) : (
                                        <UserCheck className="w-8 h-8 text-white" />
                                    )}
                                </div>
                                <div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-[#d4a017] bg-amber-100 px-2.5 py-1 rounded-full">
                                        Mutawif
                                    </span>
                                    <h4 className="font-bold text-gray-900 text-lg leading-tight mt-1.5">{tripDetail.mutawif.name}</h4>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                                        <p className="text-sm text-gray-500">{tripDetail.mutawif.region}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Info */}
                            <div className="p-4 border-t border-gray-100 space-y-3">
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                    <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                                        <Phone className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">Nomor Telepon</p>
                                        <p className="text-sm font-bold text-gray-800">{tripDetail.mutawif.phone}</p>
                                    </div>
                                    <a
                                        href={`tel:${tripDetail.mutawif.phone}`}
                                        className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors"
                                    >
                                        Telepon
                                    </a>
                                </div>

                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                    <div className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                                        <svg className="w-4 h-4 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">WhatsApp</p>
                                        <p className="text-sm font-bold text-gray-800">{tripDetail.mutawif.whatsapp}</p>
                                    </div>
                                    <a
                                        href={`https://wa.me/${tripDetail.mutawif.whatsapp.replace(/[^0-9]/g, "").replace(/^0/, "62")}?text=Assalamualaikum%20Ustad%2C%20saya%20jamaah%20Jawara%20Wisata`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-3 py-1.5 rounded-lg text-white text-xs font-bold transition-colors hover:opacity-90"
                                        style={{ background: "#25D366" }}
                                    >
                                        WhatsApp
                                    </a>
                                </div>
                            </div>

                            {/* Info note */}
                            <div className="mx-4 mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                                <p className="text-xs text-amber-700 leading-relaxed">
                                    💡 <strong>Mutawif</strong> adalah pembimbing ibadah yang akan mendampingi perjalanan Anda selama di Tanah Suci.
                                    Beliau siap membantu 24 jam selama perjalanan ibadah.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// ── Main Dashboard ─────────────────────────────────────────────────────────────
import { uploadDocument } from "@/app/actions/upload-document";

export function TrackingDashboard({ booking }: { booking: Booking }) {
    const [copied, setCopied] = useState(false);
    const [ktpUrl, setKtpUrl] = useState(booking.ktpUrl || null);
    const [passportUrl, setPassportUrl] = useState(booking.passportUrl || null);
    const [uploadingDoc, setUploadingDoc] = useState<"ktp" | "passport" | null>(null);
    const notifications = buildNotifications(booking);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "ktp" | "passport") => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingDoc(type);
        try {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = async () => {
                const base64 = reader.result as string;
                const res = await uploadDocument(booking.invoiceId, type, base64);
                if (res?.success) {
                    if (type === "ktp") setKtpUrl(res.url || null);
                    if (type === "passport") setPassportUrl(res.url || null);
                    alert("Upload berhasil! Dokumen akan segera direview admin.");
                } else {
                    alert("Upload gagal: " + res?.error);
                }
                setUploadingDoc(null);
            };
        } catch (error) {
            alert("Terjadi kesalahan.");
            setUploadingDoc(null);
        }
    };

    const overallProgress = Math.round(
        (getProgressPercent(booking.payment.stages) +
            getProgressPercent(booking.document.stages) +
            getProgressPercent(booking.visa.stages) +
            getProgressPercent(booking.departure.stages)) /
        4
    );

    const handleCopy = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-stone-50">
            {/* ── Top Header ── */}
            <div
                className="relative overflow-hidden text-white pt-32 pb-10 px-4"
                style={{ background: "linear-gradient(135deg, #1a0a00 0%, #3d1500 50%, #6b2600 100%)" }}
            >
                {/* Islamic pattern */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="hdrp" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                                <g fill="none" stroke="#d4a017" strokeWidth="0.5">
                                    <polygon points="30,2 56,16 56,44 30,58 4,44 4,16" />
                                    <polygon points="30,12 48,22 48,42 30,52 12,42 12,22" />
                                </g>
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#hdrp)" />
                    </svg>
                </div>

                <div className="container mx-auto max-w-3xl relative z-10">
                    {/* Back + Share + Notification */}
                    <div className="flex items-center justify-between mb-6">
                        <Link href="/tracking" className="flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors">
                            <ArrowLeft className="w-4 h-4" /> Lacak Invoice Lain
                        </Link>
                        <div className="flex items-center gap-2">
                            <NotificationCenter notifications={notifications} />
                            <button
                                onClick={handleCopy}
                                className="flex items-center gap-1.5 text-white/60 hover:text-white text-sm transition-colors ml-1"
                            >
                                {copied ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Share2 className="w-4 h-4" />}
                                {copied ? "Tersalin!" : "Bagikan"}
                            </button>
                        </div>
                    </div>

                    {/* Invoice info */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-[10px] font-black uppercase tracking-widest text-[#d4a017] bg-[#d4a017]/10 border border-[#d4a017]/30 px-3 py-1 rounded-full">
                                    Tracking Invoice
                                </span>
                            </div>
                            <p className="font-mono text-2xl font-black text-white mb-1">{booking.invoiceId}</p>
                            <h1 className="text-white/80 text-base font-medium">{booking.packageName}</h1>
                        </div>

                        {/* Overall ring progress */}
                        <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-5 py-4">
                            <div className="relative w-16 h-16">
                                <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                                    <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="5" />
                                    <circle
                                        cx="32" cy="32" r="26" fill="none"
                                        stroke="#d4a017" strokeWidth="5"
                                        strokeLinecap="round"
                                        strokeDasharray={`${2 * Math.PI * 26 * overallProgress / 100} ${2 * Math.PI * 26}`}
                                        className="transition-all duration-700"
                                    />
                                </svg>
                                <span className="absolute inset-0 flex items-center justify-center text-white font-black text-sm">
                                    {overallProgress}%
                                </span>
                            </div>
                            <div>
                                <p className="text-white font-bold text-sm">Progress</p>
                                <p className="text-white/60 text-xs">Keseluruhan proses</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Content ── */}
            <div className="container mx-auto max-w-3xl px-4 py-8 space-y-5">

                {/* Booking info card */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <h2 className="font-bold text-gray-700 text-sm uppercase tracking-widest mb-4">Informasi Pemesanan</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {[
                            { icon: User, label: "Nama Jamaah", value: booking.jamaahName },
                            { icon: Phone, label: "WhatsApp", value: booking.whatsapp },
                            { icon: Calendar, label: "Tgl Pesan", value: booking.bookedAt },
                            { icon: Plane, label: "Maskapai", value: `${booking.airlines} (${booking.flightCode})` },
                            { icon: Calendar, label: "Keberangkatan", value: booking.departureDate },
                            { icon: Hotel, label: "Hotel Makkah", value: booking.hotelMakkah },
                        ].map((item, i) => (
                            <div key={i} className="flex items-start gap-2.5">
                                <item.icon className="w-4 h-4 text-[#d4a017] mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">{item.label}</p>
                                    <p className="text-sm font-semibold text-gray-800 leading-tight mt-0.5">{item.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Detail Perjalanan ── */}
                <DetailPerjalananCard tripDetail={booking.tripDetail} />

                {/* 1. Status Pembayaran */}
                <TrackingCard
                    icon={CreditCard}
                    title="Status Pembayaran"
                    color="bg-gradient-to-br from-blue-500 to-blue-600"
                    stages={booking.payment.stages}
                    extra={
                        <div className="bg-blue-50 rounded-xl p-4 flex items-center justify-between border border-blue-100">
                            <div>
                                <p className="text-xs text-blue-600 font-semibold">Skema {booking.payment.scheme}</p>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    Total dibayar: <strong className="text-gray-800">{formatIDR(booking.payment.paid)}</strong>
                                    {" "}/ {formatIDR(booking.payment.total)}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] text-gray-400 font-medium">Sisa tagihan</p>
                                <p className="text-lg font-black text-blue-600">{formatIDR(booking.payment.total - booking.payment.paid)}</p>
                            </div>
                        </div>
                    }
                />

                {/* 2. Status Dokumen */}
                <TrackingCard
                    icon={FileText}
                    title="Status Dokumen"
                    color="bg-gradient-to-br from-violet-500 to-violet-600"
                    stages={booking.document.stages}
                    extra={
                        <div className="flex flex-col gap-3">
                            <div className="bg-violet-50 rounded-xl p-3 border border-violet-100">
                                <p className="text-xs text-violet-600 font-semibold mb-3">
                                    💡 Pastikan paspor masih berlaku minimal <strong>6 bulan</strong> dari tanggal keberangkatan.
                                </p>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-white p-3 rounded-lg border border-violet-100 flex flex-col items-center text-center">
                                        <p className="text-xs font-bold text-gray-700 mb-2">💳 E-KTP</p>
                                        {ktpUrl ? (
                                            <a href={ktpUrl} target="_blank" className="text-xs text-green-600 font-bold bg-green-50 px-2 py-1 rounded">Lihat KTP ✓</a>
                                        ) : (
                                            <label className="text-xs bg-violet-600 text-white px-3 py-1.5 rounded cursor-pointer hover:bg-violet-700 transition font-medium w-full block">
                                                {uploadingDoc === "ktp" ? "Mengunggah..." : "Upload KTP"}
                                                <input type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => handleUpload(e, "ktp")} disabled={!!uploadingDoc} />
                                            </label>
                                        )}
                                    </div>
                                    <div className="bg-white p-3 rounded-lg border border-violet-100 flex flex-col items-center text-center">
                                        <p className="text-xs font-bold text-gray-700 mb-2">🛂 Paspor</p>
                                        {passportUrl ? (
                                            <a href={passportUrl} target="_blank" className="text-xs text-green-600 font-bold bg-green-50 px-2 py-1 rounded">Lihat Paspor ✓</a>
                                        ) : (
                                            <label className="text-xs bg-violet-600 text-white px-3 py-1.5 rounded cursor-pointer hover:bg-violet-700 transition font-medium w-full block">
                                                {uploadingDoc === "passport" ? "Mengunggah..." : "Upload Paspor"}
                                                <input type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => handleUpload(e, "passport")} disabled={!!uploadingDoc} />
                                            </label>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                />

                {/* 3. Status Visa */}
                <TrackingCard
                    emoji="🛂"
                    title="Status Visa"
                    color="bg-gradient-to-br from-amber-500 to-amber-600"
                    stages={booking.visa.stages}
                    extra={
                        <div className="bg-amber-50 rounded-xl p-3 border border-amber-100">
                            <p className="text-xs text-amber-700 font-semibold">
                                ⏳ Proses visa Umroh umumnya memakan waktu <strong>14–21 hari kerja</strong> setelah dokumen lengkap.
                            </p>
                        </div>
                    }
                />

                {/* 4. Status Keberangkatan */}
                <TrackingCard
                    icon={Plane}
                    title="Status Keberangkatan"
                    color="bg-gradient-to-br from-green-500 to-green-600"
                    stages={booking.departure.stages}
                    extra={
                        <div className="bg-green-50 rounded-xl p-4 border border-green-100 flex items-center gap-4">
                            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Plane className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-medium">Rencana Keberangkatan</p>
                                <p className="font-bold text-gray-800 text-sm">{booking.airlines} · {booking.flightCode}</p>
                                <p className="text-xs text-green-600 font-semibold">{booking.departureDate}</p>
                            </div>
                        </div>
                    }
                />

                {/* CTA — WhatsApp Admin */}
                <div
                    className="rounded-2xl p-6 text-center relative overflow-hidden"
                    style={{ background: "linear-gradient(135deg, #1a0a00, #3d1500)" }}
                >
                    <div className="absolute inset-0 opacity-10">
                        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <pattern id="ctap" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                                    <g fill="none" stroke="#d4a017" strokeWidth="0.4">
                                        <polygon points="20,2 37,11 37,29 20,38 3,29 3,11" />
                                    </g>
                                </pattern>
                            </defs>
                            <rect width="100%" height="100%" fill="url(#ctap)" />
                        </svg>
                    </div>
                    <div className="relative z-10">
                        <p className="text-white font-bold text-base mb-1">Ada pertanyaan tentang status Anda?</p>
                        <p className="text-white/60 text-sm mb-5">Tim admin Jawara Wisata siap membantu 24/7</p>
                        <a
                            href={`https://wa.me/6281234567890?text=Assalamualaikum%2C%20saya%20ingin%20menanyakan%20status%20invoice%20${booking.invoiceId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white text-sm transition-all hover:scale-105"
                            style={{ background: "#25D366" }}
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                            Hubungi Admin WhatsApp
                        </a>
                    </div>
                </div>

                {/* Bottom nav */}
                <div className="flex justify-center gap-4 pb-4">
                    <Link href="/tracking" className="text-sm text-gray-500 hover:text-[#d4a017] transition-colors font-medium">
                        ← Lacak Invoice Lain
                    </Link>
                    <Link href="/packages" className="text-sm text-gray-500 hover:text-[#d4a017] transition-colors font-medium">
                        Lihat Paket Lain →
                    </Link>
                </div>
            </div>
        </div>
    );
}
