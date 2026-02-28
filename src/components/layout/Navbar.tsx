"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Search } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function Navbar() {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = React.useState(false)
    const [scrolled, setScrolled] = React.useState(false)

    React.useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const navLinks = [
        { name: "Beranda", href: "/" },
        { name: "Paket", href: "/packages" },
        { name: "Artikel", href: "/articles" },
        { name: "Lacak", href: "/tracking" },
        { name: "Profil", href: "/profile" },
    ]

    if (pathname?.startsWith("/admin") || pathname?.startsWith("/android")) {
        return null;
    }

    return (
        <header
            className={cn(
                "fixed top-0 z-50 w-full transition-all duration-300",
                scrolled
                    ? "bg-white/95 backdrop-blur-md shadow-sm py-3"
                    : "bg-transparent py-6"
            )}
        >
            <div className="container mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="relative w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-primary to-primary/80 rounded-lg transform rotate-3 group-hover:rotate-6 transition-transform flex items-center justify-center shadow-lg">
                        <span className="text-white font-serif font-bold text-lg md:text-xl -rotate-3">J</span>
                    </div>
                    <div className="flex flex-col">
                        <span className={cn(
                            "font-serif font-bold text-lg md:text-xl tracking-wide leading-none transition-colors",
                            scrolled ? "text-primary" : "text-white"
                        )}>
                            Jawara Wisata
                        </span>
                        <span className={cn(
                            "text-[0.6rem] uppercase tracking-[0.2em] font-medium transition-colors",
                            scrolled ? "text-muted-foreground" : "text-white/80"
                        )}>
                            Travel Haji & Umroh
                        </span>
                    </div>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden xl:flex items-center gap-6">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={cn(
                                "text-sm font-bold uppercase tracking-wide transition-colors hover:text-[#d4a017]",
                                scrolled ? "text-foreground/80" : "text-white/90"
                            )}
                        >
                            {link.name}
                        </Link>
                    ))}
                </nav>

                {/* Right Side Actions */}
                <div className="flex items-center gap-4">
                    <Link href="/contact" className="hidden sm:block">
                        <Button
                            className="bg-[#d4a017] hover:bg-[#b88a10] text-white font-bold rounded-full px-6 py-5 shadow-lg shadow-[#d4a017]/20 transition-all hover:scale-105"
                        >
                            Konsultasi Gratis
                        </Button>
                    </Link>

                    {/* Mobile Menu Toggle */}
                    <button
                        className={cn(
                            "xl:hidden p-2 rounded-md transition-colors",
                            scrolled ? "text-foreground hover:bg-muted" : "text-white hover:bg-white/10"
                        )}
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <div className="absolute top-full left-0 w-full bg-background/95 backdrop-blur-md border-b shadow-xl xl:hidden animate-in slide-in-from-top-2">
                    <nav className="container px-4 py-4 flex flex-col gap-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="p-3 text-sm font-bold uppercase tracking-wide hover:bg-muted rounded-md transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <div className="h-px bg-border my-2" />
                        <Link
                            href="/contact"
                            className="p-3 text-sm font-bold uppercase tracking-wide text-[#d4a017] hover:bg-muted rounded-md transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            Konsultasi Gratis
                        </Link>
                    </nav>
                </div>
            )}
        </header>
    )
}
