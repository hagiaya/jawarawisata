import Link from "next/link";
import { format } from "date-fns";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Users, ArrowRight, Plane, Building, FileText, CheckCircle2 } from "lucide-react";
import { Database } from "@/types/database.types";
import Image from "next/image";

type Package = Database["public"]["Tables"]["packages"]["Row"];

interface PackageCardProps {
    pkg: Package;
}

export function PackageCard({ pkg }: PackageCardProps) {
    return (
        <Card className="flex flex-col overflow-hidden h-full group border-0 shadow-sm hover:shadow-xl transition-all duration-300 bg-card rounded-2xl">
            {/* Image */}
            <div className="relative aspect-[4/3] w-full overflow-hidden">
                {pkg.image_url ? (
                    <Image
                        src={pkg.image_url}
                        alt={pkg.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full bg-muted text-muted-foreground">No Image</div>
                )}
                <div className="absolute top-2.5 right-2.5 z-10 flex flex-col items-end gap-1.5">
                    {pkg.package_type && (
                        <Badge className="bg-[#d4a017] text-white hover:bg-[#b88a10] border-0 px-2.5 py-0.5 text-[10px] uppercase tracking-wider font-bold shadow-sm">
                            {pkg.package_type}
                        </Badge>
                    )}
                    <Badge className="bg-white/90 text-primary hover:bg-white shadow-sm backdrop-blur-sm border-0 px-2.5 py-0.5 text-[10px] uppercase tracking-wider font-bold">
                        {Math.ceil((new Date(pkg.end_date).getTime() - new Date(pkg.start_date).getTime()) / (1000 * 60 * 60 * 24))} Hari
                    </Badge>
                </div>
                {/* Flash Sale badge */}
                {(pkg as any).flash_sale && (
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                        ⚡ FLASH SALE
                    </div>
                )}
            </div>

            {/* Header */}
            <CardHeader className="p-4 pb-1.5">
                <h3 className="font-serif text-base font-bold leading-tight line-clamp-2 text-foreground mb-1.5 group-hover:text-primary transition-colors">
                    {pkg.title}
                </h3>
                <div className="flex flex-col gap-0.5">
                    {pkg.promo_price ? (
                        <>
                            <p className="font-sans text-xs font-semibold text-muted-foreground line-through decoration-red-500/50">
                                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(pkg.price)}
                            </p>
                            <p className="font-sans text-base font-black text-red-600">
                                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(pkg.promo_price)}
                            </p>
                        </>
                    ) : (
                        <p className="font-sans text-base font-black text-foreground">
                            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(pkg.price)}
                        </p>
                    )}
                </div>
            </CardHeader>

            {/* Content */}
            <CardContent className="p-4 py-2 flex-1">
                <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                    <p className="line-clamp-2 text-xs text-foreground/70 leading-relaxed">
                        {pkg.description || "No description available."}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                        <div className="flex items-center gap-1 text-xs font-medium text-primary/80">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>{format(new Date(pkg.start_date), "dd MMM yy")}</span>
                        </div>
                        {pkg.available_seats !== null && pkg.available_seats !== undefined && (
                            <div className="flex items-center gap-1 text-xs font-medium text-primary/80">
                                <Users className="h-3.5 w-3.5" />
                                <span>{pkg.available_seats} seat</span>
                            </div>
                        )}
                    </div>
                    {pkg.airlines && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Plane className="h-3 w-3 text-primary/60" />
                            <span>{pkg.airlines}</span>
                        </div>
                    )}
                </div>
            </CardContent>

            {/* Footer */}
            <CardFooter className="p-4 pt-2 mt-auto flex flex-col gap-2">
                <Link href={`/packages/${pkg.id}/book`} className="w-full">
                    <Button className="w-full bg-[#d4a017] hover:bg-[#b88a10] text-white transition-all duration-300 font-bold h-9 text-sm rounded-xl">
                        Pesan Sekarang <CheckCircle2 className="ml-1.5 h-3.5 w-3.5" />
                    </Button>
                </Link>
                <Link href={`/packages/${pkg.id}`} className="w-full">
                    <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-white border-primary/20 transition-all duration-300 h-8 text-xs rounded-xl">
                        Lihat Detail <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    );
}
