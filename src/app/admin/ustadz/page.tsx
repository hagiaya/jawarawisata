"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, Save, X, GripVertical, Star, Upload, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const DEFAULT_USTADZ = [
    {
        id: "1",
        name: "Ustadz Adi Hidayat, Lc., M.A.",
        role: "Ulama & Dai Nasional",
        photo_url: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgQPhIiS8RTh1zGO3qo9S9XsaQ8TANKkRvWoLfwlJS_XQUgW80885R56r97MUgGGPMxq9sQx1bVqPQshLkhBKdl5C3y3YeDEePtqPGUhTydTFRx07eZrE9SyTxKlBbdmstFPv9D4kk-RKY/s584/images+%25281%2529.jpg",
        sort_order: 1,
        is_active: true,
    },
    {
        id: "2",
        name: "Ustadz Abdul Somad, Lc., M.A.",
        role: "Ulama & Dai Nasional",
        photo_url: "https://d54-invdn-com.investing.com/content/pic95ba09ceedeef79d6e42480271821e81.jpg",
        sort_order: 2,
        is_active: true,
    },
    {
        id: "3",
        name: "Ustadz Khalid Basalamah, M.A.",
        role: "Dai & Ulama Islam",
        photo_url: "https://magelangekspres.disway.id/upload/73b306fd3a095052d32f420e4674067e.jpeg",
        sort_order: 3,
        is_active: true,
    },
    {
        id: "4",
        name: "Ustadz Felix Siauw",
        role: "Dai & Penulis",
        photo_url: "https://satriadharma.com/wp-content/uploads/2022/01/ustad-felix-siauw-instagram.jpg",
        sort_order: 4,
        is_active: true,
    },
];

type Ustadz = {
    id: string;
    name: string;
    role: string;
    photo_url: string;
    sort_order: number;
    is_active: boolean;
};

type ModalMode = "add" | "edit" | null;

