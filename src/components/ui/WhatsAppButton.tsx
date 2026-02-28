"use client";

import { useState, useEffect, useRef } from "react";
import { X, MessageCircle, Send, Phone, ArrowRight, Minimize2, ChevronDown } from "lucide-react";

/* ── Types ─────────────────────────────────────────────────────────────── */
type Role = "bot" | "user";

interface Message {
    id: string;
    role: Role;
    text: string;
    time: string;
    options?: string[];
}

/* ── Config ── */
const WA_NUMBER = "6281234567890"; // ganti nomor WA admin
const WA_GREET = "Assalamualaikum, saya ingin bertanya tentang paket Umroh/Haji Jawara Wisata.";
const ADMIN_NAME = "Admin Jawara";
const ADMIN_AVATAR = "J";
const CHAT_COLOR = "#d4a017";

/* ── Auto-reply brain ───────────────────────────────────────────────────── */
const AUTO_REPLIES: { keywords: string[]; reply: string; options?: string[] }[] = [
    {
        keywords: ["harga", "biaya", "tarif", "berapa", "price", "cost"],
        reply: "Harga paket Umroh kami mulai dari **Rp 19.900.000** (Budget 8 hari) hingga **Rp 52.000.000** (Plus Eropa 18 hari). Untuk Haji Khusus mulai **Rp 185.000.000**.\n\nMau info paket yang mana? 🕌",
        options: ["Paket Budget", "Paket Reguler", "Paket VIP", "Haji Khusus"],
    },
    {
        keywords: ["dp", "down payment", "uang muka", "cicil", "cicilan", "installment"],
        reply: "Kami menerima pembayaran DP mulai **Rp 5.000.000** untuk memastikan seat Anda. Sisanya bisa dicicil 3x tanpa bunga atau dilunasi sebelum keberangkatan. 💳",
        options: ["Info Cicilan Lengkap", "Hubungi Admin", "Lihat Paket"],
    },
    {
        keywords: ["syarat", "dokumen", "persyaratan", "paspor", "ktp", "visa"],
        reply: "Dokumen yang diperlukan:\n✅ KTP asli\n✅ Paspor aktif (min. 6 bulan)\n✅ Foto 4x6 bg putih & 3x4 bg merah\n✅ Kartu Keluarga\n✅ Buku Nikah (jika perlu mahrom)\n\nBiasanya kami bantu urus pengurusan paspor & visa! 📄",
        options: ["Info Pengurusan Visa", "Tanya Lebih Lanjut"],
    },
    {
        keywords: ["jadwal", "berangkat", "tanggal", "kapan", "schedule", "departure"],
        reply: "Jadwal keberangkatan terdekat:\n🗓️ **15 Mei 2026** – Umroh Plus Turki\n🗓️ **10 Jun 2026** – Umroh Reguler Syawal\n🗓️ **25 Jun 2026** – Umroh Zulhijjah\n\nMasih banyak seat tersedia! Segera amankan tempat Anda. ✈️",
        options: ["Lihat Semua Jadwal", "Pesan Sekarang"],
    },
    {
        keywords: ["hotel", "penginapan", "bintang", "makkah", "madinah"],
        reply: "Hotel yang kami gunakan antara lain:\n🏨 **Makkah**: Swissôtel Al Maqam, Pullman ZamZam, Fairmont Clock Royal\n🏨 **Madinah**: Anwar Al Madinah, Hilton Madinah, The Oberoi\n\nSemua bintang 4-5 dengan jarak dekat ke Masjidil Haram! 🕌",
        options: ["Detail Hotel per Paket", "Foto Hotel"],
    },
    {
        keywords: ["ustadz", "pembimbing", "guide", "muthawif"],
        reply: "Jamaah kami dibimbing oleh ustadz berpengalaman:\n👨‍🏫 Ustadz Adi Hidayat, Lc., M.A.\n👨‍🏫 Ustadz Abdul Somad, Lc., M.A.\n👨‍🏫 Ustadz Hanan Attaki, Lc.\n👨‍🏫 KH. Miftah Maulana\n\nRasakan pengalaman ibadah yang bermakna dengan bimbingan terbaik! 🤲",
        options: ["Profil Ustadz Lengkap"],
    },
    {
        keywords: ["tracking", "status", "lacak", "pantau"],
        reply: "Anda bisa memantau status pemesanan secara real-time melalui fitur **Tracking** kami:\n🔍 Status Pembayaran\n📄 Status Dokumen\n🛂 Status Visa\n✈️ Status Keberangkatan\n\nBuka halaman tracking dan masukkan nomor invoice Anda!",
        options: ["Buka Halaman Tracking"],
    },
    {
        keywords: ["promo", "diskon", "flash sale", "murah", "hemat"],
        reply: "⚡ **Flash Sale sedang berjalan!**\n\n🔥 Umroh Plus Turki – hemat 11% → **Rp 28.900.000**\n🔥 Umroh Syawal – hemat 13% → **Rp 24.900.000**\n🔥 Umroh VIP Ramadhan – hemat 11% → **Rp 39.900.000**\n\n*Terbatas! Seat hampir habis.* 🏃",
        options: ["Pesan Flash Sale", "Lihat Semua Promo"],
    },
    {
        keywords: ["daftar", "booking", "pesan", "beli", "register", "order"],
        reply: "Cara booking sangat mudah:\n1️⃣ Pilih paket di halaman Packages\n2️⃣ Klik **Pesan Sekarang**\n3️⃣ Isi data jamaah & upload dokumen\n4️⃣ Pilih skema & metode pembayaran\n5️⃣ Selesai! Tim kami akan menghubungi Anda\n\nMau langsung daftarkan sekarang? 😊",
        options: ["Lihat Paket", "Booking Sekarang", "Tanya Admin"],
    },
    {
        keywords: ["kontak", "telepon", "hubungi", "alamat", "kantor", "contact", "office"],
        reply: "Hubungi kami:\n📞 **+62 812-3456-7890** (WA & Call)\n📧 info@jawarawisata.com\n🏢 Jl. Raya Haji Nawi No. 12, Jakarta Selatan\n\nJam operasional: Senin–Sabtu, 08.00–17.00 WIB. Tim online 24/7 via WhatsApp! 🟢",
        options: ["WhatsApp Sekarang", "Email Kami"],
    },
];

