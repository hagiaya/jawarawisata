"use client";

import { Globe, Image as ImageIcon, FileText, Megaphone, Edit3 } from "lucide-react";

export default function AdminContentPage() {
    return (
        <div className="p-8 min-h-screen">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-1">Konten Website (CMS)</h1>
                <p className="text-gray-500 text-sm">
                    Atur konten yang tampil di halaman publik seperti banner, testimoni, dan artikel.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Banners */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:border-[#d4a017] transition-colors cursor-pointer flex gap-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                        <ImageIcon className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 text-lg">Hero Banner</h3>
                        <p className="text-sm text-gray-500 mt-1">Ganti gambar dan teks banner utama di beranda.</p>
                        <ul className="text-xs text-gray-400 mt-3 list-disc pl-4 space-y-1">
                            <li>3 Banner aktif</li>
                            <li>Updated 2 hari lalu</li>
                        </ul>
                    </div>
                </div>

                {/* Articles */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:border-[#d4a017] transition-colors cursor-pointer flex gap-4">
                    <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center flex-shrink-0">
                        <FileText className="w-6 h-6 text-purple-500" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 text-lg">Artikel & Blog</h3>
                        <p className="text-sm text-gray-500 mt-1">Tulis dan atur artikel SEO untuk edukasi jamaah.</p>
                        <ul className="text-xs text-gray-400 mt-3 list-disc pl-4 space-y-1">
                            <li>12 Artikel terpublikasi</li>
                            <li>2 Draft</li>
                        </ul>
                    </div>
                </div>

                {/* Promos */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:border-[#d4a017] transition-colors cursor-pointer flex gap-4">
                    <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Megaphone className="w-6 h-6 text-amber-500" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 text-lg">Notifikasi & Promo</h3>
                        <p className="text-sm text-gray-500 mt-1">Atur banner promo atau pengumuman yang muncul membentang.</p>
                        <div className="mt-3 flex items-center gap-2">
                            <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Promo Aktif</span>
                            <span className="text-xs text-gray-500">Diskon Ramadhan</span>
                        </div>
                    </div>
                </div>

                {/* Static Text Config */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:border-[#d4a017] transition-colors cursor-pointer flex gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Edit3 className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 text-lg">Profil Travel</h3>
                        <p className="text-sm text-gray-500 mt-1">Data alamat, nomor kontak, link sosial media perusahaan.</p>
                    </div>
                </div>

            </div>
        </div>
    );
}
