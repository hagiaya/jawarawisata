"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Save, X, Package, Users, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Database } from "@/types/database.types";
import { MOCK_PACKAGES } from "@/app/page";

type PackageRow = Database["public"]["Tables"]["packages"]["Row"];
type ModalMode = "add" | "edit" | null;

export default function AdminPackagesPage() {
    const [packages, setPackages] = useState<PackageRow[]>([]);
    const [modalMode, setModalMode] = useState<ModalMode>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [useSupabase, setUseSupabase] = useState(false);
    const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

    const [form, setForm] = useState<Partial<PackageRow>>({
        title: "",
        description: "",
        price: 0,
        start_date: "",
        end_date: "",
        image_url: "",
        capacity: 0,
        available_seats: 0,
        package_type: "",
        hotel_makkah: "",
        hotel_madinah: "",
        airlines: "",
        promo_price: 0,
        itinerary_pdf_url: "",
        is_active: true,
    });

    const showNotification = (type: "success" | "error", message: string) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 3000);
    };

    useEffect(() => {
        const loadFromSupabase = async () => {
            try {
                const { publicSupabase } = await import("@/lib/supabase/public");
                const { data, error } = await publicSupabase
                    .from("packages")
                    .select("*")
                    .order("start_date", { ascending: true });

                if (!error && data && data.length > 0) {
                    setPackages(data as PackageRow[]);
                    setUseSupabase(true);
                } else {
                    throw new Error("No data");
                }
            } catch {
                const saved = localStorage.getItem("adminPackages");
                if (saved) {
                    try {
                        setPackages(JSON.parse(saved));
                    } catch { }
                } else {
                    // map MOCK_PACKAGES to conform to PackageRow
                    const mockRows = MOCK_PACKAGES.map(p => ({
                        ...p,
                        promo_price: p.promo_price || null,
                        itinerary_pdf_url: p.itinerary_pdf_url || null,
                        created_at: p.created_at || new Date().toISOString()
                    })) as PackageRow[];
                    setPackages(mockRows);
                }
            }
        };
        loadFromSupabase();
    }, []);

    const saveToStorage = (list: PackageRow[]) => {
        localStorage.setItem("adminPackages", JSON.stringify(list));
    };

    const openAddModal = () => {
        setForm({
            title: "", description: "", price: 0, start_date: "", end_date: "",
            image_url: "", capacity: 0, available_seats: 0, package_type: "",
            hotel_makkah: "", hotel_madinah: "", airlines: "", promo_price: 0,
            itinerary_pdf_url: "", is_active: true
        });
        setEditingId(null);
        setModalMode("add");
    };

    const openEditModal = (pkg: PackageRow) => {
        setForm(pkg);
        setEditingId(pkg.id);
        setModalMode("edit");
    };

    const closeModal = () => {
        setModalMode(null);
        setEditingId(null);
    };

    const handleSave = async () => {
        if (!form.title || !form.start_date || !form.end_date) {
            showNotification("error", "Judul dan tanggal wajib diisi!");
            return;
        }

        setSaving(true);
        try {
            if (useSupabase) {
                const { publicSupabase } = await import("@/lib/supabase/public");
                if (modalMode === "add") {
                    const { data, error } = await publicSupabase.from("packages").insert([form]).select().single();
                    if (error) throw error;
                    setPackages([...packages, data as PackageRow]);
                } else if (modalMode === "edit" && editingId) {
                    const { data, error } = await publicSupabase.from("packages").update(form).eq("id", editingId).select().single();
                    if (error) throw error;
                    setPackages(packages.map((p) => (p.id === editingId ? data as PackageRow : p)));
                }
                showNotification("success", "Paket berhasil disimpan!");
            } else {
                if (modalMode === "add") {
                    const newPkg = { ...form, id: Date.now().toString(), created_at: new Date().toISOString() } as PackageRow;
                    const newList = [...packages, newPkg];
                    setPackages(newList);
                    saveToStorage(newList);
                } else if (modalMode === "edit" && editingId) {
                    const newList = packages.map((p) => (p.id === editingId ? { ...p, ...form } : p)) as PackageRow[];
                    setPackages(newList);
                    saveToStorage(newList);
                }
                showNotification("success", "Paket berhasil disimpan (Lokal)!");
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
                const { error } = await publicSupabase.from("packages").delete().eq("id", id);
                if (error) throw error;
            }
            const newList = packages.filter((p) => p.id !== id);
            setPackages(newList);
            saveToStorage(newList);
            showNotification("success", "Paket berhasil dihapus.");
        } catch (err: any) {
            showNotification("error", err.message || "Gagal menghapus.");
        } finally {
            setSaving(false);
            setDeleteConfirm(null);
        }
    };

    const toggleActive = async (pkg: PackageRow) => {
        const updated = { ...pkg, is_active: !pkg.is_active };
        try {
            if (useSupabase) {
                const { publicSupabase } = await import("@/lib/supabase/public");
                await publicSupabase.from("packages").update({ is_active: updated.is_active }).eq("id", pkg.id);
            }
            const newList = packages.map((p) => (p.id === pkg.id ? updated : p));
            setPackages(newList);
            saveToStorage(newList);
        } catch { }
    };

    return (
        <div className="p-8 min-h-screen">
            {notification && (
                <div className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-xl shadow-lg text-white text-sm font-medium transition-all ${notification.type === "success" ? "bg-green-500" : "bg-red-500"}`}>
                    {notification.message}
                </div>
            )}

            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-1">Paket Umroh</h1>
                    <p className="text-gray-500 text-sm">
                        Kelola paket perjalanan jamaah
                        {!useSupabase && <span className="ml-2 text-amber-600 text-xs bg-amber-50 px-2 py-0.5 rounded-full">Mode Lokal</span>}
                    </p>
                </div>
                <Button onClick={openAddModal} className="bg-[#d4a017] hover:bg-[#b88a10] text-white rounded-xl px-5 py-2.5 flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Tambah Paket
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {packages.map((pkg) => (
                    <div key={pkg.id} className={`bg-white rounded-2xl border overflow-hidden shadow-sm hover:shadow-md transition-shadow ${!pkg.is_active ? "opacity-60" : ""}`}>
                        <div className="relative aspect-video bg-gray-100">
                            {pkg.image_url ? (
                                <img src={pkg.image_url} alt={pkg.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                    <Package className="w-12 h-12 text-gray-400" />
                                </div>
                            )}
                            <div className={`absolute top-3 right-3 px-2 py-0.5 rounded-full text-xs font-bold ${pkg.is_active ? "bg-green-500 text-white" : "bg-gray-400 text-white"}`}>
                                {pkg.is_active ? "Aktif" : "Nonaktif"}
                            </div>
                        </div>

                        <div className="p-4">
                            <h3 className="font-bold text-gray-900 text-lg leading-tight mb-2 line-clamp-1">{pkg.title}</h3>
                            <div className="flex flex-col gap-1 text-sm text-gray-500 mb-4">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" /> {pkg.start_date} sd {pkg.end_date}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4" /> Sisa {pkg.available_seats} / {pkg.capacity} Seat
                                </div>
                            </div>
                            <p className="font-black text-[#d4a017] mb-4">
                                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(pkg.price)}
                            </p>

                            <div className="flex items-center gap-2">
                                <button onClick={() => openEditModal(pkg)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-gray-200 hover:border-[#d4a017] hover:text-[#d4a017] text-gray-600 text-xs font-medium transition-colors">
                                    <Pencil className="w-3.5 h-3.5" /> Edit
                                </button>
                                <button onClick={() => toggleActive(pkg)} className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border text-xs font-medium transition-colors ${pkg.is_active ? "border-amber-200 text-amber-600 hover:bg-amber-50" : "border-green-200 text-green-600 hover:bg-green-50"}`}>
                                    {pkg.is_active ? "Nonaktif" : "Aktifkan"}
                                </button>
                                <button onClick={() => setDeleteConfirm(pkg.id)} className="p-2 rounded-lg border border-gray-200 hover:border-red-300 hover:text-red-500 text-gray-400 transition-colors">
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {modalMode && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100 flex-shrink-0">
                            <h2 className="text-xl font-bold text-gray-900">{modalMode === "add" ? "Tambah Paket" : "Edit Paket"}</h2>
                            <button onClick={closeModal} className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Judul Paket</label>
                                    <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 border rounded-xl" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Harga (IDR)</label>
                                    <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} className="w-full px-3 py-2 border rounded-xl" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Harga Promo (Opsional)</label>
                                    <input type="number" value={form.promo_price || ""} onChange={(e) => setForm({ ...form, promo_price: Number(e.target.value) })} className="w-full px-3 py-2 border rounded-xl" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Tanggal Mulai</label>
                                    <input type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} className="w-full px-3 py-2 border rounded-xl" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Tanggal Selesai</label>
                                    <input type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} className="w-full px-3 py-2 border rounded-xl" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Kapasitas (Seat)</label>
                                    <input type="number" value={form.capacity || 0} onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })} className="w-full px-3 py-2 border rounded-xl" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Sisa Seat</label>
                                    <input type="number" value={form.available_seats || 0} onChange={(e) => setForm({ ...form, available_seats: Number(e.target.value) })} className="w-full px-3 py-2 border rounded-xl" />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">URL Cover Image</label>
                                    <input type="url" value={form.image_url || ""} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="w-full px-3 py-2 border rounded-xl" />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Deskripsi Singkat</label>
                                    <textarea value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 border rounded-xl h-24"></textarea>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-100 flex gap-3 flex-shrink-0">
                            <Button onClick={closeModal} variant="outline" className="flex-1 rounded-xl">Batal</Button>
                            <Button onClick={handleSave} disabled={saving} className="flex-1 bg-[#d4a017] hover:bg-[#b88a10] text-white rounded-xl">
                                {saving ? "Menyimpan..." : "Simpan Paket"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {deleteConfirm && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center">
                        <Trash2 className="w-12 h-12 text-red-500 mx-auto mb-4" />
                        <h3 className="text-lg font-bold mb-2">Hapus Paket?</h3>
                        <p className="text-sm text-gray-500 mb-6">Paket yang dihapus tidak dapat dikembalikan lagi. Anda yakin?</p>
                        <div className="flex gap-3">
                            <Button onClick={() => setDeleteConfirm(null)} variant="outline" className="flex-1 rounded-xl">Batal</Button>
                            <Button onClick={() => handleDelete(deleteConfirm)} className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-xl">
                                {saving ? "Menghapus..." : "Ya, Hapus"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
