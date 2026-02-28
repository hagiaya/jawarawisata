import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Search, Package, Home } from "lucide-react";

interface BookingSuccessPageProps {
    searchParams: Promise<{ invoice?: string }>;
}

export default async function BookingSuccessPage({ searchParams }: BookingSuccessPageProps) {
    const params = await searchParams;
    const invoiceId = params.invoice || "INV-20260222-DEMO";

    return (
        <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-green-50/30 flex flex-col items-center justify-center px-4 py-16">
            <div className="max-w-md w-full text-center">
                {/* Success animation */}
                <div className="relative mx-auto mb-8 w-28 h-28">
                    <div className="absolute inset-0 rounded-full bg-green-100 animate-ping opacity-50" />
                    <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-2xl">
                        <CheckCircle2 className="w-14 h-14 text-white" />
                    </div>
                </div>

                <h1 className="text-3xl font-bold text-gray-800 mb-3">Pemesanan Berhasil! 🎉</h1>
                <p className="text-gray-500 text-base mb-2">
                    Alhamdulillah, pemesanan Anda telah diterima. Tim Jawara Wisata akan segera menghubungi Anda via WhatsApp untuk konfirmasi.
                </p>

                {/* Invoice */}
                <div className="my-7 bg-white border border-gray-200 rounded-2xl p-5 shadow-sm text-left">
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest mb-1">Nomor Invoice Anda</p>
                    <p className="font-mono text-xl font-black text-[#d4a017] tracking-wider">{invoiceId}</p>
                    <p className="text-xs text-gray-500 mt-2">
                        Simpan nomor ini untuk melacak status pembayaran, dokumen, visa, dan keberangkatan Anda.
                    </p>
                </div>

                {/* Next steps */}
                <div className="text-left mb-8 space-y-3">
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Langkah Selanjutnya</p>
                    {[
                        { emoji: "📱", step: "Tunggu konfirmasi via WhatsApp dari tim kami" },
                        { emoji: "💳", step: "Lakukan pembayaran sesuai metode yang dipilih" },
                        { emoji: "📄", step: "Kirim dokumen lengkap (KTP, Paspor) jika belum" },
                        { emoji: "🔍", step: "Pantau status pemesanan di halaman Tracking" },
                    ].map((item, i) => (
                        <div key={i} className="flex items-start gap-3 bg-gray-50 rounded-xl p-3">
                            <span className="text-lg">{item.emoji}</span>
                            <p className="text-sm text-gray-600 leading-relaxed">{item.step}</p>
                        </div>
                    ))}
                </div>

                {/* CTAs */}
                <div className="flex flex-col gap-3">
                    <Link href={`/tracking/${invoiceId}`} className="w-full">
                        <Button className="w-full h-12 bg-[#d4a017] hover:bg-[#b88a10] text-white font-bold rounded-xl text-base flex items-center justify-center gap-2">
                            <Search className="w-4 h-4" /> Lacak Status Pemesanan
                        </Button>
                    </Link>
                    <div className="grid grid-cols-2 gap-3">
                        <Link href="/packages">
                            <Button variant="outline" className="w-full h-11 rounded-xl border-gray-200 text-sm font-semibold flex items-center justify-center gap-1.5">
                                <Package className="w-4 h-4" /> Paket Lain
                            </Button>
                        </Link>
                        <Link href="/">
                            <Button variant="outline" className="w-full h-11 rounded-xl border-gray-200 text-sm font-semibold flex items-center justify-center gap-1.5">
                                <Home className="w-4 h-4" /> Beranda
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
