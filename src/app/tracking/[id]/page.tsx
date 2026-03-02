import { notFound } from "next/navigation";
import Link from "next/link";
import { TrackingDashboard } from "@/components/tracking/TrackingDashboard";

interface TrackingResultPageProps {
    params: Promise<{ id: string }>;
}


export default async function TrackingResultPage({ params }: TrackingResultPageProps) {
    const { id: invoiceId } = await params;
    const cleanId = decodeURIComponent(invoiceId).replace("INV-", "");

    let bookingDataForTracking: any = null;

    try {
        const { createClient } = await import("@supabase/supabase-js");
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

        if (supabaseUrl && supabaseAnonKey) {
            const supabase = createClient(supabaseUrl, supabaseAnonKey);
            const { data, error } = await supabase
                .from("bookings")
                .select("*, packages(*), profiles(*)")
                .or(`invoice_id.eq.${invoiceId},id.eq.${invoiceId.replace("INV-", "")}`)
                .maybeSingle();

            if (!error && data) {
                const isConfirmed = data.status === "confirmed" || data.status === "process" || data.status === "completed";

                // Map database data to our tracking object structure
                bookingDataForTracking = {
                    invoiceId: `INV-${data.id.substring(0, 8).toUpperCase()}`,
                    packageName: data.packages?.title || "Paket Umroh Jawara",
                    jamaahName: data.profiles?.full_name || data.profiles?.username || "Jamaah",
                    email: data.profiles?.email || "Tidak ada email",
                    whatsapp: data.tracking_data?.whatsapp || data.profiles?.phone || "628000000000",
                    airlines: data.packages?.airlines || "Turkish Airlines",
                    flightCode: data.tracking_data?.flightCode || "TK-9712",
                    departureDate: data.packages?.start_date ? new Date(data.packages.start_date).toLocaleDateString("id-ID") : "Menunggu Jadwal",
                    bookedAt: new Date(data.created_at).toLocaleDateString("id-ID"),
                    ktpUrl: data.ktp_url || null,
                    passportUrl: data.passport_url || null,

                    // Main tracking sections from DB JSON or defaults
                    payment: data.tracking_data?.payment || {
                        scheme: data.payment_method || "DP Pembayaran",
                        total: data.packages?.promo_price || data.packages?.price || 0,
                        paid: data.payment_status === "paid" ? (data.packages?.promo_price || data.packages?.price || 0) : data.payment_status === "dp_paid" ? 5000000 : 0,
                        stages: [
                            { id: "dp", label: "DP Diterima", desc: "Down Payment telah dikonfirmasi", done: data.payment_status !== "unpaid", date: new Date(data.created_at).toLocaleDateString("id-ID") },
                            { id: "lunas", label: "Pembayaran Lunas", desc: "Total pembiayaan paket telah terpenuhi", done: data.payment_status === "paid" },
                        ],
                    },
                    document: data.tracking_data?.document || {
                        stages: [
                            { id: "ktp", label: "Dokumen Diverifikasi", desc: "Dokumen jamaah telah diverifikasi admin", done: isConfirmed },
                        ]
                    },
                    visa: data.tracking_data?.visa || {
                        stages: [
                            { id: "process", label: "Proses Verifikasi", desc: "Sedang dalam proses", done: isConfirmed },
                            { id: "approved", label: "Visa Approved", desc: "Visa Umroh telah dikeluarkan", done: false },
                        ]
                    },
                    departure: data.tracking_data?.departure || {
                        stages: [
                            { id: "registered", label: "Terdaftar", desc: "Jamaah terdaftar dalam manifest", done: true },
                            { id: "scheduled", label: "Jadwal Ditetapkan", desc: "Menunggu Maskapai", done: false },
                        ]
                    },

                    // Trip details (Schedule, Hotel, Mutawif) from DB JSON
                    tripDetail: data.trip_detail || {
                        itinerary: [],
                        hotels: [
                            { name: data.packages?.hotel_makkah || "Swissôtel Al Maqam", city: "Makkah", roomNumber: "", starRating: 5, mapsUrl: "", checkIn: "", checkOut: "" },
                            { name: data.packages?.hotel_madinah || "Anwar Al Madinah", city: "Madinah", roomNumber: "", starRating: 5, mapsUrl: "", checkIn: "", checkOut: "" }
                        ],
                        mutawif: { name: "Ustadz Pembimbing", phone: "", whatsapp: "", region: "Makkah/Madinah" }
                    }
                };
            }
        }
    } catch (e) {
        console.error("Tracking DB load error", e);
    }

    const booking = bookingDataForTracking;

    if (!booking) {
        return (
            <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center px-4 text-center">
                <div className="text-6xl mb-6">🔍</div>
                <h1 className="text-2xl font-bold text-gray-800 mb-3">Invoice Tidak Ditemukan</h1>
                <p className="text-gray-500 mb-8 max-w-sm">
                    Nomor invoice <span className="font-mono text-[#d4a017] font-bold">{invoiceId}</span> tidak ditemukan dalam sistem kami.
                    Pastikan Anda memasukkan nomor yang benar.
                </p>
                <Link
                    href="/tracking"
                    className="px-8 py-3 rounded-xl font-bold text-white"
                    style={{ background: "linear-gradient(135deg, #d4a017, #b88a10)" }}
                >
                    Coba Lagi
                </Link>
            </div>
        );
    }

    return <TrackingDashboard booking={booking} />;
}