export default function AdminUstadzPage() {
    const [ustadzList, setUstadzList] = useState<Ustadz[]>(DEFAULT_USTADZ);
    const [modalMode, setModalMode] = useState<ModalMode>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [useSupabase, setUseSupabase] = useState(false);
    const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

    const [form, setForm] = useState({
        name: "",
        role: "",
        photo_url: "",
        is_active: true,
    });

    const showNotification = (type: "success" | "error", message: string) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 3000);
    };

    // Try to load from Supabase
    useEffect(() => {
        const loadFromSupabase = async () => {
            try {
                const { publicSupabase } = await import("@/lib/supabase/public");
                const { data, error } = await publicSupabase
                    .from("ustadz")
                    .select("*")
                    .order("sort_order", { ascending: true });

                if (!error && data && data.length > 0) {
                    setUstadzList(data);
                    setUseSupabase(true);
                }
            } catch {
                // use localStorage or default
                const saved = localStorage.getItem("adminUstadzList");
                if (saved) {
                    try {
                        setUstadzList(JSON.parse(saved));
                    } catch { }
                }
            }
        };
        loadFromSupabase();
    }, []);

    const saveToStorage = (list: Ustadz[]) => {
        localStorage.setItem("adminUstadzList", JSON.stringify(list));
    };

    const openAddModal = () => {
        setForm({ name: "", role: "", photo_url: "", is_active: true });
        setEditingId(null);
        setModalMode("add");
    };

    const openEditModal = (ustadz: Ustadz) => {
        setForm({
            name: ustadz.name,
            role: ustadz.role,
            photo_url: ustadz.photo_url,
            is_active: ustadz.is_active,
        });
        setEditingId(ustadz.id);
        setModalMode("edit");
    };

    const closeModal = () => {
        setModalMode(null);
        setEditingId(null);
    };

    const handleSave = async () => {
        if (!form.name.trim() || !form.photo_url.trim()) {
            showNotification("error", "Nama dan URL foto wajib diisi!");
            return;
        }

        setSaving(true);
        try {
            if (useSupabase) {
                const { publicSupabase } = await import("@/lib/supabase/public");
                if (modalMode === "add") {
                    const sortOrder = ustadzList.length + 1;
                    const { data, error } = await publicSupabase
                        .from("ustadz")
                        .insert([{ ...form, sort_order: sortOrder }])
                        .select()
                        .single();
                    if (error) throw error;
                    const newList = [...ustadzList, data];
                    setUstadzList(newList);
                } else if (modalMode === "edit" && editingId) {
                    const { data, error } = await publicSupabase
                        .from("ustadz")
                        .update(form)
                        .eq("id", editingId)
                        .select()
                        .single();
                    if (error) throw error;
                    const newList = ustadzList.map((u) => (u.id === editingId ? data : u));
                    setUstadzList(newList);
                }
                showNotification("success", modalMode === "add" ? "Ustadz berhasil ditambahkan!" : "Ustadz berhasil diupdate!");
            } else {
                // localStorage mode
                if (modalMode === "add") {
                    const newUstadz: Ustadz = {
                        id: Date.now().toString(),
                        ...form,
                        sort_order: ustadzList.length + 1,
                    };
                    const newList = [...ustadzList, newUstadz];
                    setUstadzList(newList);
                    saveToStorage(newList);
                } else if (modalMode === "edit" && editingId) {
                    const newList = ustadzList.map((u) =>
                        u.id === editingId ? { ...u, ...form } : u
                    );
                    setUstadzList(newList);
                    saveToStorage(newList);
                }
                showNotification("success", modalMode === "add" ? "Ustadz berhasil ditambahkan!" : "Ustadz berhasil diupdate!");
            }
            closeModal();
        } catch (err: any) {
            showNotification("error", err.message || "Terjadi kesalahan.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        setSaving(true);
        try {
            if (useSupabase) {
                const { publicSupabase } = await import("@/lib/supabase/public");
                const { error } = await publicSupabase.from("ustadz").delete().eq("id", id);
                if (error) throw error;
            }
            const newList = ustadzList
                .filter((u) => u.id !== id)
                .map((u, i) => ({ ...u, sort_order: i + 1 }));
            setUstadzList(newList);
            saveToStorage(newList);
            showNotification("success", "Ustadz berhasil dihapus.");
        } catch (err: any) {
            showNotification("error", err.message || "Gagal menghapus.");
        } finally {
            setSaving(false);
            setDeleteConfirm(null);
        }
    };

    const toggleActive = async (ustadz: Ustadz) => {
        const updated = { ...ustadz, is_active: !ustadz.is_active };
        try {
            if (useSupabase) {
                const { publicSupabase } = await import("@/lib/supabase/public");
                await publicSupabase.from("ustadz").update({ is_active: updated.is_active }).eq("id", ustadz.id);
            }
            const newList = ustadzList.map((u) => (u.id === ustadz.id ? updated : u));
            setUstadzList(newList);
            saveToStorage(newList);
        } catch { }
    };

    return (
        <div className="p-8 min-h-screen">
            {/* Notification */}
            {notification && (
                <div
                    className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-xl shadow-lg text-white text-sm font-medium transition-all ${notification.type === "success" ? "bg-green-500" : "bg-red-500"
                        }`}
                >
                    {notification.message}
                </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-1">Ustadz Pembimbing</h1>
                    <p className="text-gray-500 text-sm">
                        Kelola foto dan nama ustadz yang tampil di halaman utama
                        {!useSupabase && (
                            <span className="ml-2 text-amber-600 text-xs bg-amber-50 px-2 py-0.5 rounded-full">
                                Mode Lokal (Supabase belum terhubung)
                            </span>
                        )}
                    </p>
                </div>
                <Button
                    onClick={openAddModal}
                    className="bg-[#d4a017] hover:bg-[#b88a10] text-white rounded-xl px-5 py-2.5 flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Tambah Ustadz
                </Button>
            </div>

            {/* Grid Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {ustadzList.map((ustadz) => (
                    <div
                        key={ustadz.id}
                        className={`bg-white rounded-2xl border overflow-hidden shadow-sm hover:shadow-md transition-shadow ${!ustadz.is_active ? "opacity-60" : ""
                            }`}
                    >
                        {/* Photo */}
                        <div className="relative aspect-square bg-gray-100">
                            {ustadz.photo_url ? (
                                <img
                                    src={ustadz.photo_url}
                                    alt={ustadz.name}
                                    className="w-full h-full object-cover object-top"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=400";
                                    }}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                    <Star className="w-12 h-12 text-gray-400" />
                                </div>
                            )}
                            {/* Status badge */}
                            <div
                                className={`absolute top-3 right-3 px-2 py-0.5 rounded-full text-xs font-bold ${ustadz.is_active ? "bg-green-500 text-white" : "bg-gray-400 text-white"
                                    }`}
                            >
                                {ustadz.is_active ? "Aktif" : "Nonaktif"}
                            </div>
                        </div>

                        {/* Info */}
                        <div className="p-4">
                            <h3 className="font-bold text-gray-900 text-sm leading-tight mb-0.5">{ustadz.name}</h3>
                            <p className="text-gray-500 text-xs mb-4">{ustadz.role}</p>

                            {/* Actions */}
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => openEditModal(ustadz)}
                                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-gray-200 hover:border-[#d4a017] hover:text-[#d4a017] text-gray-600 text-xs font-medium transition-colors"
                                >
                                    <Pencil className="w-3.5 h-3.5" />
                                    Edit
                                </button>
                                <button
                                    onClick={() => toggleActive(ustadz)}
                                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border text-xs font-medium transition-colors ${ustadz.is_active
                                            ? "border-amber-200 text-amber-600 hover:bg-amber-50"
                                            : "border-green-200 text-green-600 hover:bg-green-50"
                                        }`}
                                >
                                    {ustadz.is_active ? "Nonaktif" : "Aktifkan"}
                                </button>
                                <button
                                    onClick={() => setDeleteConfirm(ustadz.id)}
                                    className="p-2 rounded-lg border border-gray-200 hover:border-red-300 hover:text-red-500 text-gray-400 transition-colors"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal Add/Edit */}
            {modalMode && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900">
                                {modalMode === "add" ? "Tambah Ustadz" : "Edit Ustadz"}
                            </h2>
                            <button
                                onClick={closeModal}
                                className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-5">
                            {/* Preview Photo */}
                            <div className="flex justify-center">
                                <div className="relative w-32 h-32 rounded-2xl overflow-hidden bg-gray-100 border-2 border-dashed border-gray-200">
                                    {form.photo_url ? (
                                        <img
                                            src={form.photo_url}
                                            alt="Preview"
                                            className="w-full h-full object-cover object-top"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).style.display = "none";
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                                            <Star className="w-8 h-8 mb-1" />
                                            <span className="text-xs">Preview</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Name */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Nama Lengkap <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    placeholder="contoh: Ustadz Adi Hidayat, Lc., M.A."
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d4a017] focus:border-transparent text-sm"
                                />
                            </div>

                            {/* Role */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Jabatan / Peran
                                </label>
                                <input
                                    type="text"
                                    value={form.role}
                                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                                    placeholder="contoh: Ulama & Dai Nasional"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d4a017] focus:border-transparent text-sm"
                                />
                            </div>

                            {/* Photo URL */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    URL Foto <span className="text-red-500">*</span>
                                </label>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="url"
                                            value={form.photo_url}
                                            onChange={(e) => setForm({ ...form, photo_url: e.target.value })}
                                            placeholder="https://example.com/foto-ustadz.jpg"
                                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d4a017] focus:border-transparent text-sm"
                                        />
                                    </div>
                                </div>
                                <p className="text-xs text-gray-400 mt-1.5">
                                    Masukkan URL langsung dari internet (link foto)
                                </p>
                            </div>

                            {/* Active Toggle */}
                            <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-xl">
                                <div>
                                    <p className="text-sm font-semibold text-gray-700">Status Tampil</p>
                                    <p className="text-xs text-gray-400">Apakah ustadz ini ditampilkan di halaman utama?</p>
                                </div>
                                <button
                                    onClick={() => setForm({ ...form, is_active: !form.is_active })}
                                    className={`relative w-12 h-6 rounded-full transition-colors ${form.is_active ? "bg-[#d4a017]" : "bg-gray-300"
                                        }`}
                                >
                                    <span
                                        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.is_active ? "translate-x-6" : "translate-x-0"
                                            }`}
                                    />
                                </button>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 border-t border-gray-100 flex gap-3">
                            <Button
                                onClick={closeModal}
                                variant="outline"
                                className="flex-1 rounded-xl border-gray-200 text-gray-600 hover:bg-gray-50"
                            >
                                Batal
                            </Button>
                            <Button
                                onClick={handleSave}
                                disabled={saving}
                                className="flex-1 bg-[#d4a017] hover:bg-[#b88a10] text-white rounded-xl flex items-center justify-center gap-2"
                            >
                                {saving ? (
                                    <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                                ) : (
                                    <Save className="w-4 h-4" />
                                )}
                                {saving ? "Menyimpan..." : "Simpan"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
                        <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Trash2 className="w-7 h-7 text-red-500" />
                        </div>
                        <h3 className="text-lg font-bold text-center text-gray-900 mb-2">Hapus Ustadz?</h3>
                        <p className="text-sm text-gray-500 text-center mb-6">
                            Ustadz ini akan dihapus dari halaman utama. Tindakan ini tidak dapat dibatalkan.
                        </p>
                        <div className="flex gap-3">
                            <Button
                                onClick={() => setDeleteConfirm(null)}
                                variant="outline"
                                className="flex-1 rounded-xl"
                            >
                                Batal
                            </Button>
                            <Button
                                onClick={() => handleDelete(deleteConfirm)}
                                disabled={saving}
                                className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-xl"
                            >
                                {saving ? "Menghapus..." : "Ya, Hapus"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
