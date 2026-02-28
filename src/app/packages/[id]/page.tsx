import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import { format } from "date-fns";
import { Calendar, MapPin, Users, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { MOCK_PACKAGES } from "@/app/page";
import { BookingActions } from "@/components/packages/BookingActions";

interface PackagePageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function PackagePage({ params }: PackagePageProps) {
    const { id } = await params;
    const supabase = await createClient();

    let pkg = null;

    try {
        const { data, error } = await supabase
            .from("packages")
            .select("*")
            .eq("id", id)
            .single();

        if (error) throw error;
        pkg = data;
    } catch (error) {
        // Silently fallback to mock data since env vars are placeholders
        pkg = MOCK_PACKAGES.find(p => p.id === id);
    }

    if (!pkg) {
        notFound();
    }

    const duration = Math.ceil(
        (new Date(pkg.end_date).getTime() - new Date(pkg.start_date).getTime()) /
        (1000 * 60 * 60 * 24)
    );

    return (
        <div className="container py-12 px-4 md:px-6">
            <div className="grid gap-8 md:grid-cols-2">
                <div className="space-y-6">
                    <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-muted">
                        {pkg.image_url ? (
                            <Image
                                src={pkg.image_url}
                                alt={pkg.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-muted-foreground">
                                No Image
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-4 p-6 bg-slate-50 dark:bg-slate-900 rounded-xl">
                        <h3 className="text-xl font-bold">Package Highlights</h3>
                        <ul className="grid gap-3">
                            <li className="flex items-center gap-2">
                                <CheckCircle2 className="h-5 w-5 text-primary" />
                                <span>Direct Flight</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckCircle2 className="h-5 w-5 text-primary" />
                                <span>5 Star Hotels</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckCircle2 className="h-5 w-5 text-primary" />
                                <span>Visa Included</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckCircle2 className="h-5 w-5 text-primary" />
                                <span>Professional Mutawwif</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <Badge variant="outline" className="mb-4 text-sm px-3 py-1">
                            {duration} Days Journey
                        </Badge>
                        <h1 className="text-4xl font-bold tracking-tight mb-2">{pkg.title}</h1>
                        <p className="text-3xl font-bold text-primary">
                            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(pkg.price)}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2 p-3 rounded-lg border bg-card">
                            <Calendar className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <p className="text-muted-foreground text-xs">Departure</p>
                                <p className="font-medium">{format(new Date(pkg.start_date), "dd MMM yyyy")}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 p-3 rounded-lg border bg-card">
                            <Calendar className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <p className="text-muted-foreground text-xs">Return</p>
                                <p className="font-medium">{format(new Date(pkg.end_date), "dd MMM yyyy")}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 p-3 rounded-lg border bg-card">
                            <Users className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <p className="text-muted-foreground text-xs">Capacity</p>
                                <p className="font-medium">{pkg.capacity ?? "Limited"} Seats</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 p-3 rounded-lg border bg-card">
                            <MapPin className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <p className="text-muted-foreground text-xs">Location</p>
                                <p className="font-medium">Makkah & Madinah</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-xl font-bold border-b pb-2">Description</h3>
                        <div className="prose dark:prose-invert max-w-none text-muted-foreground">
                            <p>{pkg.description}</p>
                        </div>
                    </div>

                    <BookingActions pkg={pkg} />
                </div>
            </div>
        </div>
    );
}
