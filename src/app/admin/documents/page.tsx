"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, FileText, CheckCircle, Clock, Download, Eye, FileCheck, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminDocumentsPage() {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [useSupabase, setUseSupabase] = useState(false);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const { publicSupabase } = await import("@/lib/supabase/public");
                const { data, error } = await publicSupabase
                    .from("bookings")
                    .select("*, packages(title), profiles(full_name, username)")
                    .order("created_at", { ascending: false });

                if (!error && data && data.length > 0) {
                    setBookings(data);
                    setUseSupabase(true);
                } else {
                    throw new Error("No data");
                }
            } catch (err) {
                // Mock data fallback
                setBookings([
                    {
                        id: "INV-8f9d2c1",
                        profiles: { full_name: "Ahmad Zain" },
                        packages: { title: "Umroh Syawal 9 Hari" },
                        tracking_data: {
                            document: { stages: [{ id: 'ktp', done: true }, { id: 'passport', done: true }, { id: 'complete', done: false }] },
                            visa: { stages: [{ id: 'submit', done: true }, { id: 'process', done: true }, { id: 'approved', done: false }] }
                        }
                    },
                    {
                        id: "INV-3a7b9e4",
                        profiles: { full_name: "Siti Aminah" },
                        packages: { title: "Umroh Plus Turki" },
                        tracking_data: {
                            document: { stages: [{ id: 'ktp', done: true }, { id: 'passport', done: true }, { id: 'complete', done: true }] },
                            visa: { stages: [{ id: 'submit', done: true }, { id: 'process', done: true }, { id: 'approved', done: true }] }
                        }
                    },
                    {
                        id: "INV-6c2d1f8",
                        profiles: { full_name: "Budi Santoso" },
                        packages: { title: "Umroh VIP Ramadhan" },
                        tracking_data: {
                            document: { stages: [{ id: 'ktp', done: false }, { id: 'passport', done: false }, { id: 'complete', done: false }] },
                            visa: { stages: [{ id: 'submit', done: false }, { id: 'process', done: false }, { id: 'approved', done: false }] }
                        }
                    }
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    const getStageDone = (booking: any, section: string, stageId: string) => {
        try {
            const stages = booking.tracking_data[section].stages;
            const stage = stages.find((s: any) => s.id === stageId);
            return stage?.done || false;
        } catch {
            return false;
        }
    };

    return (
        <div className="p-8 min-h-screen">
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-1">Dokumen & Visa</h1>
                    <p className="text-gray-500 text-sm">
                        Kelola kelengkapan dokumen dan proses pengajuan visa jamaah
                        {!useSupabase && !loading && <span className="ml-2 text-amber-600 text-xs bg-amber-50 px-2 py-0.5 rounded-full">Mode Lokal</span>}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="rounded-xl flex items-center gap-2">
                        <Download className="w-4 h-4" /> Download Manifest
                    </Button>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4">Jamaah</th>
                                <th className="px-6 py-4 text-center">KTP</th>
                                <th className="px-6 py-4 text-center">Paspor</th>
                                <th className="px-6 py-4 text-center">Status Visa</th>
                                <th className="px-6 py-4 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400">Loading data...</td>
                                </tr>
                            ) : bookings.map((booking: any) => {
                                const hasKTP = getStageDone(booking, 'document', 'ktp');
                                const hasPaspor = getStageDone(booking, 'document', 'passport');
                                const visaApproved = getStageDone(booking, 'visa', 'approved');
                                const visaProcess = getStageDone(booking, 'visa', 'process');

                                return (
                                    <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-gray-900">{booking.profiles?.full_name || "Unknown"}</p>
                                            <p className="text-xs text-gray-500">{booking.packages?.title || "Paket"}</p>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {booking.ktp_url ? (
                                                <div className="flex flex-col items-center gap-1.5">
                                                    <a href={booking.ktp_url} target="_blank" className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-bold hover:bg-blue-100 transition">Lihat KTP <ExternalLink className="w-2.5 h-2.5 inline" /></a>
                                                    {hasKTP ? (
                                                        <span className="inline-flex py-0.5 px-2 rounded text-[10px] font-bold text-green-700"><CheckCircle className="w-3 h-3 mr-1" /> Verified</span>
                                                    ) : (
                                                        <span className="inline-flex py-0.5 px-2 rounded bg-amber-100 text-[10px] font-bold text-amber-700">Perlu Verif</span>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="inline-flex py-1 px-2.5 rounded-full bg-gray-100 text-gray-500 text-[10px] font-bold">Belum Upload</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {booking.passport_url ? (
                                                <div className="flex flex-col items-center gap-1.5">
                                                    <a href={booking.passport_url} target="_blank" className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-bold hover:bg-blue-100 transition">Lihat Paspor <ExternalLink className="w-2.5 h-2.5 inline" /></a>
                                                    {hasPaspor ? (
                                                        <span className="inline-flex py-0.5 px-2 rounded text-[10px] font-bold text-green-700"><CheckCircle className="w-3 h-3 mr-1" /> Verified</span>
                                                    ) : (
                                                        <span className="inline-flex py-0.5 px-2 rounded bg-amber-100 text-[10px] font-bold text-amber-700">Perlu Verif</span>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="inline-flex py-1 px-2.5 rounded-full bg-gray-100 text-gray-500 text-[10px] font-bold">Belum Upload</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {visaApproved ? (
                                                <span className="inline-flex py-1 px-2.5 rounded-full bg-green-100 text-green-700 text-xs font-bold w-24 justify-center">Approved</span>
                                            ) : visaProcess ? (
                                                <span className="inline-flex py-1 px-2.5 rounded-full bg-amber-100 text-amber-700 text-xs font-bold w-24 justify-center">Di Proses</span>
                                            ) : (
                                                <span className="inline-flex py-1 px-2.5 rounded-full bg-gray-100 text-gray-500 text-xs font-bold w-24 justify-center">Pending</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <Link href={`/admin/bookings/${booking.id}`} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-200 font-medium text-xs flex items-center gap-1">
                                                    <FileCheck className="w-3.5 h-3.5" /> Berkas
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
