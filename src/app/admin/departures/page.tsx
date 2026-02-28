"use client";

import { useState, useEffect } from "react";
import { Plane, Calendar, Users, MapPin, Printer, Plus, Pencil, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Departure {
    id: string;
    kloter_name: string;
    departure_date: string;
    airlines: string;
    package_id: string | null;
    mutawif_name: string;
    status: string;
    notes: string;
    packages?: { title: string };
    bookings?: { id: string }[];
}

export default function AdminDeparturesPage() {
    const [departures, setDepartures] = useState<Departure[]>([]);
    const [packagesList, setPackagesList] = useState<{ id: string, title: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [useSupabase, setUseSupabase] = useState(false);

    // modal states
    const [modalMode, setModalMode] = useState<"add" | "edit" | null>(null);
    const [saving, setSaving] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    const [form, setForm] = useState<Partial<Departure>>({
        kloter_name: "",
        departure_date: "",
        airlines: "",
        package_id: "",
        mutawif_name: "",
        status: "Persiapan",
        notes: "",
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const { publicSupabase } = await import("@/lib/supabase/public");

            // fetch packages for dropdown
            const { data: pkgs } = await publicSupabase.from("packages").select("id, title").eq("is_active", true);
            if (pkgs) setPackagesList(pkgs);

            // fetch departures
            const { data: deps, error } = await publicSupabase
                .from("departures")
                .select("*, packages(title)");

            if (!error && deps && deps.length > 0) {
                setDepartures(deps);
                setUseSupabase(true);
            } else {
                throw new Error("No data or error");
            }
        } catch (err) {
            // Local fallback
            const saved = localStorage.getItem("adminDepartures");
            if (saved) {
                try {
                    setDepartures(JSON.parse(saved));
                } catch { }
            } else {
                setDepartures([
                    {
                        id: "DEP-1",
                        kloter_name: "KLT-001 (Syawal)",
                        mutawif_name: "Ust. Ahmad Fauzi, Lc",
                        departure_date: "2026-05-15",
                        airlines: "Turkish Airlines (TK-9712)",
                        package_id: null,
                        packages: { title: "Umroh Berkah Plus Turki 9 Hari" },
                        status: "Persiapan",
                        notes: ""
                    }
                ]);
            }
        } finally {
            setLoading(false);
        }
    };

    const saveToStorage = (list: Departure[]) => {
        localStorage.setItem("adminDepartures", JSON.stringify(list));
    };

    const openAddModal = () => {
        setForm({
            kloter_name: "", departure_date: "", airlines: "", package_id: "", mutawif_name: "", status: "Persiapan", notes: ""
        });
        setModalMode("add");
    };

    const openEditModal = (dep: Departure) => {
        setForm({ ...dep });
        setModalMode("edit");
    };

    const closeModal = () => {
        setModalMode(null);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            if (useSupabase) {
                const { publicSupabase } = await import("@/lib/supabase/public");
                const payload = { ...form };
                delete payload.packages; // Remove joined data before insert
                delete payload.bookings;
                if (!payload.package_id) payload.package_id = null;

                if (modalMode === "add") {
                    await publicSupabase.from("departures").insert([payload]);
                } else if (modalMode === "edit" && form.id) {
                    await publicSupabase.from("departures").update(payload).eq("id", form.id);
                }
                await fetchData(); // refresh data
            } else {
                // Local logic
                if (modalMode === "add") {
                    const newDep = { ...form, id: `DEP-${Date.now()}` } as Departure;
                    const newList = [...departures, newDep];
                    setDepartures(newList);
                    saveToStorage(newList);
                } else {
                    const newList = departures.map(d => d.id === form.id ? { ...d, ...form } : d) as Departure[];
                    setDepartures(newList);
                    saveToStorage(newList);
                }
            }
            closeModal();
        } catch (err) {
            alert("Error menyimpan data");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        setSaving(true);
        try {
            if (useSupabase) {
                const { publicSupabase } = await import("@/lib/supabase/public");
                await publicSupabase.from("departures").delete().eq("id", id);
                await fetchData();
            } else {
                const newList = departures.filter(d => d.id !== id);
                setDepartures(newList);
                saveToStorage(newList);
            }
        } catch (err) {
            alert("Error menghapus");
        } finally {
            setSaving(false);
            setDeleteConfirm(null);
        }
    };

    return (
        <div className="p-8 min-h-screen">
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-1">Manajemen Keberangkatan</h1>
                    <p className="text-gray-500 text-sm">
                        Kelola grup/kloter keberangkatan, jadwal pesawat, dan laporan manifest
                        {!useSupabase && !loading && <span className="ml-2 text-amber-600 text-xs bg-amber-50 px-2 py-0.5 rounded-full">Mode Lokal</span>}
                    </p>
                </div>
                <Button onClick={openAddModal} className="bg-[#d4a017] hover:bg-[#b88a10] text-white rounded-xl flex gap-2">
                    <Plus className="w-4 h-4" /> Buat Kloter Baru
                </Button>
            </div>

            {loading ? (
                <div className="text-center text-gray-400 py-12">Loading kloter...</div>
            ) : departures.length === 0 ? (
                <div className="text-center text-gray-400 py-12 bg-white rounded-xl border border-dashed">Belum ada kloter yang dibuat.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {departures.map((dep) => (
                        <div key={dep.id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-2
                                        ${dep.status === 'Persiapan' ? 'bg-blue-100 text-blue-700' : dep.status === 'Selesai' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                        {dep.status}
                                    </span>
                                    <h3 className="font-bold text-xl text-gray-900">{dep.kloter_name}</h3>
                                    <p className="text-sm justify-center text-[#d4a017] font-semibold">{dep.packages?.title || "Paket Internal"}</p>
                                </div>
                                <div className="flex gap-1">
                                    <button onClick={() => openEditModal(dep)} className="p-1.5 text-gray-400 hover:text-blue-500 transition-colors">
                                        <Pencil className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => setDeleteConfirm(dep.id)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-6 pt-4 border-t border-gray-50 text-sm">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-gray-400" />
                                    <span className="font-semibold text-gray-700">{new Date(dep.departure_date).toLocaleDateString('id-ID')}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Plane className="w-4 h-4 text-gray-400" />
                                    <span className="font-semibold text-gray-700">{dep.airlines}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-gray-400" />
                                    <span className="font-semibold text-gray-700">Manajemen</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-gray-400" />
                                    <span className="font-semibold text-gray-700 truncate" title={dep.mutawif_name}>{dep.mutawif_name || "Belum Ditunjuk"}</span>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <Button variant="outline" className="flex-1 rounded-xl text-xs gap-1.5 h-9">
                                    <Users className="w-3.5 h-3.5" /> Lihat Jamaah
                                </Button>
                                <Button variant="outline" className="flex-1 rounded-xl text-xs gap-1.5 h-9 border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700">
                                    <Printer className="w-3.5 h-3.5" /> Manifest
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal Edit/Add */}
            {modalMode && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl relative">
                        <button onClick={closeModal} className="absolute top-4 right-4 p-2 text-gray-400 hover:bg-gray-100 rounded-xl transition">
                            <X className="w-5 h-5" />
                        </button>
                        <h2 className="text-xl font-bold mb-6">{modalMode === "add" ? "Buat Kloter Baru" : "Edit Kloter"}</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-600 mb-1">Nama Kloter</label>
                                <input value={form.kloter_name} onChange={e => setForm({ ...form, kloter_name: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Contoh: KLT-001 (Syawal)" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 mb-1">Tanggal Berangkat</label>
                                    <input type="date" value={form.departure_date} onChange={e => setForm({ ...form, departure_date: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 mb-1">Maskapai & Rute</label>
                                    <input value={form.airlines} onChange={e => setForm({ ...form, airlines: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Saudia (CGK-JED)" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-600 mb-1">Paket Referensi (Opsional)</label>
                                <select value={form.package_id || ""} onChange={e => setForm({ ...form, package_id: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm">
                                    <option value="">Pilih Paket Asal...</option>
                                    {packagesList.map(p => (
                                        <option key={p.id} value={p.id}>{p.title}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 mb-1">Nama Ustadz / Mutawif</label>
                                    <input value={form.mutawif_name || ""} onChange={e => setForm({ ...form, mutawif_name: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Ust. Ahmad" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 mb-1">Status Keberangkatan</label>
                                    <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm">
                                        <option value="Persiapan">Persiapan (Belum Berangkat)</option>
                                        <option value="Selesai">Selesai Berangkat</option>
                                        <option value="Dibatalkan">Dibatalkan</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex gap-3">
                            <Button variant="outline" onClick={closeModal} className="flex-1 rounded-xl">Batal</Button>
                            <Button onClick={handleSave} disabled={saving} className="flex-1 bg-[#d4a017] hover:bg-[#b88a10] text-white rounded-xl">
                                {saving ? "Menyimpan..." : "Simpan Kloter"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirm */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-sm text-center shadow-2xl">
                        <Trash2 className="w-12 h-12 text-red-500 mx-auto mb-4" />
                        <h2 className="text-lg font-bold mb-2">Hapus Kloter?</h2>
                        <p className="text-gray-500 text-sm mb-6">Data rombongan yang dihapus tidak bisa dikembalikan. Jamaah di dalamnya tidak akan terhapus namun kehilangan relasi grup keberangkatan.</p>
                        <div className="flex gap-3">
                            <Button variant="outline" onClick={() => setDeleteConfirm(null)} className="flex-1 rounded-xl">Batal</Button>
                            <Button onClick={() => handleDelete(deleteConfirm)} disabled={saving} className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-xl">
                                {saving ? "Menghapus..." : "Ya, Hapus"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
