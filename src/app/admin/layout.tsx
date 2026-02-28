"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, Users, BookOpen, LogOut, Star, FileText, Plane, Wallet, Globe, PiggyBank } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/ustadz", label: "Ustadz Pembimbing", icon: Star },
    { href: "/admin/packages", label: "Paket Umroh", icon: Package },
    { href: "/admin/bookings", label: "Pemesanan", icon: BookOpen },
    { href: "/admin/documents", label: "Dokumen & Visa", icon: FileText },
    { href: "/admin/departures", label: "Keberangkatan", icon: Plane },
    { href: "/admin/finance", label: "Keuangan", icon: Wallet },
    { href: "/admin/content", label: "Konten Website", icon: Globe },
    { href: "/admin/users", label: "Pengguna", icon: Users },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed h-full z-10">
                <div className="p-6 border-b border-gray-100">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#d4a017] rounded-xl flex items-center justify-center">
                            <span className="text-white font-bold text-lg font-serif">J</span>
                        </div>
                        <div>
                            <p className="font-bold text-gray-900 text-sm leading-tight">Jawara Wisata</p>
                            <p className="text-xs text-gray-500">Admin Panel</p>
                        </div>
                    </Link>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                                    isActive
                                        ? "bg-[#d4a017] text-white shadow-sm"
                                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                )}
                            >
                                <Icon className="w-5 h-5" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <Link
                        href="/"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all"
                    >
                        <LogOut className="w-5 h-5" />
                        Kembali ke Website
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 min-h-screen">
                {children}
            </main>
        </div>
    );
}
