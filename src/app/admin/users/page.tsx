"use client";

import { useState, useEffect } from "react";
import { Search, Eye, Filter, Users as UsersIcon, Copy, Link as LinkIcon, Download, Trash2, ShieldCheck, UserCheck, CheckCircle2, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Database } from "@/types/database.types";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"] & { is_verified?: boolean };

export default function AdminUsersPage() {
    const [users, setUsers] = useState<ProfileRow[]>([]);
    const [useSupabase, setUseSupabase] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const { publicSupabase } = await import("@/lib/supabase/public");
                const { data, error } = await publicSupabase
                    .from("profiles")
                    .select("*")
                    .order("updated_at", { ascending: false });

                if (!error && data) {
                    setUsers(data as ProfileRow[]);
                    setUseSupabase(true);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const copyId = (id: string) => {
        navigator.clipboard.writeText(id);
    };

    const handleDeleteUser = async (user: ProfileRow) => {
        const confirmDelete = window.confirm(
            `Hapus PROFIL pengguna "${user.full_name || user.id}"?\n\n` +
            `Catatan: Ini hanya menghapus data profil di tabel database. ` +
            `Akun login (Supabase Auth) tetap ada.\n\n` +
            `Agar pengguna ini hilang permanen dan tidak muncul lagi saat di-refresh, ` +
            `Anda HARUS menghapus akunnya melalui Supabase Dashboard -> Authentication.`
        );

        if (!confirmDelete) return;

        try {
            const { publicSupabase } = await import("@/lib/supabase/public");

            // Mencoba menghapus
            const { error } = await publicSupabase
                .from("profiles")
                .delete()
                .eq("id", user.id);

            if (error) {
                // Seringkali gagal karena foreign key (ada booking)
                if (error.code === '23503') {
                    alert("Gagal: Pengguna ini masih memiliki data Pemesanan (Bookings). Hapus semua pesanan mereka terlebih dahulu.");
                    return;
                }
                throw error;
            }

            setUsers(prev => prev.filter(u => u.id !== user.id));
        } catch (err: any) {
            console.error("Error deleting user:", err);
            alert("Terjadi kesalahan: " + (err.message || "Cek koneksi atau izin database."));
        }
    };

    const handleVerifyUser = async (user: ProfileRow) => {
        const isCurrentlyVerified = (user as any).is_verified;
        const action = isCurrentlyVerified ? 'Cabut Verifikasi' : 'Verifikasi Jamaah';
        if (!window.confirm(`${action} untuk "${user.full_name || user.id}"?`)) return;

        try {
            const { publicSupabase } = await import("@/lib/supabase/public");
            const newStatus = !isCurrentlyVerified;

            const { error } = await publicSupabase
                .from("profiles")
                .update({ is_verified: newStatus } as any)
                .eq("id", user.id);

            if (error) throw error;

            setUsers(prev => prev.map(u => u.id === user.id ? { ...u, is_verified: newStatus } : u));
            alert(`Berhasil: Jamaah ${newStatus ? 'TERVERIFIKASI' : 'TIDAK TERVERIFIKASI'}`);
        } catch (err: any) {
            console.error("Error updating verification status:", err);
            alert("Gagal merubah status verifikasi: " + (err.message || "Terjadi kesalahan. Pastikan Anda sudah menjalankan script SQL 'migrasi_verifikasi.sql' di Supabase."));
        }
    };

    const [searchTerm, setSearchTerm] = useState("");
    const filteredUsers = users.filter(user =>
        (user.full_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.username?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.id.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="p-8 min-h-screen">
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-1">Manajemen Pengguna</h1>
                    <p className="text-gray-500 text-sm">
                        Kelola data jamaah dan akun yang terdaftar
                        {!useSupabase && !loading && <span className="ml-2 text-amber-600 text-xs bg-amber-50 px-2 py-0.5 rounded-full">Mode Lokal (Kosong)</span>}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari email / nama..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#d4a017] focus:border-transparent w-full md:w-64"
                        />
                    </div>
                    <Button variant="outline" className="rounded-xl flex items-center gap-2">
                        <Filter className="w-4 h-4" /> Filter
                    </Button>
                    <Button className="bg-[#d4a017] hover:bg-[#b88a10] text-white rounded-xl flex items-center gap-2">
                        <Download className="w-4 h-4" /> Export CSV
                    </Button>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4">ID User / Avatar</th>
                                <th className="px-6 py-4">Nama Lengkap</th>
                                <th className="px-6 py-4">Username / Email</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400">Loading data...</td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400 flex flex-col items-center justify-center">
                                        <UsersIcon className="w-12 h-12 mb-3 text-gray-300" />
                                        <p>Tidak ada pengguna yang sesuai pencarian.</p>
                                    </td>
                                </tr>
                            ) : filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200 shrink-0">
                                            {user.avatar_url ? (
                                                <img src={user.avatar_url} alt={user.full_name || ""} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="font-bold text-gray-400">{(user.full_name?.[0] || user.username?.[0] || "?").toUpperCase()}</span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs text-mono text-gray-400 group cursor-pointer hover:text-[#d4a017]" onClick={() => copyId(user.id)} title="Copy ID">
                                            {(user.id || "").substring(0, 8).toUpperCase()}...
                                            <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        {user.full_name || <span className="text-gray-400 italic">Belum diisi</span>}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-gray-600">{user.username || <span className="text-gray-400 italic">Belum diisi</span>}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 w-fit ${(user as any).is_verified ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                            {(user as any).is_verified ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                                            {(user as any).is_verified ? 'Terverifikasi' : 'Pending'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>
                                            {user.role?.toUpperCase() || 'USER'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => handleVerifyUser(user)}
                                                className={`p-2 rounded-lg transition-colors border border-transparent ${(user as any).is_verified ? 'text-green-600 hover:bg-green-50 hover:border-green-200' : 'text-blue-600 hover:bg-blue-50 hover:border-blue-200'}`}
                                                title={(user as any).is_verified ? "Cabut Verifikasi" : "Verifikasi Jamaah"}
                                            >
                                                {(user as any).is_verified ? <UserCheck className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                                            </button>
                                            <button
                                                onClick={() => handleDeleteUser(user)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200"
                                                title="Hapus User"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {!loading && filteredUsers.length > 0 && (
                    <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
                        <span>Menampilkan {filteredUsers.length} pengguna terdaftar</span>
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
