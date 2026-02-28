import { notFound } from "next/navigation";
import Link from "next/link";
import { TrackingDashboard } from "@/components/tracking/TrackingDashboard";

interface TrackingResultPageProps {
    params: Promise<{ invoiceId: string }>;
}

// ── Mock booking data generator ────────────────────────────────────────────────
function getMockBooking(invoiceId: string) {
    // Valid demo invoices and real supabase IDs (approx)
    const isValid = invoiceId.startsWith("INV-") || invoiceId.length > 20;
    if (!isValid) return null;

    // Simulate different statuses based on invoice suffix
    const suffix = invoiceId.split("-").pop() || "";
    const seed = suffix.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);

    const paymentStages = [
        { id: "dp", label: "DP Diterima", desc: "Down Payment Rp 5.000.000 telah diterima", done: true, date: "20 Feb 2026 14:32" },
        { id: "cicilan1", label: "Cicilan Ke-1", desc: "Pembayaran cicilan pertama Rp 7.966.667", done: seed % 3 >= 1, date: seed % 3 >= 1 ? "28 Feb 2026 09:15" : undefined },
        { id: "cicilan2", label: "Cicilan Ke-2", desc: "Pembayaran cicilan kedua Rp 7.966.667", done: seed % 3 >= 2, date: seed % 3 >= 2 ? "15 Mar 2026 10:20" : undefined },
        { id: "lunas", label: "Pembayaran Lunas", desc: "Total pembiayaan paket telah terpenuhi", done: seed % 4 === 0, date: seed % 4 === 0 ? "28 Mar 2026 11:00" : undefined },
    ];

    const docStages = [
        { id: "ktp", label: "KTP Diterima", desc: "Kartu Tanda Penduduk telah diverifikasi", done: true, date: "20 Feb 2026 14:35" },
        { id: "passport", label: "Paspor Diterima", desc: "Paspor aktif min. 6 bulan dari keberangkatan", done: seed % 2 === 0, date: seed % 2 === 0 ? "22 Feb 2026 16:00" : undefined },
        { id: "photo", label: "Foto Resmi", desc: "4x6 background putih & 3x4 background merah", done: seed % 5 === 0 || seed % 7 === 0, date: undefined },
        { id: "complete", label: "Dokumen Lengkap", desc: "Seluruh dokumen telah diverifikasi admin", done: seed % 7 === 0, date: undefined },
    ];

    const visaStages = [
        { id: "submit", label: "Pengajuan Visa", desc: "Dokumen telah diajukan ke Kedutaan Saudi Arabia", done: seed % 3 >= 1, date: seed % 3 >= 1 ? "01 Mar 2026 08:00" : undefined },
        { id: "process", label: "Proses Verifikasi", desc: "Sedang dalam proses verifikasi oleh Kedutaan", done: seed % 3 >= 2, date: seed % 3 >= 2 ? "10 Mar 2026" : undefined },
        { id: "interview", label: "Biometrik", desc: "Perekaman biometrik (sidik jari + foto)", done: seed % 4 === 0, date: seed % 4 === 0 ? "15 Mar 2026" : undefined },
        { id: "approved", label: "Visa Approved", desc: "Visa Umroh telah dikeluarkan — Alhamdulillah!", done: seed % 7 === 0, date: undefined },
    ];

    const departureStages = [
        { id: "registered", label: "Terdaftar", desc: "Jamaah terdaftar dalam manifest keberangkatan", done: true, date: "20 Feb 2026" },
        { id: "scheduled", label: "Jadwal Ditetapkan", desc: "Penerbangan Turkish Airlines TK-9712 | 15 Mei 2026 pukul 00:30 WIB", done: seed % 2 === 0, date: seed % 2 === 0 ? "05 Mar 2026" : undefined },
        { id: "briefing", label: "Manasik & Briefing", desc: "Pertemuan manasik wajib sebelum keberangkatan", done: false, date: undefined },
        { id: "departed", label: "Keberangkatan", desc: "Pesawat lepas landas menuju Madinah — Semoga mabrur!", done: false, date: undefined },
    ];

    // ── Trip Detail Data ──────────────────────────────────────────────────────
    const tripDetail = {
        itinerary: [
            {
                day: 1,
                title: "Keberangkatan dari Indonesia",
                location: "Jakarta → Istanbul",
                activities: [
                    "Pukul 23.30 WIB – Berkumpul di Terminal 3 Bandara Soekarno-Hatta",
                    "Pukul 00.30 WIB – Boarding & takeoff Turkish Airlines TK-9712",
                    "Transit di Istanbul Atatürk Airport (± 4 jam)",
                    "Penerbangan lanjutan Istanbul → Madinah",
                ],
            },
            {
                day: 2,
                title: "Tiba di Madinah Al-Munawwarah",
                location: "Madinah, Arab Saudi",
                activities: [
                    "Tiba di Bandara Amir Muhammad bin Abdulaziz, Madinah",
                    "Transfer ke hotel & check-in Anwar Al Madinah",
                    "Istirahat & persiapan",
                    "Shalat Maghrib & Isya berjamaah di Masjid Nabawi",
                    "Makan malam bersama rombongan",
                ],
            },
            {
                day: 3,
                title: "Ziarah di Madinah",
                location: "Madinah, Arab Saudi",
                activities: [
                    "Subuh berjamaah di Masjid Nabawi",
                    "Ziarah Raudhah & Makam Rasulullah SAW",
                    "Kunjungan Masjid Quba (masjid pertama dalam sejarah Islam)",
                    "Masjid Qiblatayn (masjid dua kiblat)",
                    "Kebun kurma & oleh-oleh khas Madinah",
                ],
            },
            {
                day: 4,
                title: "Madinah – Makkah Al-Mukarramah",
                location: "Madinah → Makkah",
                activities: [
                    "Subuh di Masjid Nabawi",
                    "Check-out hotel & persiapan ihram di Bir Ali (Miqat)",
                    "Perjalanan bus Madinah → Makkah (± 6 jam)",
                    "Tiba di Makkah & check-in Swissôtel Al Maqam",
                    "Pelaksanaan Umroh (Thawaf, Sa'i, Tahallul) – Alhamdulillah!",
                ],
            },
            {
                day: 5,
                title: "Ibadah di Masjidil Haram",
                location: "Makkah Al-Mukarramah",
                activities: [
                    "Shalat fardhu 5 waktu di Masjidil Haram",
                    "Thawaf sunnah",
                    "Minum air Zamzam langsung dari sumbernya",
                    "Kajian agama bersama ustadz pembimbing",
                ],
            },
            {
                day: 6,
                title: "Ziarah Sejarah Makkah",
                location: "Makkah Al-Mukarramah",
                activities: [
                    "Ziarah Jabal Nur (Gua Hira) – tempat turunnya wahyu pertama",
                    "Jabal Tsur – Gua tempat Rasulullah bersembunyi",
                    "Maktabah Makkah & Museum sejarah Islam",
                    "Shalat tarawih di Masjidil Haram",
                ],
            },
            {
                day: 7,
                title: "Free Day & Persiapan Pulang",
                location: "Makkah Al-Mukarramah",
                activities: [
                    "Waktu bebas untuk ibadah mandiri & belanja",
                    "Thawaf wada' (thawaf perpisahan)",
                    "Makan siang & istirahat di hotel",
                    "Persiapan keberangkatan ke bandara",
                    "Transfer ke Bandara King Abdulaziz Jeddah",
                ],
            },
            {
                day: 8,
                title: "Kembali ke Tanah Air",
                location: "Jeddah → Istanbul → Jakarta",
                activities: [
                    "Keberangkatan dari Bandara King Abdulaziz Jeddah",
                    "Transit Istanbul (± 3 jam)",
                    "Penerbangan lanjutan menuju Jakarta",
                ],
            },
            {
                day: 9,
                title: "Tiba di Indonesia",
                location: "Jakarta, Indonesia",
                activities: [
                    "Mendarat di Bandara Soekarno-Hatta Terminal 3",
                    "Proses imigrasi & pengambilan bagasi",
                    "Penjemputan keluarga di area kedatangan",
                    "Selamat datang kembali, Haji/Hajjah Mabrur! 🤲",
                ],
            },
        ],
        hotels: [
            {
                name: "Swissôtel Al Maqam",
                city: "Makkah",
                roomNumber: seed % 2 === 0 ? `${3 + (seed % 7)}${String(10 + (seed % 88)).padStart(2, "0")}` : undefined,
                starRating: 5,
                checkIn: "15 Mei 2026",
                checkOut: "19 Mei 2026",
                mapsUrl: "https://maps.google.com/?q=Swissôtel+Al+Maqam+Makkah",
            },
            {
                name: "Anwar Al Madinah Movenpick",
                city: "Madinah",
                roomNumber: seed % 3 === 0 ? `${2 + (seed % 5)}${String(20 + (seed % 60)).padStart(2, "0")}` : undefined,
                starRating: 5,
                checkIn: "12 Mei 2026",
                checkOut: "15 Mei 2026",
                mapsUrl: "https://maps.google.com/?q=Anwar+Al+Madinah+Movenpick",
            },
        ],
        mutawif: {
            name: "Ustadz H. Ahmad Fauzi, Lc.",
            phone: "0812-3456-7890",
            whatsapp: "0812-3456-7890",
            region: "Makkah & Madinah",
        },
    };

    return {
        invoiceId,
        packageName: "Umroh Berkah Plus Turki 9 Hari",
        jamaahName: "Muhammad Contoh Jamaah",
        email: "contohjamaah@jawarawisata.com",
        whatsapp: "081234567890",
        airlines: "Turkish Airlines",
        flightCode: "TK-9712",
        departureDate: "15 Mei 2026",
        hotelMakkah: "Swissôtel Al Maqam",
        hotelMadinah: "Anwar Al Madinah",
        bookedAt: "20 Feb 2026",
        tripDetail,
        payment: {
            scheme: "Cicilan 3x",
            total: 32500000,
            paid: 5000000 + (seed % 3 >= 1 ? 7966667 : 0) + (seed % 3 >= 2 ? 7966667 : 0),
            stages: paymentStages,
        },
        document: { stages: docStages },
        visa: { stages: visaStages },
        departure: { stages: departureStages },
    };
}

