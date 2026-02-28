"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Eye, Filter, Download, BookOpen, CheckCircle, Clock, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Database } from "@/types/database.types";

type BookingRow = Database["public"]["Tables"]["bookings"]["Row"];

export default function AdminBookingsPage() {
    const [bookings, setBookings] = useState<BookingRow[]>([]);
    const [useSupabase, setUseSupabase] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const { publicSupabase } = await import("@/lib/supabase/public");
                const { data, error } = await publicSupabase
                    .from("bookings")
                    .select("*, packages(title), profiles(full_name, username)")
                    .order("created_at", { ascending: false });

                if (!error && data && data.length > 0) {
                    setBookings(data as any);
                    setUseSupabase(true);
                } else {
                    throw new Error("No data or error");
                }
            } catch (err) {
                // If Supabase fails, use rich local mock data
                setBookings([
                    {
                        id: "INV-8f9d2c1",
                        user_id: "u1",
                        package_id: "p1",
                        status: "pending",
                        payment_method: "DP",
                        payment_status: "dp_paid",
                        notes: "Mohon kamar mandi dekat lift",
                        created_at: new Date(Date.now() - 3600000).toISOString(),
                        updated_at: new Date(Date.now() - 3600000).toISOString(),
                        profiles: { full_name: "Ahmad Zain", username: "ahmadz" },
                        packages: { title: "Umroh Syawal 9 Hari" }
                    },
                    {
                        id: "INV-3a7b9e4",
                        user_id: "u2",
                        package_id: "p2",
                        status: "confirmed",
                        payment_method: "Cicilan",
                        payment_status: "dp_paid",
                        notes: null,
                        created_at: new Date(Date.now() - 86400000).toISOString(),
                        updated_at: new Date(Date.now() - 86400000).toISOString(),
                        profiles: { full_name: "Siti Aminah", username: "sitia" },
                        packages: { title: "Umroh Plus Turki" }
                    },
                    {
                        id: "INV-6c2d1f8",
                        user_id: "u3",
                        package_id: "p3",
                        status: "confirmed",
                        payment_method: "Tunai",
                        payment_status: "paid",
                        notes: null,
                        created_at: new Date(Date.now() - 172800000).toISOString(),
                        updated_at: new Date(Date.now() - 172800000).toISOString(),
                        profiles: { full_name: "Budi Santoso", username: "budisant" },
                        packages: { title: "Umroh VIP Ramadhan" }
                    },
                    {
                        id: "INV-9e4a2c5",
                        user_id: "u4",
                        package_id: "p4",
                        status: "cancelled",
                        payment_method: null,
                        payment_status: "unpaid",
                        notes: "Batal karena sakit",
                        created_at: new Date(Date.now() - 259200000).toISOString(),
                        updated_at: new Date(Date.now() - 259200000).toISOString(),
                        profiles: { full_name: "Dewi Lestari", username: "dewil" },
                        packages: { title: "Haji Khusus 2026" }
                    },
                    {
                        id: "INV-1b8f4d9",
                        user_id: "u5",
                        package_id: "p5",
                        status: "pending",
                        payment_method: "Tunai",
                        payment_status: "unpaid",
                        notes: null,
                        created_at: new Date(Date.now() - 4000000).toISOString(),
                        updated_at: new Date(Date.now() - 4000000).toISOString(),
                        profiles: { full_name: "Hasanuddin", username: "hasanuddin" },
                        packages: { title: "Umroh Reguler Plus City Tour" }
                    }
                ] as any);
                setUseSupabase(false);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    const updateStatus = async (id: string, status: string) => {
        try {
            if (useSupabase) {
                const { publicSupabase } = await import("@/lib/supabase/public");
                await publicSupabase.from("bookings").update({ status: status as any }).eq("id", id);
            }
            setBookings(bookings.map(b => b.id === id ? { ...b, status: status as any } : b));
        } catch (err) {
            console.error(err);
        }
    };

    const getStatusIcon = (status: string) => {
        if (status === 'confirmed') return <CheckCircle className="w-4 h-4 text-green-500" />;
        if (status === 'cancelled') return <XCircle className="w-4 h-4 text-red-500" />;
        return <Clock className="w-4 h-4 text-amber-500" />;
    };

    const getStatusBadge = (status: string) => {
        if (status === 'confirmed') return "bg-green-100 text-green-700";
        if (status === 'cancelled') return "bg-red-100 text-red-700";
        return "bg-amber-100 text-amber-700";
    };

    return (
        <div className="p-8 min-h-screen">
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-1">Manajemen Pemesanan</h1>
                    <p className="text-gray-500 text-sm">
                        Kelola transaksi dan status pemesanan jamaah
                        {!useSupabase && !loading && <span className="ml-2 text-amber-600 text-xs bg-amber-50 px-2 py-0.5 rounded-full">Mode Lokal (Kosong)</span>}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari ID/Nama jamaah..."
                            className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#d4a017] focus:border-transparent w-full md:w-64"
                        />
                    </div>
                    <Button variant="outline" className="rounded-xl flex items-center gap-2">
                        <Filter className="w-4 h-4" /> Filter
                    </Button>
                    <Button className="bg-[#d4a017] hover:bg-[#b88a10] text-white rounded-xl flex items-center gap-2">
                        <Download className="w-4 h-4" /> Export
                    </Button>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4">ID Transaksi</th>
                                <th className="px-6 py-4">Jamaah</th>
                                <th className="px-6 py-4">Paket</th>
                                <th className="px-6 py-4">Tgl Pesan</th>
                                <th className="px-6 py-4">Status & Pembayaran</th>
                                <th className="px-6 py-4 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400">Loading data...</td>
                                </tr>
                            ) : bookings.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400 flex flex-col items-center justify-center">
                                        <BookOpen className="w-12 h-12 mb-3 text-gray-300" />
                                        <p>Belum ada data pemesanan.</p>
                                    </td>
                                </tr>
                            ) : bookings.map((booking: any) => (
                                <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 font-mono text-xs text-gray-500">
                                        {(booking.id || "").substring(0, 8).toUpperCase()}...
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        {booking.profiles?.full_name || booking.profiles?.username || "Unknown"}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-medium">{booking.packages?.title || "Unknown Package"}</span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">
                                        {new Date(booking.created_at).toLocaleDateString('id-ID')}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1.5 items-start">
                                            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusBadge(booking.status)}`}>
                                                {getStatusIcon(booking.status)}
                                                {booking.status.toUpperCase()}
                                            </div>
                                            <span className="text-xs text-gray-400 font-medium capitalize border border-gray-200 px-2 py-0.5 rounded-md">
                                                {booking.payment_method || "N/A"} - {booking.payment_status}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-2">
                                            {booking.status === 'pending' && (
                                                <button onClick={() => updateStatus(booking.id, 'confirmed')} className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors border border-transparent hover:border-green-200" title="Setuju">
                                                    <CheckCircle className="w-4 h-4" />
                                                </button>
                                            )}
                                            {booking.status === 'pending' && (
                                                <button onClick={() => updateStatus(booking.id, 'cancelled')} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200" title="Tolak">
                                                    <XCircle className="w-4 h-4" />
                                                </button>
                                            )}
                                            <Link href={`/admin/bookings/${booking.id.startsWith('INV-') ? booking.id : `INV-${booking.id}`}`} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-200 font-medium text-xs flex items-center gap-1">
                                                <Eye className="w-3.5 h-3.5" /> Detail & Kelola
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {!loading && bookings.length > 0 && (
                    <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
                        <span>Menampilkan {bookings.length} transaksi</span>
                        <div className="flex gap-1">
                            <button className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50" disabled>Seb</button>
                            <button className="px-3 py-1 bg-[#d4a017] text-white rounded">1</button>
                            <button className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50" disabled>Sel</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
