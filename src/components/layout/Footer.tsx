"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Facebook, Instagram, Twitter, Youtube, MapPin, Phone, Mail, CheckCircle2 } from "lucide-react";

export function Footer() {
    const pathname = usePathname();

    if (pathname?.startsWith("/admin") || pathname?.startsWith("/android")) {
        return null;
    }

    return (
        <footer className="bg-[#022c22] text-emerald-100/80 border-t border-emerald-900">
            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
                    {/* Brand & Address */}
                    <div className="space-y-6 lg:col-span-1">
                        <Link href="/" className="flex items-center gap-2 group mb-4">
                            <div className="relative w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-primary to-primary/80 rounded-lg transform rotate-3 group-hover:rotate-6 transition-transform flex items-center justify-center shadow-lg">
                                <span className="text-white font-serif font-bold text-lg md:text-xl -rotate-3">J</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-serif font-bold text-lg md:text-xl tracking-wide leading-none text-white">
                                    Jawara Wisata
                                </span>
                            </div>
                        </Link>
                        <p className="text-sm leading-relaxed">
                            Intermark Indonesia Ruko 9 & 10, Jalan Lingkar Timur No. 9 BSD Kota Tangerang Selatan, Banten 15310
                        </p>
                        <p className="text-sm font-bold text-white">
                            hotline@jawarawisata.com
                        </p>
                    </div>

                    {/* Layanan */}
                    <div className="space-y-6">
                        <h4 className="font-bold text-white text-sm uppercase tracking-wider">Layanan</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/haji" className="hover:text-emerald-300 transition-colors font-bold text-emerald-50">Haji Furoda</Link></li>
                            <li><Link href="/haji" className="hover:text-emerald-300 transition-colors font-bold text-emerald-50">Haji Plus/Haji Khusus</Link></li>
                            <li><Link href="/umroh" className="hover:text-emerald-300 transition-colors font-bold text-emerald-50">Umroh bersama Ustadz</Link></li>
                            <li><Link href="/umroh" className="hover:text-emerald-300 transition-colors font-bold text-emerald-50">Umroh Lebih Hemat</Link></li>
                            <li><Link href="/umroh" className="hover:text-emerald-300 transition-colors font-bold text-emerald-50">Umroh Lebih Nyaman</Link></li>
                            <li><Link href="/halal-tour" className="hover:text-emerald-300 transition-colors font-bold text-emerald-50">Jelajah Dunia</Link></li>
                            <li><Link href="/saving" className="hover:text-emerald-300 transition-colors font-bold text-emerald-50">Tabungan Umroh</Link></li>
                            <li><Link href="/badal" className="hover:text-emerald-300 transition-colors font-bold text-emerald-50">Badal Umroh</Link></li>
                            <li><Link href="/badal" className="hover:text-emerald-300 transition-colors font-bold text-emerald-50">Badal Haji</Link></li>
                            <li><Link href="/store" className="hover:text-emerald-300 transition-colors font-bold text-emerald-50">JW Online Store</Link></li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div className="space-y-6">
                        <h4 className="font-bold text-white text-sm uppercase tracking-wider">Company</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/about" className="hover:text-emerald-300 transition-colors font-bold text-emerald-50">Tentang Kami</Link></li>
                            <li><Link href="/ustadz" className="hover:text-emerald-300 transition-colors font-bold text-emerald-50">Profil Ustadz Pembimbing</Link></li>
                            <li><Link href="/panduan-umroh" className="hover:text-emerald-300 transition-colors font-bold text-emerald-50">Panduan Umroh Digital</Link></li>
                            <li><Link href="/articles" className="hover:text-emerald-300 transition-colors font-bold text-emerald-50">Artikel</Link></li>
                            <li><Link href="/contact" className="hover:text-emerald-300 transition-colors font-bold text-emerald-50">Hubungi Kami</Link></li>
                        </ul>
                    </div>

                    {/* Social */}
                    <div className="space-y-6">
                        <h4 className="font-bold text-white text-sm uppercase tracking-wider">Social</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="#" className="hover:text-emerald-300 transition-colors font-bold text-emerald-50">Twitter</Link></li>
                            <li><Link href="#" className="hover:text-emerald-300 transition-colors font-bold text-emerald-50">Youtube</Link></li>
                            <li><Link href="#" className="hover:text-emerald-300 transition-colors font-bold text-emerald-50">Facebook</Link></li>
                            <li><Link href="#" className="hover:text-emerald-300 transition-colors font-bold text-emerald-50">Instagram</Link></li>
                            <li><Link href="#" className="hover:text-emerald-300 transition-colors font-bold text-emerald-50">Tiktok</Link></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div className="space-y-6">
                        <h4 className="font-bold text-white text-sm uppercase tracking-wider">Legal</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/privacy" className="hover:text-emerald-300 transition-colors font-bold text-emerald-50">Kebijakan & Privasi</Link></li>
                        </ul>
                        <div className="pt-2">
                            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-900/50 rounded-lg border border-emerald-800 w-fit">
                                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-emerald-100">SISKO PATUH</span>
                                    <span className="text-[10px] text-emerald-400">Terdaftar & Diawasi</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-emerald-900">
                <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-xs text-emerald-100/60 order-2 md:order-1">
                        &copy; {new Date().getFullYear()} PT JAWARA WISATA BERKAH BERSAMA. All rights reserved.
                    </div>
                    <div className="flex gap-4 order-1 md:order-2">
                        <Link href="#" className="text-emerald-100/60 hover:text-white transition-colors">
                            <Youtube className="h-5 w-5" />
                        </Link>
                        <Link href="#" className="text-emerald-100/60 hover:text-white transition-colors">
                            <Twitter className="h-5 w-5" />
                        </Link>
                        <Link href="#" className="text-emerald-100/60 hover:text-white transition-colors">
                            <Facebook className="h-5 w-5" />
                        </Link>
                        <Link href="#" className="text-emerald-100/60 hover:text-white transition-colors">
                            <Instagram className="h-5 w-5" />
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