const WELCOME_MESSAGE: Message = {
    id: "welcome",
    role: "bot",
    time: now(),
    text: "Assalamualaikum! 👋 Selamat datang di **Jawara Wisata**.\n\nSaya siap membantu Anda merencanakan perjalanan ibadah ke Tanah Suci. Ada yang bisa saya bantu?",
    options: ["Lihat Harga Paket", "Info Jadwal Berangkat", "Cara Daftar", "Promo Flash Sale", "Hubungi Admin via WA"],
};

function now() {
    return new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
}
function uid() {
    return Math.random().toString(36).slice(2);
}

/* ── Markdown bold renderer ─────────────────────────────────────────── */
function renderText(text: string) {
    const parts = text.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, i) =>
        i % 2 === 1 ? <strong key={i} className="font-bold">{part}</strong> : part
    );
}

/* ── Chat Message Bubble ─────────────────────────────────────────────── */
function Bubble({ msg, onOption }: { msg: Message; onOption: (opt: string) => void }) {
    const isBot = msg.role === "bot";
    return (
        <div className={`flex gap-2.5 ${isBot ? "" : "flex-row-reverse"} items-end mb-4`}>
            {/* Avatar */}
            {isBot && (
                <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-black flex-shrink-0"
                    style={{ background: `linear-gradient(135deg, ${CHAT_COLOR}, #b88a10)` }}
                >
                    {ADMIN_AVATAR}
                </div>
            )}

            <div className={`max-w-[78%] flex flex-col ${isBot ? "" : "items-end"}`}>
                {/* Bubble */}
                <div
                    className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${isBot
                        ? "bg-gray-100 text-gray-800 rounded-bl-sm"
                        : "text-white rounded-br-sm"
                        }`}
                    style={isBot ? {} : { background: `linear-gradient(135deg, ${CHAT_COLOR}, #b88a10)` }}
                >
                    {renderText(msg.text)}
                </div>

                {/* Timestamp */}
                <span className="text-[10px] text-gray-400 mt-1 px-1">{msg.time}</span>

                {/* Quick reply options */}
                {isBot && msg.options && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                        {msg.options.map((opt) => (
                            <button
                                key={opt}
                                onClick={() => onOption(opt)}
                                className="text-xs font-semibold border rounded-full px-3 py-1 transition-all hover:text-white"
                                style={{ borderColor: CHAT_COLOR, color: CHAT_COLOR, background: "transparent" }}
                                onMouseEnter={e => { (e.target as HTMLElement).style.background = CHAT_COLOR; (e.target as HTMLElement).style.color = "white"; }}
                                onMouseLeave={e => { (e.target as HTMLElement).style.background = "transparent"; (e.target as HTMLElement).style.color = CHAT_COLOR; }}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

/* ── Typing indicator ──────────────────────────────────────────────── */
function TypingIndicator() {
    return (
        <div className="flex gap-2.5 items-end mb-4">
            <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-black flex-shrink-0"
                style={{ background: `linear-gradient(135deg, ${CHAT_COLOR}, #b88a10)` }}
            >
                {ADMIN_AVATAR}
            </div>
            <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-3">
                <div className="flex gap-1 items-center">
                    {[0, 1, 2].map((i) => (
                        <div
                            key={i}
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: `${i * 0.15}s` }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

import { usePathname } from "next/navigation";

/* ── Main Widget ────────────────────────────────────────────────────── */
export function ChatWidget() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    const [minimized, setMinimized] = useState(false);
    const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
    const [input, setInput] = useState("");
    const [typing, setTyping] = useState(false);

    const [unread, setUnread] = useState(1);
    const [activeTab, setActiveTab] = useState<"chat" | "wa">("chat");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto scroll
    useEffect(() => {
        if (open && !minimized) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, typing, open, minimized]);

    // Reset unread when opened
    useEffect(() => {
        if (open) setUnread(0);
    }, [open]);

    // Show notification badge after 3s if not opened
    useEffect(() => {
        const t = setTimeout(() => {
            if (!open) setUnread(1);
        }, 3000);
        return () => clearTimeout(t);
    }, []);

    /* Auto-reply logic */
    function getAutoReply(text: string): { reply: string; options?: string[] } {
        const lower = text.toLowerCase();

        // Check keyword matches
        for (const ar of AUTO_REPLIES) {
            if (ar.keywords.some((kw) => lower.includes(kw))) {
                return { reply: ar.reply, options: ar.options };
            }
        }

        // Handle quick options
        if (lower.includes("lihat harga") || lower.includes("paket budget")) {
            return AUTO_REPLIES.find(a => a.keywords.includes("harga"))!;
        }
        if (lower.includes("cara daftar") || lower.includes("booking sekarang")) {
            return AUTO_REPLIES.find(a => a.keywords.includes("daftar"))!;
        }
        if (lower.includes("promo") || lower.includes("flash sale")) {
            return AUTO_REPLIES.find(a => a.keywords.includes("promo"))!;
        }
        if (lower.includes("hubungi admin") || lower.includes("whatsapp sekarang") || lower.includes("tanya admin")) {
            return {
                reply: "Baik! Saya akan mengarahkan Anda ke WhatsApp admin kami. Tim kami siap melayani 24/7 dan akan membalas dalam hitungan menit. 🟢",
                options: ["Buka WhatsApp Admin"],
            };
        }
        if (lower.includes("buka whatsapp") || lower.includes("buka halaman tracking")) {
            if (lower.includes("tracking")) {
                return { reply: "Silakan buka halaman tracking: **/tracking** — masukkan nomor invoice Anda untuk melihat status lengkap pemesanan! 🔍" };
            }
            return {
                reply: "Klik tombol di bawah untuk langsung chat dengan admin kami di WhatsApp. Respons cepat, ramah, dan profesional! 💬",
                options: ["Buka WhatsApp Admin"],
            };
        }

        // Default fallback
        return {
            reply: "Terima kasih pesannya! 🙏 Untuk pertanyaan lebih spesifik, silakan pilih topik di bawah atau hubungi admin kami langsung via WhatsApp.",
            options: ["Lihat Harga", "Info Jadwal", "Hubungi Admin via WA", "Promo Flash Sale"],
        };
    }

    /* Send message */
    const handleSend = (text?: string) => {
        const rawText = (text || input).trim();
        if (!rawText) return;

        const userMsg: Message = { id: uid(), role: "user", text: rawText, time: now() };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setTyping(true);

        // Simulate bot typing delay
        setTimeout(() => {
            setTyping(false);
            const { reply, options } = getAutoReply(rawText);

            // Special action: open WA
            if (rawText.toLowerCase().includes("buka whatsapp")) {
                window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(WA_GREET)}`, "_blank");
            }

            const botMsg: Message = { id: uid(), role: "bot", text: reply, time: now(), options };
            setMessages((prev) => [...prev, botMsg]);
        }, 800 + Math.random() * 600);
    };

    const waUrl = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(WA_GREET)}`;

    if (pathname?.startsWith("/admin") || pathname?.startsWith("/android")) return null;

    /* ── Render ── */
    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
            {/* ── Chat Panel ── */}
            {open && (
                <div
                    className={`flex flex-col rounded-3xl shadow-2xl overflow-hidden border border-gray-200 bg-white transition-all duration-300 ${minimized ? "h-14 w-80" : "w-[360px] h-[540px] sm:h-[580px]"
                        }`}
                    style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.18)" }}
                >
                    {/* Header */}
                    <div
                        className="flex items-center gap-3 px-4 py-3 cursor-pointer select-none"
                        style={{ background: `linear-gradient(135deg, #1a0a00, #3d1500, ${CHAT_COLOR})` }}
                        onClick={() => setMinimized((m) => !m)}
                    >
                        {/* Online dot + avatar */}
                        <div className="relative">
                            <div
                                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-base"
                                style={{ background: "rgba(255,255,255,0.15)" }}
                            >
                                {ADMIN_AVATAR}
                            </div>
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
                        </div>
                        <div className="flex-1">
                            <p className="text-white font-bold text-sm leading-tight">{ADMIN_NAME}</p>
                            <p className="text-white/60 text-xs flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                                Online · Biasanya membalas dalam menit
                            </p>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); setMinimized((m) => !m); }}
                                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-white/60 hover:text-white"
                            >
                                {minimized ? <ChevronDown className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                            </button>
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); setOpen(false); }}
                                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-white/60 hover:text-white"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {!minimized && (
                        <>
                            {/* Tab Bar */}
                            <div className="flex border-b border-gray-100 bg-gray-50">
                                {[
                                    { id: "chat", label: "💬 Live Chat" },
                                    { id: "wa", label: "📱 WhatsApp" },
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        type="button"
                                        onClick={() => setActiveTab(tab.id as any)}
                                        className={`flex-1 py-2.5 text-xs font-bold transition-all ${activeTab === tab.id
                                            ? "text-[#d4a017] border-b-2 border-[#d4a017] bg-white"
                                            : "text-gray-500 hover:text-gray-700"
                                            }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            {/* ── LIVE CHAT Tab ── */}
                            {activeTab === "chat" && (
                                <>
                                    {/* Messages */}
                                    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-0 bg-white"
                                        style={{ backgroundImage: "radial-gradient(circle at 20px 20px, #fef9ec 1px, transparent 0)", backgroundSize: "40px 40px" }}
                                    >
                                        {messages.map((msg) => (
                                            <Bubble key={msg.id} msg={msg} onOption={handleSend} />
                                        ))}
                                        {typing && <TypingIndicator />}
                                        <div ref={messagesEndRef} />
                                    </div>

                                    {/* Input */}
                                    <div className="px-3 py-3 border-t border-gray-100 bg-white">
                                        <div className="flex items-center gap-2 bg-gray-100 rounded-2xl px-3 py-2">
                                            <input
                                                type="text"
                                                value={input}
                                                onChange={(e) => setInput(e.target.value)}
                                                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                                placeholder="Ketik pesan Anda..."
                                                className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleSend()}
                                                disabled={!input.trim()}
                                                className="w-8 h-8 rounded-xl flex items-center justify-center text-white transition-all disabled:opacity-40"
                                                style={{ background: `linear-gradient(135deg, ${CHAT_COLOR}, #b88a10)` }}
                                            >
                                                <Send className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <p className="text-center text-[10px] text-gray-400 mt-2">
                                            💬 Chat otomatis aktif · Admin online 24/7
                                        </p>
                                    </div>
                                </>
                            )}

                            {/* ── WHATSAPP Tab ── */}
                            {activeTab === "wa" && (
                                <div className="flex-1 overflow-y-auto bg-white">
                                    {/* WA hero */}
                                    <div className="p-5 text-center border-b border-gray-100">
                                        <div className="w-16 h-16 rounded-2xl mx-auto mb-3 flex items-center justify-center" style={{ background: "#25D366" }}>
                                            <svg className="w-9 h-9 text-white" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                            </svg>
                                        </div>
                                        <h3 className="font-bold text-gray-800 mb-1">Chat via WhatsApp</h3>
                                        <p className="text-xs text-gray-500">Respons cepat · Tim online 24/7</p>
                                    </div>

                                    {/* Quick WA messages */}
                                    <div className="p-4 space-y-2">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Pesan Cepat</p>
                                        {[
                                            { emoji: "💬", text: "Halo, saya mau tanya tentang paket Umroh" },
                                            { emoji: "💳", text: "Saya ingin tanya tentang harga dan DP" },
                                            { emoji: "📄", text: "Apa saja dokumen yang diperlukan?" },
                                            { emoji: "🗓️", text: "Kapan jadwal keberangkatan terdekat?" },
                                            { emoji: "⚡", text: "Ada promo / flash sale sekarang?" },
                                            { emoji: "🔍", text: "Saya ingin cek status pemesanan saya" },
                                        ].map((item) => (
                                            <a
                                                key={item.text}
                                                href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(item.text)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-[#25D366]/40 hover:bg-green-50/50 transition-all group"
                                            >
                                                <span className="text-base flex-shrink-0">{item.emoji}</span>
                                                <span className="text-sm text-gray-700 group-hover:text-gray-900 flex-1 leading-tight">{item.text}</span>
                                                <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#25D366] flex-shrink-0 transition-colors" />
                                            </a>
                                        ))}
                                    </div>

                                    {/* Main WA CTA */}
                                    <div className="px-4 pb-5">
                                        <a
                                            href={waUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-2xl font-bold text-white text-sm transition-all hover:opacity-90 hover:scale-[1.02]"
                                            style={{ background: "linear-gradient(135deg, #25D366, #128C7E)" }}
                                        >
                                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                            </svg>
                                            Chat WhatsApp Admin Sekarang
                                        </a>
                                        <div className="flex items-center justify-center gap-4 mt-3">
                                            <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                                                <Phone className="w-3 h-3" />
                                                +62 812-3456-7890
                                            </div>
                                            <div className="flex items-center gap-1.5 text-[10px] text-green-500 font-semibold">
                                                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                                                Online Sekarang
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}

            {/* ── Floating Button ── */}
            <button
                type="button"
                onClick={() => { setOpen((o) => !o); setUnread(0); }}
                className="relative w-14 h-14 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95"
                style={{
                    background: open
                        ? "#ef4444"
                        : `linear-gradient(135deg, ${CHAT_COLOR}, #b88a10)`,
                    boxShadow: open
                        ? "0 8px 25px rgba(239,68,68,0.4)"
                        : `0 8px 25px rgba(212,160,23,0.5)`,
                }}
                aria-label={open ? "Tutup chat" : "Buka chat"}
            >
                {/* Pulse ring */}
                {!open && (
                    <div
                        className="absolute inset-0 rounded-full animate-ping opacity-40"
                        style={{ background: CHAT_COLOR }}
                    />
                )}

                {open ? (
                    <X className="w-6 h-6" />
                ) : (
                    <MessageCircle className="w-7 h-7" />
                )}

                {/* Unread badge */}
                {!open && unread > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-black text-white border-2 border-white">
                        {unread}
                    </div>
                )}
            </button>
        </div>
    );
}
