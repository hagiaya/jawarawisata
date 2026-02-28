import { publicSupabase } from "@/lib/supabase/public";
import ClientApp from "./ClientApp";

export const dynamic = "force-dynamic";

export default async function AndroidPage() {
    let packagesData: any[] = [];

    try {
        const { data: packages, error } = await publicSupabase
            .from("packages")
            .select("*")
            .eq("is_active", true)
            .order("start_date", { ascending: true })
            .limit(12);

        if (error) {
            // Silently fallback, usually fetch issue during dev
        } else {
            packagesData = packages || [];
        }
    } catch (err) {
        // Fallback to mock data for development
    }

    // Fallback to mock data if empty (useful for development)
    if (packagesData.length === 0) {
        packagesData = [
            {
                id: "mock-1",
                title: "Umroh Berkah Plus Turki 12 Hari",
                price: 32500000,
                promo_price: 28900000,
                image_url: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=80&w=800",
                package_type: "Plus Turki",
                flash_sale: true,
            },
            {
                id: "mock-2",
                title: "Umroh Reguler Syawal 9 Hari",
                price: 28500000,
                promo_price: 24900000,
                image_url: "https://images.unsplash.com/photo-1565552684305-7e43f3665045?q=80&w=800",
                package_type: "Reguler",
                flash_sale: true,
            },
            {
                id: "mock-3",
                title: "Umroh VIP Ramadhan 15 Hari",
                price: 45000000,
                promo_price: 39900000,
                image_url: "https://images.unsplash.com/photo-1519817650390-64a93db51149?q=80&w=800",
                package_type: "VIP",
                flash_sale: true,
            }
        ];
    }

    return (
        <div className="bg-gray-200 min-h-screen w-full flex justify-center items-center p-0 md:p-4">
            <div className="w-full max-w-md h-[100dvh] md:h-[90vh] md:rounded-[2.5rem] overflow-hidden shadow-2xl relative bg-black md:border-[8px] border-black">
                {/* Notch simulation on desktop */}
                <div className="hidden md:block absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-3xl z-50"></div>

                {/* App Frame */}
                <div className="w-full h-full bg-white relative">
                    <ClientApp packagesData={packagesData} />
                </div>
            </div>
        </div>
    );
}
