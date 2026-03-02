"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
    ArrowLeft, CheckCircle2, Clock, XCircle, CreditCard,
    User, Plane, FileText, LayoutDashboard, Send, ExternalLink,
    ShieldAlert, Settings, Save, AlertCircle, Info, Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminBookingDetailPage() {
    const { id: rawId } = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [booking, setBooking] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    // Form inputs
    const [status, setStatus] = useState("");
    const [paymentStatus, setPaymentStatus] = useState("");
    const [trackingData, setTrackingData] = useState<any>({});
    const [tripDetail, setTripDetail] = useState<any>({});

    const supabase = createClient();
    const bookingId = (rawId as string).replace("INV-", "");

    useEffect(() => {
        const fetchDetail = async () => {
            setLoading(true);
            try {
                const { data, error: fetchErr } = await supabase
                    .from("bookings")
                    .select("*, packages(*), profiles(*)")
                    .eq("id", bookingId)
                    .single();

                if (fetchErr) throw fetchErr;
                if (!data) throw new Error("Booking tidak ditemukan");

                setBooking(data);
                setStatus(data.status);
                setPaymentStatus(data.payment_status);
                setTrackingData(data.tracking_data || {
                    document: { stages: [{ id: "ktp", label: "Dokumen Diverifikasi", desc: "Dokumen jamaah telah diverifikasi admin", done: data.status === "confirmed" }] },
                    visa: { stages: [{ id: "process", label: "Proses Verifikasi", desc: "Sedang dalam proses", done: false }, { id: "approved", label: "Visa Approved", desc: "Visa Umroh telah dikeluarkan", done: false }] },
                    departure: { stages: [{ id: "registered", label: "Terdaftar", desc: "Jamaah terdaftar dalam manifest", done: true }, { id: "scheduled", label: "Jadwal Ditetapkan", desc: "Menunggu Maskapai", done: false }] }
                });
                setTripDetail(data.trip_detail || {
                    hotels: [
                        { name: data.packages?.hotel_makkah || "Swissôtel Al Maqam", city: "Makkah", roomNumber: "", starRating: 5, mapsUrl: "", checkIn: "", checkOut: "" },
                        { name: data.packages?.hotel_madinah || "Anwar Al Madinah", city: "Madinah", roomNumber: "", starRating: 5, mapsUrl: "", checkIn: "", checkOut: "" }
                    ],
                    mutawif: { name: "Ustadz Pembimbing", phone: "", whatsapp: "", region: "Makkah/Madinah" },
                    itinerary: []
                });

            } catch (err: any) {
                setError(err.message);
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchDetail();
    }, [bookingId]);

    const handleUpdate = async () => {
        setSaving(true);
        setMessage(null);
        try {
            const { error: updErr } = await supabase
                .from("bookings")
                .update({
                    status: status,
                    payment_status: paymentStatus,
                    tracking_data: trackingData,
                    trip_detail: tripDetail
                } as any)
                .eq("id", bookingId);

            if (updErr) throw updErr;
            setMessage("Data berhasil diperbarui!");
            setTimeout(() => setMessage(null), 3000);
        } catch (err: any) {
            setError("Gagal memperbarui: " + err.message);
        } finally {
            setSaving(false);
        }
    };

    const toggleStage = (section: string, stageId: string) => {
        const newData = { ...trackingData };
        if (newData[section] && newData[section].stages) {
            newData[section].stages = newData[section].stages.map((s: any) =>
                s.id === stageId ? { ...s, done: !s.done, date: !s.done ? new Date().toLocaleDateString('id-ID') : undefined } : s
            );
            setTrackingData(newData);
        }
    };

    if (loading) return <div className="p-12 text-center text-gray-500">Memuat detail transaksi...</div>;
    if (error) return <div className="p-12 text-center text-red-500">Error: {error}</div>;

    const formatIDR = (n: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

    return (
        <div className="p-8 max-w-6xl mx-auto min-h-screen pb-24">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => router.back()} className="rounded-xl">
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Kelola Pemesanan Jamaah</h1>
                        <p className="text-sm text-gray-500">Invoice: <span className="font-mono text-[#d4a017] font-bold">INV-{booking.id.substring(0, 8).toUpperCase()}</span></p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button onClick={handleUpdate} disabled={saving} className="bg-[#d4a017] hover:bg-[#b88a10] text-white rounded-xl px-6 font-bold flex items-center gap-2">
                        {saving ? <LayoutDashboard className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {saving ? "Menyimpan..." : "Simpan Perubahan"}
                    </Button>
                </div>
            </div>

            {message && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
                    <CheckCircle2 className="w-5 h-5" /> {message}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Column 1: Info Jamaah & Paket */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="rounded-2xl border-gray-100 shadow-sm overflow-hidden">
                        <CardHeader className="bg-stone-50 border-b border-gray-100">
                            <CardTitle className="text-sm font-black uppercase text-gray-400">Status Transaksi</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div>
                                <Label className="text-xs font-bold text-gray-500 mb-2 block">Status Utama</Label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="w-full text-sm font-bold border rounded-xl px-3 py-2 bg-white ring-offset-background focus:ring-2 focus:ring-[#d4a017] outline-none"
                                >
                                    <option value="pending">PENDING (Menunggu)</option>
                                    <option value="confirmed">CONFIRMED (Diterima)</option>
                                    <option value="process">PROCESS (Diproses)</option>
                                    <option value="completed">COMPLETED (Selesai)</option>
                                    <option value="cancelled">CANCELLED (Batal)</option>
                                </select>
                            </div>
                            <div>
                                <Label className="text-xs font-bold text-gray-500 mb-2 block">Status Pembayaran</Label>
                                <select
                                    value={paymentStatus}
                                    onChange={(e) => setPaymentStatus(e.target.value)}
                                    className="w-full text-sm font-bold border rounded-xl px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-[#d4a017]"
                                >
                                    <option value="unpaid">UNPAID (Belum Bayar)</option>
                                    <option value="dp_paid">DP PAID (DP Diterima)</option>
                                    <option value="paid">PAID (Lunas)</option>
                                    <option value="refunded">REFUNDED (Dikembalikan)</option>
                                </select>
                            </div>

                            <div className="pt-4 border-t border-gray-100">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-[#d4a017] font-bold text-lg">
                                        {booking.profiles?.full_name?.charAt(0) || "J"}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900">{booking.profiles?.full_name}</p>
                                        <p className="text-xs text-gray-500">{booking.profiles?.email}</p>
                                    </div>
                                </div>
                                <div className="space-y-2.5">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-gray-400">No. WhatsApp:</span>
                                        <a href={`https://wa.me/${booking.tracking_data?.whatsapp || booking.profiles?.phone}`} target="_blank" className="font-bold text-blue-600 flex items-center gap-1">
                                            {booking.tracking_data?.whatsapp || booking.profiles?.phone || "N/A"} <ExternalLink className="w-3 h-3" />
                                        </a>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-gray-400">Total Tagihan:</span>
                                        <span className="font-black text-[#d4a017]">{formatIDR(booking.tracking_data?.price || booking.packages?.price || 0)}</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-2xl border-gray-100 shadow-sm">
                        <CardHeader className="bg-stone-50 border-b border-gray-100 py-4">
                            <CardTitle className="text-sm font-black uppercase text-gray-400">Dokumen Jamaah</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="flex items-center gap-3">
                                    <FileText className="w-5 h-5 text-gray-400" />
                                    <span className="text-sm font-medium">KTP Jamaah</span>
                                </div>
                                {booking.ktp_url ? (
                                    <a href={booking.ktp_url} target="_blank" className="text-xs font-bold text-[#d4a017] hover:underline flex items-center gap-1">
                                        Lihat <Download className="w-3 h-3" />
                                    </a>
                                ) : <span className="text-xs text-gray-400 italic">Belum Ada</span>}
                            </div>
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="flex items-center gap-3">
                                    <Plane className="w-5 h-5 text-gray-400" />
                                    <span className="text-sm font-medium">Paspor Jamaah</span>
                                </div>
                                {booking.passport_url ? (
                                    <a href={booking.passport_url} target="_blank" className="text-xs font-bold text-[#d4a017] hover:underline flex items-center gap-1">
                                        Lihat <Download className="w-3 h-3" />
                                    </a>
                                ) : <span className="text-xs text-gray-400 italic">Belum Ada</span>}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Column 2 & 3: Tabs for Tracking and Details */}
                <div className="lg:col-span-2">
                    <Tabs defaultValue="tracking" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-6 p-1 bg-gray-100 rounded-xl h-12">
                            <TabsTrigger value="tracking" className="rounded-lg font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">
                                Progress Tracking
                            </TabsTrigger>
                            <TabsTrigger value="details" className="rounded-lg font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">
                                Detail Keberangkatan (Hotel/Mutawif)
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="tracking" className="space-y-6 outline-none">
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-[#d4a017]" /> Update Real-Time Progres
                                </h3>

                                <div className="space-y-8">
                                    {/* Document Stages */}
                                    <div>
                                        <Label className="text-xs font-black uppercase text-gray-400 tracking-wider mb-4 block">Dokumen & Persyaratan</Label>
                                        <div className="space-y-3">
                                            {trackingData.document?.stages.map((stage: any) => (
                                                <div key={stage.id} className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${stage.done ? 'border-emerald-100 bg-emerald-50' : 'border-gray-100 bg-white'}`}>
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${stage.done ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-300'}`}>
                                                            <CheckCircle2 className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-gray-900">{stage.label}</p>
                                                            <p className="text-xs text-gray-500">{stage.desc}</p>
                                                        </div>
                                                    </div>
                                                    <Button variant={stage.done ? "ghost" : "outline"} onClick={() => toggleStage("document", stage.id)}>
                                                        {stage.done ? "Batalkan" : "Selesaikan"}
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Visa Stages */}
                                    <div>
                                        <Label className="text-xs font-black uppercase text-gray-400 tracking-wider mb-4 block">Verifikasi Visa Umroh</Label>
                                        <div className="space-y-3">
                                            {trackingData.visa?.stages.map((stage: any) => (
                                                <div key={stage.id} className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${stage.done ? 'border-emerald-100 bg-emerald-50' : 'border-gray-100 bg-white'}`}>
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${stage.done ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-300'}`}>
                                                            <CheckCircle2 className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-gray-900">{stage.label}</p>
                                                            <p className="text-xs text-gray-500">{stage.desc}</p>
                                                        </div>
                                                    </div>
                                                    <Button variant={stage.done ? "ghost" : "outline"} onClick={() => toggleStage("visa", stage.id)}>
                                                        {stage.done ? "Batalkan" : "Selesaikan"}
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Departure Stages */}
                                    <div>
                                        <Label className="text-xs font-black uppercase text-gray-400 tracking-wider mb-4 block">Manifest & Keberangkatan</Label>
                                        <div className="space-y-3">
                                            {trackingData.departure?.stages.map((stage: any) => (
                                                <div key={stage.id} className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${stage.done ? 'border-emerald-100 bg-emerald-50' : 'border-gray-100 bg-white'}`}>
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${stage.done ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-300'}`}>
                                                            <CheckCircle2 className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-gray-900">{stage.label}</p>
                                                            <p className="text-xs text-gray-500">{stage.desc}</p>
                                                        </div>
                                                    </div>
                                                    <Button variant={stage.done ? "ghost" : "outline"} onClick={() => toggleStage("departure", stage.id)}>
                                                        {stage.done ? "Batalkan" : "Selesaikan"}
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-3">
                                    <Info className="w-5 h-5 text-blue-500 mt-0.5" />
                                    <p className="text-xs text-blue-700 leading-relaxed">
                                        Perubahan pada progres di atas akan <strong>langsung terlihat secara real-time</strong> oleh jamaah di halaman login & tracking mereka. Pastikan data sudah valid sebelum menekan simpan.
                                    </p>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="details" className="space-y-6 outline-none">
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                                    <Plane className="w-5 h-5 text-[#d4a017]" /> Informasi Keberangkatan Spesifik
                                </h3>

                                <div className="space-y-6">
                                    {/* Hotel Makkah */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="col-span-2">
                                            <Label className="text-sm font-bold text-gray-700">Hotel Makkah</Label>
                                            <Input
                                                value={tripDetail.hotels?.[0]?.name || ""}
                                                onChange={(e) => {
                                                    const h = [...tripDetail.hotels];
                                                    h[0] = { ...h[0], name: e.target.value };
                                                    setTripDetail({ ...tripDetail, hotels: h });
                                                }}
                                                className="mt-1 rounded-xl"
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-xs font-bold text-gray-500">Nomor Kamar</Label>
                                            <Input
                                                value={tripDetail.hotels?.[0]?.roomNumber || ""}
                                                onChange={(e) => {
                                                    const h = [...tripDetail.hotels];
                                                    h[0] = { ...h[0], roomNumber: e.target.value };
                                                    setTripDetail({ ...tripDetail, hotels: h });
                                                }}
                                                className="mt-1 rounded-xl"
                                                placeholder="Contoh: 1205"
                                            />
                                        </div>
                                    </div>

                                    {/* Hotel Madinah */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="col-span-2">
                                            <Label className="text-sm font-bold text-gray-700">Hotel Madinah</Label>
                                            <Input
                                                value={tripDetail.hotels?.[1]?.name || ""}
                                                onChange={(e) => {
                                                    const h = [...tripDetail.hotels];
                                                    h[1] = { ...h[1], name: e.target.value };
                                                    setTripDetail({ ...tripDetail, hotels: h });
                                                }}
                                                className="mt-1 rounded-xl"
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-xs font-bold text-gray-500">Nomor Kamar</Label>
                                            <Input
                                                value={tripDetail.hotels?.[1]?.roomNumber || ""}
                                                onChange={(e) => {
                                                    const h = [...tripDetail.hotels];
                                                    h[1] = { ...h[1], roomNumber: e.target.value };
                                                    setTripDetail({ ...tripDetail, hotels: h });
                                                }}
                                                className="mt-1 rounded-xl"
                                                placeholder="Contoh: 812"
                                            />
                                        </div>
                                    </div>

                                    {/* Mutawif */}
                                    <div className="pt-4 border-t border-gray-100">
                                        <Label className="text-sm font-bold text-gray-700 block mb-4">Informasi Mutawif</Label>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <Label className="text-xs font-bold text-gray-500">Nama Mutawif / Pembimbing</Label>
                                                <Input
                                                    value={tripDetail.mutawif?.name || ""}
                                                    onChange={(e) => setTripDetail({ ...tripDetail, mutawif: { ...tripDetail.mutawif, name: e.target.value } })}
                                                    className="mt-1 rounded-xl"
                                                />
                                            </div>
                                            <div>
                                                <Label className="text-xs font-bold text-gray-500">No. WhatsApp Mutawif</Label>
                                                <Input
                                                    value={tripDetail.mutawif?.whatsapp || ""}
                                                    onChange={(e) => setTripDetail({ ...tripDetail, mutawif: { ...tripDetail.mutawif, whatsapp: e.target.value } })}
                                                    className="mt-1 rounded-xl"
                                                    placeholder="Contoh: 628xxx"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}

