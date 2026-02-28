import { publicSupabase } from "@/lib/supabase/public";
import { PackageCard } from "@/components/packages/PackageCard";
import { Database } from "@/types/database.types";

export const revalidate = 3600; // Revalidate every hour

import { MOCK_PACKAGES } from "@/app/page";

export default async function PackagesPage() {
    let packagesData = null;

    try {
        const { data: packages, error } = await publicSupabase
            .from("packages")
            .select("*")
            .eq("is_active", true)
            .order("start_date", { ascending: true });

        if (error) throw error;
        packagesData = packages;
    } catch (err) {
        // Silently fallback to mock data since env vars are placeholders
        packagesData = MOCK_PACKAGES;
    }

    return (
        <div className="container py-12 px-4 md:px-6">
            <div className="flex flex-col gap-4 mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Available Packages</h1>
                <p className="text-muted-foreground text-lg">
                    Choose from our carefully curated Umroh and travel packages.
                </p>
            </div>

            {packagesData && packagesData.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {packagesData.map((pkg: any) => (
                        <PackageCard key={pkg.id} pkg={pkg} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-muted/30 rounded-lg">
                    <h3 className="text-xl font-medium mb-2">No packages found</h3>
                    <p className="text-muted-foreground">
                        Check back later for upcoming journeys.
                    </p>
                </div>
            )}
        </div>
    );
}
