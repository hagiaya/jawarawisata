"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Package, FileText, CreditCard, Plane } from "lucide-react";
import Link from "next/link";

export default function TrackingPage() {
    const [invoiceId, setInvoiceId] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const val = invoiceId.trim().toUpperCase();
        if (!val) {
            setError("Masukkan nomor invoice terlebih dahulu");
            return;
        }
        setError("");
        router.push(`/tracking/${val}`);
    };

    const DEMO_INVOICES = [
        "INV-20260222-DEMO",
        "INV-20260222-A1B2",
        "INV-20260222-C3D4",
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-amber-50/30">
            {/* ── Hero ── */}
            <div className="relative overflow-hidden bg-gradient-to-br from-[#1a0a00] via-[#3d1500] to-[#d4a017] py-20 px-4">
                {/* Islamic pattern overlay */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="tp" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                                <g fill="none" stroke="#d4a017" strokeWidth="0.6">
                                    <polygon points="30,2 56,16 56,44 30,58 4,44 4,16" />
                                    <polygon points="30,10 49,20 49,40 30,50 11,40 11,20" />
                                    <line x1="30" y1="2" x2="30" y2="58" />
                                    <line x1="4" y1="16" x2="56" y2="44" />
                                    <line x1="56" y1="16" x2="4" y2="44" />
                                </g>
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#tp)" />
                    </svg>
                </div>

                <div className="container mx-auto max-w-2xl relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white/80 text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
                        <Package className="w-3.5 h-3.5" />
                        Tracking Perjalanan Ibadah
                    </div>
                    <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-4">
                        Lacak Status Pemesanan
                    </h1>
                    <p className="text-white/70 text-lg mb-10">
                        Masukkan nomor invoice Anda untuk memantau status pembayaran, dokumen, visa, dan keberangkatan secara real-time.
                    </p>

                    {/* Search Box */}
                    <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={invoiceId}
                                onChange={(e) => setInvoiceId(e.target.value.toUpperCase())}
                                placeholder="Contoh: INV-20260222-DEMO"
                                className="w-full pl-12 pr-4 py-4 rounded-2xl text-gray-800 text-base font-mono bg-white/95 backdrop-blur border-0 outline-none focus:ring-2 focus:ring-[#d4a017] shadow-lg placeholder:text-gray-400 placeholder:font-sans"
                            />
                        </div>
                        <button
                            type="submit"
                            className="px-8 py-4 rounded-2xl font-bold text-base text-white shadow-xl transition-all hover:scale-[1.03] hover:shadow-2xl"
                            style={{ background: "linear-gradient(135deg, #d4a017, #b88a10)" }}
                        >
                            Lacak Sekarang
                        </button>
                    </form>

                    {error && (
                        <p className="mt-3 text-red-300 text-sm">{error}</p>
                    )}

                    {/* Demo invoices */}
                    <div className="mt-6 flex flex-wrap justify-center gap-2">
                        <span className="text-white/50 text-xs mt-1">Coba demo:</span>
                        {DEMO_INVOICES.map((inv) => (
                            <button
                                key={inv}
                                onClick={() => setInvoiceId(inv)}
                                className="text-xs font-mono bg-white/10 hover:bg-white/20 text-white/80 px-3 py-1.5 rounded-lg border border-white/20 transition-colors"
                            >
                                {inv}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Feature Cards ── */}
            <div className="container mx-auto max-w-4xl px-4 py-16">
                <p className="text-center text-gray-500 text-sm mb-10 font-medium uppercase tracking-widest">Yang bisa Anda pantau</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                    {[
                        { icon: CreditCard, label: "Status Pembayaran", desc: "DP, cicilan, dan pelunasan", color: "from-blue-500 to-blue-600" },
                        { icon: FileText, label: "Status Dokumen", desc: "KTP, paspor, & kelengkapan", color: "from-violet-500 to-violet-600" },
                        { icon: "🛂", label: "Status Visa", desc: "Pengajuan & approval visa", color: "from-amber-500 to-amber-600" },
                        { icon: Plane, label: "Status Keberangkatan", desc: "Jadwal & informasi penerbangan", color: "from-green-500 to-green-600" },
                    ].map((item, i) => (
                        <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mx-auto mb-3`}>
                                {typeof item.icon === "string" ? (
                                    <span className="text-2xl">{item.icon}</span>
                                ) : (
                                    <item.icon className="w-6 h-6 text-white" />
                                )}
                            </div>
                            <h3 className="font-bold text-sm text-gray-800 mb-1">{item.label}</h3>
                            <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Info */}
                <div className="mt-12 bg-amber-50 border border-amber-200 rounded-2xl p-6 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#d4a017] flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-lg">💡</span>
                    </div>
                    <div>
                        <p className="font-bold text-gray-800 mb-1">Di mana nomor invoice saya?</p>
                        <p className="text-sm text-gray-600">
                            Nomor invoice dikirimkan melalui <strong>WhatsApp</strong> dan <strong>email</strong> setelah Anda menyelesaikan checkout pemesanan paket.
                            Format: <span className="font-mono text-[#d4a017] bg-amber-100 px-2 py-0.5 rounded">INV-YYYYMMDD-XXXX</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