export default async function TrackingResultPage({ params }: TrackingResultPageProps) {
    const { invoiceId } = await params;
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
                .eq("id", cleanId)
                .single();

            if (!error && data) {
                // Generate tracking format from real database
                const MOCK_TRIP = getMockBooking("INV-X")?.tripDetail; // Keep mock itinerary details for demo

                const MOCK_STAGE = getMockBooking("INV-X");
                const isConfirmed = data.status === "confirmed";

                bookingDataForTracking = {
                    invoiceId: `INV-${data.id}`,
                    packageName: data.packages?.title || "Paket Umroh Reguler",
                    jamaahName: data.profiles?.full_name || data.profiles?.username || "Hamba Allah",
                    email: data.profiles?.email || "Tidak ada email",
                    whatsapp: data.profiles?.whatsapp || "628000000000",
                    airlines: "Turkish Airlines",
                    flightCode: "TK-9712",
                    departureDate: data.packages?.start_date ? new Date(data.packages.start_date).toLocaleDateString("id-ID") : "Menunggu Jadwal",
                    hotelMakkah: "Swissôtel Al Maqam",
                    hotelMadinah: "Anwar Al Madinah",
                    bookedAt: new Date(data.created_at).toLocaleDateString("id-ID"),
                    ktpUrl: data.ktp_url || null,
                    passportUrl: data.passport_url || null,
                    tripDetail: MOCK_TRIP,
                    payment: data.tracking_data?.payment || {
                        scheme: data.payment_method || "Tunai",
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
                };
            }
        }
    } catch (e) {
        console.error("Tracking DB load error", e);
    }

    // fallback if no db data
    const booking = bookingDataForTracking || getMockBooking(decodeURIComponent(invoiceId));

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
