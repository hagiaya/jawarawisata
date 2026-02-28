"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Plus, Trash2, CheckCircle, Clock, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

// Reusing types from tracking
interface Stage {
    id: string;
    label: string;
    desc: string;
    done: boolean;
    date?: string;
}

interface TrackingData {
    payment: {
        scheme: string;
        total: number;
        paid: number;
        stages: Stage[];
    };
    document: { stages: Stage[] };
    visa: { stages: Stage[] };
    departure: { stages: Stage[] };
    tripDetail?: any; // For future or simpler raw JSON edit
}

const DEFAULT_TRACKING: TrackingData = {
    payment: {
        scheme: "Tunai",
        total: 0,
        paid: 0,
        stages: [
            { id: "dp", label: "DP Diterima", desc: "Down Payment telah dikonfirmasi", done: false, date: "" },
            { id: "lunas", label: "Pembayaran Lunas", desc: "Total pembiayaan paket telah terpenuhi", done: false, date: "" },
        ]
    },
    document: {
        stages: [
            { id: "ktp", label: "KTP Diterima", desc: "Kartu Tanda Penduduk telah diverifikasi", done: false, date: "" },
            { id: "passport", label: "Paspor Diterima", desc: "Paspor aktif min. 6 bulan dari keberangkatan", done: false, date: "" },
            { id: "complete", label: "Dokumen Lengkap", desc: "Seluruh dokumen telah diverifikasi admin", done: false, date: "" },
        ]
    },
    visa: {
        stages: [
            { id: "submit", label: "Pengajuan Visa", desc: "Dokumen diajukan ke Kedutaan", done: false, date: "" },
            { id: "process", label: "Proses Verifikasi", desc: "Verifikasi oleh Kedutaan", done: false, date: "" },
            { id: "approved", label: "Visa Approved", desc: "Visa Umroh telah dikeluarkan", done: false, date: "" },
        ]
    },
    departure: {
        stages: [
            { id: "registered", label: "Terdaftar", desc: "Jamaah terdaftar dalam manifest", done: true, date: "" },
            { id: "scheduled", label: "Jadwal", desc: "Penerbangan & jadwal", done: false, date: "" },
            { id: "briefing", label: "Manasik & Briefing", desc: "Pertemuan manasik wajib", done: false, date: "" },
            { id: "departed", label: "Keberangkatan", desc: "Pesawat lepas landas", done: false, date: "" },
        ]
    }
};

