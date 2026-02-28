"use client";

import { useState, useEffect } from "react";
import { Coins, TrendingUp, CreditCard, Download, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminFinancePage() {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const { publicSupabase } = await import("@/lib/supabase/public");
                const { data, error } = await publicSupabase
                    .from("bookings")
                    .select("*, packages(*), profiles(*)")
                    .order("created_at", { ascending: false });

                if (!error && data) {
                    setBookings(data);
                } else {
                    // Fallback to mock logic if supabase not ready
                    setBookings([
                        {
                            id: "3a7b9e4a",
                            created_at: new Date().toISOString(),
                            profiles: { full_name: "Siti Aminah" },
                            packages: { title: "Umroh Plus Turki", price: 32500000 },
                            tracking_data: { payment: { total: 32500000, paid: 32500000 } }
                        },
                        {
                            id: "8f9d2c1b",
                            created_at: new Date().toISOString(),
                            profiles: { full_name: "Ahmad Zain" },
                            packages: { title: "Umroh Syawal", price: 28000000 },
                            payment_status: "dp_paid"
                        },
                        {
                            id: "1b8f4d9c",
                            created_at: new Date().toISOString(),
                            profiles: { full_name: "Hasanuddin" },
                            packages: { title: "Umroh Reguler", price: 25000000 },
                            payment_status: "unpaid"
                        }
                    ]);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    let totalPendapatan = 0;
    let piutangJamaah = 0;
    let transaksiSelesai = 0;

    const mappedTransactions = bookings.map((b) => {
        const pkgPrice = b.packages?.promo_price || b.packages?.price || 0;

        let total = pkgPrice;
        let paid = 0;

        if (b.tracking_data?.payment) {
            total = b.tracking_data.payment.total || total;
            paid = b.tracking_data.payment.paid || 0;
        } else {
            if (b.payment_status === "paid") paid = total;
            else if (b.payment_status === "dp_paid") paid = 5000000;
        }

        let statusText = "Belum Bayar";
        if (paid >= total && total > 0) statusText = "Lunas";
        else if (paid > 0) statusText = "DP/Cicilan";

        totalPendapatan += paid;
        piutangJamaah += Math.max(0, total - paid);
        if (paid >= total && total > 0) transaksiSelesai++;

        return {
            id: `INV-${(b.id || "").substring(0, 8).toUpperCase()}`,
            jamaah: b.profiles?.full_name || b.profiles?.username || "Unknown",
            paket: b.packages?.title || "Paket",
            date: new Date(b.created_at).toLocaleDateString("id-ID"),
            total,
            paid,
            status: statusText,
        };
    });

    const filteredTransactions = mappedTransactions.filter(t =>
        t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.jamaah.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.paket.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatIDR = (n: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

    const stats = [
        { label: "Total Pendapatan", value: formatIDR(totalPendapatan), icon: TrendingUp, color: "text-green-600", bg: "bg-green-100" },
        { label: "Piutang Jamaah", value: formatIDR(piutangJamaah), icon: CreditCard, color: "text-amber-600", bg: "bg-amber-100" },
        { label: "Transaksi Lunas", value: transaksiSelesai.toString(), icon: Coins, color: "text-blue-600", bg: "bg-blue-100" },
    ];

    return (
        <div className="p-8 min-h-screen">
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-1">Laporan Keuangan</h1>
                    <p className="text-gray-500 text-sm">
                        Ringkasan pendapatan, tagihan, dan histori transaksi jamaah
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="rounded-xl flex items-center gap-2">
                        <Download className="w-4 h-4" /> Export Excel
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${stat.bg}`}>
                            <stat.icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-semibold">{stat.label}</p>
                            <p className="text-2xl font-black text-gray-900 mt-1">{loading ? "..." : stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                    <h3 className="font-bold text-gray-800">Riwayat Pembayaran Terbaru</h3>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari Invoice/Jamaah..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#d4a017] w-64"
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-white text-gray-500 font-medium border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4">Invoice</th>
                                <th className="px-6 py-4">Jamaah</th>
                                <th className="px-6 py-4 text-right">Total Tagihan</th>
                                <th className="px-6 py-4 text-right">Sudah Dibayar</th>
                                <th className="px-6 py-4 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400">Loading data...</td>
                                </tr>
                            ) : filteredTransactions.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400">Tidak ada transaksi ditemukan</td>
                                </tr>
                            ) : filteredTransactions.map((trx, i) => (
                                <tr key={i} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-mono text-xs font-bold text-gray-600">{trx.id}</td>
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-gray-900">{trx.jamaah}</p>
                                        <p className="text-xs text-gray-500">{trx.paket}</p>
                                    </td>
                                    <td className="px-6 py-4 text-right font-semibold text-gray-800">{formatIDR(trx.total)}</td>
                                    <td className="px-6 py-4 text-right font-semibold text-green-600">{formatIDR(trx.paid)}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-flex py-1 px-3 rounded-full text-[10px] font-bold uppercase tracking-wide
                                            ${trx.status === 'Lunas' ? 'bg-green-100 text-green-700' :
                                                trx.status.includes('DP') ? 'bg-blue-100 text-blue-700' :
                                                    'bg-red-100 text-red-700'}`}>
                                            {trx.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
