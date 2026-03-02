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
        console.error("Error fetching packages for android:", err);
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