export default function EditTrackingPage() {
    const params = useParams();
    const router = useRouter();
    const invoiceId = params.invoiceId as string;
    const cleanId = invoiceId.replace("INV-", "");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [bookingRef, setBookingRef] = useState<any>(null);
    const [data, setData] = useState<TrackingData>(DEFAULT_TRACKING);

    useEffect(() => {
        const fetchDB = async () => {
            try {
                const { publicSupabase } = await import("@/lib/supabase/public");
                const { data: res, error } = await publicSupabase
                    .from("bookings")
                    .select("*, packages(*), profiles(*)")
                    .eq("id", cleanId)
                    .single();

                if (!error && res) {
                    setBookingRef(res);
                    if (res.tracking_data) {
                        // Merge with default to ensure structure exists
                        setData({ ...DEFAULT_TRACKING, ...res.tracking_data });
                    }
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchDB();
    }, [cleanId]);

    const handleSave = async () => {
        setSaving(true);
        try {
            const { publicSupabase } = await import("@/lib/supabase/public");
            const { error } = await publicSupabase
                .from("bookings")
                .update({ tracking_data: data as any })
                .eq("id", cleanId);

            if (error) {
                // Ignore column error if column doesn't exist, just alert user to add it
                if (error.code === 'PGRST204' || error.message.includes('column')) {
                    alert("Gagal menyimpan. Pastikan Anda telah menjalankan ALTER TABLE bookings ADD COLUMN tracking_data JSONB; di Supabase.");
                } else {
                    alert("Error menyimpan: " + error.message);
                }
            } else {
                alert("Berhasil menyimpan tracking.");
                router.push("/admin/bookings");
            }
        } catch (err: any) {
            alert("Error: " + err.message);
        } finally {
            setSaving(false);
        }
    };

    const updateStage = (section: keyof TrackingData, idx: number, key: keyof Stage, val: any) => {
        setData(prev => {
            const current = (prev[section] as any).stages;
            const newStages = [...current];
            newStages[idx] = { ...newStages[idx], [key]: val };
            return {
                ...prev,
                [section]: {
                    ...prev[section],
                    stages: newStages
                }
            };
        });
    };

    const addStage = (section: keyof TrackingData) => {
        setData(prev => {
            const current = (prev[section] as any).stages;
            return {
                ...prev,
                [section]: {
                    ...prev[section],
                    stages: [...current, { id: `s_${Date.now()}`, label: "Tahap Baru", desc: "", done: false, date: "" }]
                }
            };
        });
    };

    const removeStage = (section: keyof TrackingData, idx: number) => {
        setData(prev => {
            const current = (prev[section] as any).stages;
            const newStages = [...current];
            newStages.splice(idx, 1);
            return {
                ...prev,
                [section]: {
                    ...prev[section],
                    stages: newStages
                }
            };
        });
    };

    if (loading) return <div className="p-8">Tunggu sebentar...</div>;

    const sections: { key: keyof TrackingData; title: string; subtitle: string }[] = [
        { key: "payment", title: "Pembayaran", subtitle: "Tracking tagihan dan kwitansi" },
        { key: "document", title: "Dokumen", subtitle: "Status kelengkapan KTP & Paspor" },
        { key: "visa", title: "Visa", subtitle: "Status pengajuan Visa" },
        { key: "departure", title: "Keberangkatan", subtitle: "Status jadwal & Manasik" },
    ];

    return (
        <div className="p-8 max-w-5xl mx-auto min-h-screen">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link href="/admin/bookings" className="p-2 border rounded-xl hover:bg-gray-50 flex items-center justify-center">
                        <ArrowLeft className="w-5 h-5 text-gray-500" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Tracking Editor</h1>
                        <p className="text-gray-500 text-sm mt-0.5">Lengkapi data progress untuk {invoiceId}</p>
                    </div>
                </div>
                <Button onClick={handleSave} disabled={saving} className="bg-[#d4a017] hover:bg-[#b88a10] text-white flex gap-2 rounded-xl">
                    <Save className="w-4 h-4" /> {saving ? "Menyimpan..." : "Simpan Perubahan"}
                </Button>
            </div>

            {bookingRef && (
                <div className="mb-8 p-6 bg-white border border-gray-100 rounded-2xl flex flex-col md:flex-row md:items-center gap-6 shadow-sm">
                    <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Jamaah</p>
                            <p className="font-bold text-gray-800">{bookingRef.profiles?.full_name || "Tanpa Nama"}</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Paket</p>
                            <p className="font-bold text-gray-800">{bookingRef.packages?.title || "Paket Tidak Diketahui"}</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Status Keuangan</p>
                            <p className="text-gray-800 flex items-center font-mono text-sm">
                                {bookingRef.status} <span className="opacity-50 mx-1">/</span> {bookingRef.payment_status}
                            </p>
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Dokumen Uploaded</p>
                            <div className="flex gap-2">
                                {bookingRef.ktp_url ? (
                                    <a href={bookingRef.ktp_url} target="_blank" className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded font-bold hover:bg-blue-100 transition flex items-center gap-1">KTP <ExternalLink className="w-3 h-3" /></a>
                                ) : <span className="text-[10px] text-gray-400 bg-gray-50 px-2 py-1 rounded">No KTP</span>}
                                {bookingRef.passport_url ? (
                                    <a href={bookingRef.passport_url} target="_blank" className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded font-bold hover:bg-blue-100 transition flex items-center gap-1">Paspor <ExternalLink className="w-3 h-3" /></a>
                                ) : <span className="text-[10px] text-gray-400 bg-gray-50 px-2 py-1 rounded">No Paspor</span>}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid gap-8">
                {sections.map(section => (
                    <div key={section.key} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-5 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                            <div>
                                <h3 className="font-bold text-gray-800 text-lg">{section.title}</h3>
                                <p className="text-xs text-gray-500">{section.subtitle}</p>
                            </div>
                            <Button size="sm" variant="outline" onClick={() => addStage(section.key)} className="rounded-xl flex gap-2">
                                <Plus className="w-3.5 h-3.5" /> Tambah Tahap
                            </Button>
                        </div>
                        <div className="p-5">
                            {(data[section.key] as any).stages.map((stage: Stage, idx: number) => (
                                <div key={idx} className="flex gap-4 items-start pb-5 mb-5 border-b border-gray-50 last:border-0 last:mb-0 last:pb-0">
                                    <div className="pt-2">
                                        <button
                                            onClick={() => updateStage(section.key, idx, 'done', !stage.done)}
                                            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${stage.done ? 'bg-green-500 border-green-500' : 'bg-white border-gray-200 hover:border-blue-400'}`}
                                        >
                                            {stage.done && <CheckCircle className="w-5 h-5 text-white" />}
                                        </button>
                                    </div>
                                    <div className="flex-1 grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-semibold text-gray-500 mb-1 block">Label / Judul</label>
                                            <input
                                                type="text"
                                                value={stage.label}
                                                onChange={(e) => updateStage(section.key, idx, 'label', e.target.value)}
                                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#d4a017]"
                                                placeholder="Contoh: DP Diterima"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-gray-500 mb-1 block">Tanggal (Opsional)</label>
                                            <input
                                                type="text"
                                                value={stage.date || ""}
                                                onChange={(e) => updateStage(section.key, idx, 'date', e.target.value)}
                                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#d4a017]"
                                                placeholder="Contoh: 12 Mar 2026"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="text-xs font-semibold text-gray-500 mb-1 block">Deskripsi</label>
                                            <input
                                                type="text"
                                                value={stage.desc}
                                                onChange={(e) => updateStage(section.key, idx, 'desc', e.target.value)}
                                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#d4a017]"
                                                placeholder="Detail tahapan..."
                                            />
                                        </div>
                                    </div>
                                    <div className="pt-8">
                                        <button onClick={() => removeStage(section.key, idx)} className="p-2 text-red-400 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

            </div>
        </div>
    );
}
