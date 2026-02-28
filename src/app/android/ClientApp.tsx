"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
    Home,
    Map,
    Search,
    User,
    ChevronLeft,
    Bell,
    Wallet,
    Plane,
    Clock,
    Shield,
    Star,
    ArrowRight,
    HeadphonesIcon,
    FileText,
    Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Package {
    id: string;
    title: string;
    price: number;
    promo_price?: number;
    image_url?: string;
    package_type: string;
    duration?: string;
    available_seats?: number;
    flash_sale?: boolean;
}

export default function ClientApp({ packagesData }: { packagesData: Package[] }) {
    const [activeTab, setActiveTab] = useState("home");

    const flashSale = packagesData.filter(p => p.flash_sale || p.promo_price).slice(0, 3);
    // Tampilkan 6 paket pertama sebagai rekomendasi. Jika ada flash sale, bisa tetap muncul atau difilter, tapi pastikan list tidak kosong.
    const regularPackages = packagesData.filter(p => !p.flash_sale && !p.promo_price).length >= 6
        ? packagesData.filter(p => !p.flash_sale && !p.promo_price).slice(0, 6)
        : packagesData.slice(0, 6);

    const renderHome = () => (
        <div className="pb-24 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Sticky Header Wrapper */}
            <div className="sticky top-0 z-[100] drop-shadow-lg -mx-4 -px-4 w-[calc(100%+2rem)] mx-[-1rem]">
                {/* Header Profile */}
                <div className="bg-[#1a0a00] rounded-b-[2.5rem] pt-12 pb-8 px-6 relative overflow-hidden">
                    <div className="absolute inset-0 pointer-events-none opacity-20 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] mix-blend-overlay"></div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4a017] rounded-full blur-[80px] opacity-20 -translate-y-1/2 translate-x-1/3"></div>

                    <div className="relative z-10 flex justify-between items-center mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full border-2 border-[#d4a017] p-0.5 relative">
                                <div className="w-full h-full bg-white/10 rounded-full flex items-center justify-center overflow-hidden">
                                    <User className="text-white/80 w-6 h-6" />
                                </div>
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#1a0a00] rounded-full"></div>
                            </div>
                            <div>
                                <p className="text-white/60 text-xs font-medium">Ahlan wa Sahlan,</p>
                                <h2 className="text-white font-bold text-lg leading-tight">Tamu Allah</h2>
                            </div>
                        </div>
                        <button className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center relative backdrop-blur-sm border border-white/10">
                            <Bell className="text-white w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-[#1a0a00]"></span>
                        </button>
                    </div>

                    {/* Info Berita Singkat */}
                    <div className="bg-gradient-to-r from-emerald-900 to-[#1a0a00] rounded-2xl p-4 shadow border border-emerald-800 relative overflow-hidden group">
                        <div className="absolute right-0 top-0 w-32 h-32 bg-white/5 rounded-bl-full pointer-events-none"></div>
                        <div className="flex gap-4 items-center relative z-10">
                            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                                <Bell className="w-6 h-6 text-[#d4a017]" />
                            </div>
                            <div>
                                <span className="text-[10px] font-bold text-[#d4a017] uppercase tracking-wider bg-[#d4a017]/10 px-2 py-0.5 rounded-sm inline-block mb-1">Update Terkini</span>
                                <h4 className="text-white text-sm font-bold leading-tight">Jadwal Manasik Akbar 2026</h4>
                                <p className="text-white/60 text-xs mt-1">Sabtu, 15 Maret di Asrama Haji</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Menu */}
                <div className="px-6 -mt-6 relative z-20">
                    <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-4 grid grid-cols-5 gap-2">
                        {[
                            { id: 'home', icon: <Home className="w-5 h-5" />, label: "Beranda", color: "bg-[#d4a017]/10 text-[#d4a017]" },
                            { id: 'packages', icon: <Map className="w-5 h-5" />, label: "Paket", color: "bg-emerald-100 text-emerald-600" },
                            { id: 'articles', icon: <FileText className="w-5 h-5" />, label: "Artikel", color: "bg-amber-100 text-amber-600" },
                            { id: 'tracking', icon: <Search className="w-5 h-5" />, label: "Lacak", color: "bg-blue-100 text-blue-600" },
                            { id: 'profile', icon: <User className="w-5 h-5" />, label: "Profil", color: "bg-purple-100 text-purple-600" },
                        ].map((item, i) => (
                            <div key={i} className="flex flex-col items-center gap-1.5 cursor-pointer flex-1 group" onClick={() => setActiveTab(item.id)}>
                                <div className={`w-11 h-11 rounded-2xl ${item.color} flex items-center justify-center group-hover:-translate-y-1 transition-transform shadow-sm`}>
                                    {item.icon}
                                </div>
                                <span className="text-[9px] font-bold text-gray-700 text-center">{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Flash Sale Section */}
            {flashSale.length > 0 && (
                <div className="mt-8 px-6">
                    <div className="flex justify-between items-end mb-4">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm animate-pulse">FLASH SALE</span>
                                <span className="text-xs text-gray-500 font-medium">Berakhir dalam 12:45:00</span>
                            </div>
                            <h3 className="font-bold text-gray-800 text-xl">Promo Terbatas! ⚡</h3>
                        </div>
                    </div>
                    <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 snap-x hide-scrollbar">
                        {flashSale.map(pkg => (
                            <div key={pkg.id} className="snap-center shrink-0 w-[260px] bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden cursor-pointer active:scale-95 transition-transform" onClick={() => setActiveTab('packages')}>
                                <div className="h-[140px] relative bg-gray-200">
                                    {pkg.image_url ? (
                                        <Image src={pkg.image_url} alt={pkg.title} fill className="object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-tr from-gray-300 to-gray-200"></div>
                                    )}
                                    <div className="absolute top-2 left-2 bg-[#d4a017] text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-md">
                                        HEMAT {(pkg.promo_price && pkg.price) ? Math.round(((pkg.price - pkg.promo_price) / pkg.price) * 100) : 0}%
                                    </div>
                                </div>
                                <div className="p-3">
                                    <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider mb-1 px-1.5 py-0.5 bg-gray-100 rounded-md w-fit">{pkg.package_type}</p>
                                    <h4 className="font-bold text-gray-800 text-sm leading-tight line-clamp-2 mb-2">{pkg.title}</h4>
                                    <div className="flex flex-col">
                                        <span className="text-gray-400 text-[10px] line-through">Rp {pkg.price.toLocaleString('id-ID')}</span>
                                        <span className="text-[#d4a017] font-black text-lg">Rp {(pkg.promo_price || pkg.price).toLocaleString('id-ID')}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Featured Packages */}
            <div className="mt-6 px-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-800 text-lg">Rekomendasi Paket</h3>
                    <button className="text-[#d4a017] text-xs font-bold" onClick={() => setActiveTab('packages')}>Lihat Semua</button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    {regularPackages.map(pkg => (
                        <div key={pkg.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col active:scale-95 transition-transform cursor-pointer" onClick={() => setActiveTab('packages')}>
                            <div className="h-32 relative bg-gray-200 shrink-0">
                                {pkg.image_url && <Image src={pkg.image_url} alt={pkg.title} fill className="object-cover" />}
                                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 flex items-center gap-1 rounded-md text-[9px] font-bold shadow-sm">
                                    <Star className="w-2.5 h-2.5 text-yellow-500 fill-yellow-500" /> 4.9
                                </div>
                                {(pkg.flash_sale || pkg.promo_price) && (
                                    <div className="absolute top-2 left-2 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow-sm animate-pulse">
                                        PROMO
                                    </div>
                                )}
                            </div>
                            <div className="p-3 flex flex-col flex-1 justify-between">
                                <div>
                                    <p className="text-[9px] text-gray-400 font-medium uppercase tracking-wider mb-1">{pkg.package_type}</p>
                                    <h4 className="font-bold text-gray-800 text-xs leading-tight mb-2 line-clamp-2">{pkg.title}</h4>
                                </div>
                                <div className="mt-2">
                                    <p className="text-[9px] text-gray-400 font-medium mb-0.5">Mulai dari</p>
                                    <p className="text-[#d4a017] font-black text-sm leading-none">Rp {(pkg.promo_price || pkg.price).toLocaleString('id-ID')}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Berita & Artikel Terbaru */}
            <div className="mt-8 px-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-800 text-lg">Artikel & Berita</h3>
                    <button className="text-[#d4a017] text-xs font-bold" onClick={() => setActiveTab('articles')}>Lihat Semua</button>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 snap-x hide-scrollbar">
                    {[
                        { title: "Manasik Akbar 2026 Bersama Habib Novel", date: "12 Mar 2026", category: "Berita", img: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=80&w=600" },
                        { title: "Keutamaan Umroh di Bulan Ramadhan", date: "05 Mar 2026", category: "Edukasi", img: "https://images.unsplash.com/photo-1565552684305-7e43f3665045?q=80&w=600" },
                        { title: "Persiapan Fisik Sebelum Berangkat Haji", date: "28 Feb 2026", category: "Tips", img: "https://images.unsplash.com/photo-1519817650390-64a93db51149?q=80&w=600" }
                    ].map((news, i) => (
                        <div key={i} className="snap-center shrink-0 w-[240px] bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer active:scale-95 transition-transform" onClick={() => setActiveTab('articles')}>
                            <div className="h-[120px] relative bg-gray-200">
                                <Image src={news.img} alt={news.title} fill className="object-cover" />
                                <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md text-white px-2 py-0.5 rounded-md text-[9px] font-bold">
                                    {news.category}
                                </div>
                            </div>
                            <div className="p-3">
                                <div className="flex items-center gap-1 text-gray-400 mb-1.5">
                                    <Calendar className="w-3 h-3" />
                                    <span className="text-[9px]">{news.date}</span>
                                </div>
                                <h4 className="font-bold text-gray-800 text-sm leading-tight line-clamp-2">{news.title}</h4>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Testimonials */}
            <div className="mt-8 px-6">
                <h3 className="font-bold text-gray-800 text-lg mb-4">Kisah Jamaah</h3>
                <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 snap-x hide-scrollbar">
                    {[
                        { name: "Annisa Khusni", package: "Umroh Plus Turki", text: "Alhamdulillah pelayanan Jawara Wisata sangat memuaskan dari awal hingga kembali ke tanah air." },
                        { name: "Budi Santoso", package: "Umroh Reguler", text: "Ustadz pembimbing sangat sabar dan menguasai sunnah. Hotel juga dekat sekali ke masjid." }
                    ].map((t, i) => (
                        <div key={i} className="snap-center shrink-0 w-[240px] bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                            <div className="flex items-center gap-1 mb-2">
                                {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-3 h-3 text-yellow-500 fill-yellow-500" />)}
                            </div>
                            <p className="text-xs text-gray-600 italic mb-4 line-clamp-3">"{t.text}"</p>
                            <div className="flex gap-2 items-center">
                                <div className="w-8 h-8 rounded-full bg-[#1a0a00] text-white flex items-center justify-center font-bold text-xs">
                                    {t.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-800">{t.name}</p>
                                    <p className="text-[10px] text-[#d4a017]">{t.package}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("Semua");

    // Derived state for packages
    const filteredPackages = packagesData.filter(pkg => {
        const matchesSearch = pkg.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "Semua" || pkg.package_type.includes(selectedCategory) || (selectedCategory === "Umroh Reguler" && pkg.package_type === "Reguler") || (selectedCategory === "Umroh Plus" && pkg.package_type.startsWith("Plus"));
        return matchesSearch && matchesCategory;
    });

    const renderPackages = () => (
        <div className="pb-24 pt-16 px-5 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="fixed top-0 left-0 right-0 max-w-md mx-auto bg-white/90 backdrop-blur-md z-30 pt-12 pb-3 px-5 header-safe border-b border-gray-100 space-y-3">
                <h2 className="font-bold text-xl text-gray-800 text-center">Eksplor Paket</h2>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Cari paket umroh/haji..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-gray-100 rounded-xl py-2.5 pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-[#d4a017]/50 transition-all"
                    />
                </div>
            </div>
            <div className="space-y-4 mt-16">
                <div className="bg-gray-100 rounded-xl p-2 flex gap-2 overflow-x-auto hide-scrollbar">
                    {['Semua', 'Umroh Reguler', 'Umroh Plus', 'Haji', 'Tur Halal'].map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`shrink-0 px-4 py-1.5 rounded-lg text-[11px] font-bold transition-colors ${selectedCategory === cat ? 'bg-[#d4a017] text-white shadow-sm' : 'bg-transparent text-gray-500 hover:bg-gray-200'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
                <div className="grid grid-cols-2 gap-3">
                    {filteredPackages.map(pkg => (
                        <div key={pkg.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col active:scale-95 transition-transform cursor-pointer">
                            <div className="h-32 relative bg-gray-200 shrink-0">
                                {pkg.image_url && <Image src={pkg.image_url} alt={pkg.title} fill className="object-cover" />}
                                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 flex items-center gap-1 rounded-md text-[9px] font-bold shadow-sm">
                                    <Star className="w-2.5 h-2.5 text-yellow-500 fill-yellow-500" /> 4.9
                                </div>
                                {(pkg.flash_sale || pkg.promo_price) && (
                                    <div className="absolute top-2 left-2 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow-sm animate-pulse">
                                        PROMO
                                    </div>
                                )}
                            </div>
                            <div className="p-3 flex flex-col flex-1 justify-between">
                                <div>
                                    <p className="text-[9px] text-gray-400 font-medium uppercase tracking-wider mb-1">{pkg.package_type}</p>
                                    <h4 className="font-bold text-gray-800 text-xs leading-tight mb-2 line-clamp-2">{pkg.title}</h4>
                                </div>
                                <div className="mt-2">
                                    <p className="text-[9px] text-gray-400 font-medium mb-0.5">Mulai dari</p>
                                    <p className="text-[#d4a017] font-black text-sm leading-none">Rp {(pkg.promo_price || pkg.price).toLocaleString('id-ID')}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                    {filteredPackages.length === 0 && (
                        <div className="col-span-2 text-center py-10">
                            <p className="text-gray-500 text-sm">Tidak ada paket yang sesuai pencarian.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    const renderTracking = () => (
        <div className="pb-24 pt-16 px-5 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="fixed top-0 left-0 right-0 max-w-md mx-auto bg-white/90 backdrop-blur-md z-30 pt-12 pb-3 px-5 header-safe border-b border-gray-100">
                <h2 className="font-bold text-xl text-gray-800 text-center">Lacak Pesanan</h2>
            </div>
            <div className="mt-8 flex flex-col items-center">
                <div className="w-24 h-24 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-6 shadow-inner">
                    <Search className="w-10 h-10" />
                </div>
                <h3 className="font-bold text-xl text-center text-gray-800 mb-2">Cek Status Keberangkatan</h3>
                <p className="text-gray-500 text-sm text-center mb-8">Masukkan nomor invoice atau KTP Anda untuk melihat update perjalanan ibadah.</p>

                <div className="w-full space-y-4">
                    <div className="bg-gray-50 rounded-2xl p-1 border border-gray-200 focus-within:border-[#d4a017] transition-colors relative">
                        <input type="text" placeholder="Contoh: INV-2026-001" className="w-full bg-transparent px-4 py-3 text-sm outline-none" />
                    </div>
                    <Button className="w-full h-12 rounded-xl bg-[#d4a017] hover:bg-[#b88a10] text-white font-bold text-base shadow-lg shadow-[#d4a017]/30">Cari Pesanan</Button>
                </div>

                <div className="w-full mt-10">
                    <h4 className="font-bold text-sm text-gray-800 mb-4">Butuh Bantuan?</h4>
                    <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center justify-between">
                        <div className="flex gap-3 items-center">
                            <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                                <HeadphonesIcon className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-800">Hubungi CS</p>
                                <p className="text-xs text-gray-500">Live chat WA 24/7</p>
                            </div>
                        </div>
                        <ChevronLeft className="w-5 h-5 text-gray-300 rotate-180" />
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="w-full h-[100dvh] max-w-md mx-auto bg-gray-50 relative overflow-x-hidden overflow-y-auto font-sans shadow-2xl safe-area-wrapper">
            <style dangerouslySetInnerHTML={{
                __html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        html, body { background-color: #f3f4f6; }
      `}} />

            {/* Dynamic Content */}
            <div className="min-h-full relative pb-10">
                {activeTab === 'home' && renderHome()}
                {activeTab === 'packages' && renderPackages()}
                {activeTab === 'tracking' && renderTracking()}
                {activeTab === 'articles' && (
                    <div className="flex flex-col items-center justify-center h-[100dvh] text-gray-400">
                        <FileText className="w-12 h-12 mb-4 text-gray-300" />
                        <h3 className="font-bold text-gray-800 text-lg">Artikel</h3>
                        <p className="text-sm">Segera Hadir</p>
                        <button className="mt-6 px-4 py-2 bg-[#d4a017] text-white rounded-xl text-xs font-bold shadow" onClick={() => setActiveTab('home')}>Kembali ke Beranda</button>
                    </div>
                )}
                {activeTab === 'profile' && (
                    <div className="flex flex-col items-center justify-center h-[100dvh] text-gray-400">
                        <User className="w-12 h-12 mb-4 text-gray-300" />
                        <h3 className="font-bold text-gray-800 text-lg">Profil Anda</h3>
                        <p className="text-sm">Silakan hubungi admin</p>
                        <button className="mt-6 px-4 py-2 bg-[#d4a017] text-white rounded-xl text-xs font-bold shadow" onClick={() => setActiveTab('home')}>Kembali ke Beranda</button>
                    </div>
                )}
            </div>
        </div>
    );
}
