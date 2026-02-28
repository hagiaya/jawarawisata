import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { BookingForm } from "@/components/booking/BookingForm";
import { MOCK_PACKAGES } from "@/app/page";

interface BookingPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function BookingPage({ params }: BookingPageProps) {
    const { id } = await params;
    const supabase = await createClient();

    let user = null;
    try {
        const { data: { user: supabaseUser } } = await supabase.auth.getUser();
        user = supabaseUser;
    } catch (e) { }

    if (!user) {
        user = {
            id: "mock_user_123",
            email: "contohjamaah@jawarawisata.com",
            user_metadata: {
                full_name: "Muhammad Contoh Jamaah"
            }
        };
    }

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
        pkg = MOCK_PACKAGES.find(p => p.id === id);
    }

    if (!pkg) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-stone-50">
            {/* Header paket */}
            <div className="bg-white border-b border-gray-100 py-6 shadow-sm">
                <div className="container max-w-2xl mx-auto px-4">
                    <p className="text-xs text-[#d4a017] font-bold uppercase tracking-widest mb-1">Checkout Paket</p>
                    <h1 className="text-xl font-bold text-gray-900 leading-tight">{pkg.title}</h1>
                    <p className="text-sm text-gray-500 mt-1">Lengkapi data di bawah ini untuk menyelesaikan pemesanan</p>
                </div>
            </div>

            {/* Form */}
            <div className="container max-w-2xl mx-auto px-4 py-8">
                <BookingForm pkg={pkg} user={user} />
            </div>
        </div>
    );
}

