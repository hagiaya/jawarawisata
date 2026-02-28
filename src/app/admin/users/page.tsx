"use client";

import { useState, useEffect } from "react";
import { Search, Eye, Filter, Users as UsersIcon, Copy, Link as LinkIcon, Download, Trash2, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Database } from "@/types/database.types";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

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
                                <th className="px-6 py-4">Update Terakhir</th>
                                <th className="px-6 py-4">Website</th>
                                <th className="px-6 py-4 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400">Loading data...</td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400 flex flex-col items-center justify-center">
                                        <UsersIcon className="w-12 h-12 mb-3 text-gray-300" />
                                        <p>Belum ada data pendaftar.</p>
                                    </td>
                                </tr>
                            ) : users.map((user) => (
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
                                    <td className="px-6 py-4 text-gray-500">
                                        {user.updated_at ? new Date(user.updated_at).toLocaleDateString('id-ID') : '-'}
                                    </td>
                                    <td className="px-6 py-4">
                                        {user.website ? (
                                            <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 flex items-center gap-1">
                                                <LinkIcon className="w-3.5 h-3.5" /> Kunjungi
                                            </a>
                                        ) : (
                                            <span className="text-gray-400">-</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-200" title="Reset Sandi">
                                                <Key className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200" title="Hapus User">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {!loading && users.length > 0 && (
                    <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
                        <span>Menampilkan {users.length} pengguna terdaftar</span>
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
