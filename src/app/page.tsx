import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Shield, Clock, MapPin, Phone, Plane, Users, BookOpen, HeartHandshake, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { publicSupabase } from "@/lib/supabase/public";
import { PackageCard } from "@/components/packages/PackageCard";
import { FlashSaleCountdown } from "@/components/ui/FlashSaleCountdown";


const DEFAULT_USTADZ = [
  {
    id: "1",
    name: "Ustadz Adi Hidayat, Lc., M.A.",
    role: "Ulama & Dai Nasional",
    photo_url: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgQPhIiS8RTh1zGO3qo9S9XsaQ8TANKkRvWoLfwlJS_XQUgW80885R56r97MUgGGPMxq9sQx1bVqPQshLkhBKdl5C3y3YeDEePtqPGUhTydTFRx07eZrE9SyTxKlBbdmstFPv9D4kk-RKY/s584/images+%25281%2529.jpg",
  },
  {
    id: "2",
    name: "Ustadz Abdul Somad, Lc., M.A.",
    role: "Ulama & Dai Nasional",
    photo_url: "https://d54-invdn-com.investing.com/content/pic95ba09ceedeef79d6e42480271821e81.jpg",
  },
  {
    id: "3",
    name: "Ustadz Khalid Basalamah, M.A.",
    role: "Dai & Ulama Islam",
    photo_url: "https://magelangekspres.disway.id/upload/73b306fd3a095052d32f420e4674067e.jpeg",
  },
  {
    id: "4",
    name: "Ustadz Felix Siauw",
    role: "Dai & Penulis",
    photo_url: "https://satriadharma.com/wp-content/uploads/2022/01/ustad-felix-siauw-instagram.jpg",
  },
];

export const revalidate = 3600;

export const MOCK_PACKAGES = [
  // === FLASH SALE PACKAGES (promo_price set, flash_sale: true) ===
  {
    id: "mock-1",
    created_at: new Date().toISOString(),
    title: "Umroh Berkah Plus Turki 12 Hari",
    description: "Perjalanan ibadah Umroh sekaligus menjelajah jejak sejarah Islam di Turki dengan fasilitas terbaik dan pembimbing profesional.",
    price: 32500000,
    start_date: "2025-05-15",
    end_date: "2025-05-27",
    image_url: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=80&w=800",
    capacity: 45,
    available_seats: 10,
    package_type: "Plus Turki",
    hotel_makkah: "Swissôtel Al Maqam",
    hotel_madinah: "Anwar Al Madinah",
    airlines: "Turkish Airlines",
    promo_price: 28900000,
    itinerary_pdf_url: null,
    is_active: true,
    flash_sale: true,
  },
  {
    id: "mock-2",
    created_at: new Date().toISOString(),
    title: "Umroh Reguler Syawal 9 Hari",
    description: "Nikmati kekhusyukan umroh di bulan Syawal dengan cuaca yang bersahabat dan jarak hotel dekat Masjidil Haram.",
    price: 28500000,
    start_date: "2025-06-10",
    end_date: "2025-06-19",
    image_url: "https://images.unsplash.com/photo-1565552684305-7e43f3665045?q=80&w=800",
    capacity: 45,
    available_seats: 8,
    package_type: "Reguler",
    hotel_makkah: "Pullman ZamZam",
    hotel_madinah: "Rove Madinah",
    airlines: "Saudia Airlines",
    promo_price: 24900000,
    itinerary_pdf_url: null,
    is_active: true,
    flash_sale: true,
  },
  {
    id: "mock-3",
    created_at: new Date().toISOString(),
    title: "Umroh VIP Ramadhan 15 Hari",
    description: "Pengalaman ibadah Ramadhan maksimal dengan fasilitas VIP. Rasakan malam Lailatul Qadar di Tanah Suci.",
    price: 45000000,
    start_date: "2026-03-01",
    end_date: "2026-03-15",
    image_url: "https://images.unsplash.com/photo-1519817650390-64a93db51149?q=80&w=800",
    capacity: 30,
    available_seats: 5,
    package_type: "VIP",
    hotel_makkah: "Fairmont Makkah Clock Royal",
    hotel_madinah: "The Oberoi Madinah",
    airlines: "Garuda Indonesia",
    promo_price: 39900000,
    itinerary_pdf_url: null,
    is_active: true,
    flash_sale: true,
  },
  // === REGULAR PACKAGES ===
  {
    id: "mock-4",
    created_at: new Date().toISOString(),
    title: "Umroh Plus Maroko 14 Hari",
    description: "Ibadah Umroh sekaligus mengenal peradaban Islam di Maroko – Casablanca, Fez, Marrakech dan Masjid Hassan II.",
    price: 38000000,
    start_date: "2025-07-20",
    end_date: "2025-08-03",
    image_url: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?q=80&w=800",
    capacity: 40,
    available_seats: 20,
    package_type: "Plus Maroko",
    hotel_makkah: "Hilton Suites Makkah",
    hotel_madinah: "Dar Al Taqwa",
    airlines: "Royal Air Maroc",
    promo_price: null,
    itinerary_pdf_url: null,
    is_active: true,
    flash_sale: false,
  },
  {
    id: "mock-5",
    created_at: new Date().toISOString(),
    title: "Umroh Reguler Zulhijjah 10 Hari",
    description: "Rasakan suasana ibadah yang syahdu menjelang Idul Adha di Tanah Suci bersama jamaah pilihan.",
    price: 27500000,
    start_date: "2025-06-25",
    end_date: "2025-07-05",
    image_url: "https://images.unsplash.com/photo-1564121211835-18aa715370a2?q=80&w=800",
    capacity: 50,
    available_seats: 30,
    package_type: "Reguler",
    hotel_makkah: "Mövenpick Hotel & Residences",
    hotel_madinah: "Anwar Al Madinah Mövenpick",
    airlines: "Saudia Airlines",
    promo_price: null,
    itinerary_pdf_url: null,
    is_active: true,
    flash_sale: false,
  },
  {
    id: "mock-6",
    created_at: new Date().toISOString(),
    title: "Umroh Plus Mesir & Aqsa 16 Hari",
    description: "Perpaduan sempurna antara ibadah Umroh, wisata sejarah Mesir, dan kunjungan ke Masjidil Aqsa Palestina.",
    price: 42000000,
    start_date: "2025-08-10",
    end_date: "2025-08-26",
    image_url: "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?q=80&w=800",
    capacity: 35,
    available_seats: 15,
    package_type: "Plus Aqsa",
    hotel_makkah: "Swissôtel Al Maqam",
    hotel_madinah: "Pullman Zamzam Madinah",
    airlines: "Egyptair",
    promo_price: null,
    itinerary_pdf_url: null,
    is_active: true,
    flash_sale: false,
  },
  {
    id: "mock-7",
    created_at: new Date().toISOString(),
    title: "Umroh Plus Dubai 11 Hari",
    description: "Ibadah Umroh khusyuk dengan bonus eksplor kemewahan Dubai – Burj Khalifa, Dubai Mall, Desert Safari, dan lebih banyak lagi.",
    price: 34500000,
    start_date: "2025-09-05",
    end_date: "2025-09-16",
    image_url: "https://images.unsplash.com/photo-1563170351-be54be74c4e5?q=80&w=800",
    capacity: 40,
    available_seats: 22,
    package_type: "Plus Dubai",
    hotel_makkah: "Conrad Makkah",
    hotel_madinah: "Hilton Madinah",
    airlines: "Emirates",
    promo_price: null,
    itinerary_pdf_url: null,
    is_active: true,
    flash_sale: false,
  },
  {
    id: "mock-8",
    created_at: new Date().toISOString(),
    title: "Umroh Plus Uzbekistan 13 Hari",
    description: "Jelajahi kota-kota bersejarah Islam di Uzbekistan – Samarkand & Bukhara – sebelum beribadah Umroh di Tanah Suci.",
    price: 36500000,
    start_date: "2025-10-01",
    end_date: "2025-10-14",
    image_url: "https://images.unsplash.com/photo-1623421736903-b4083b4aed32?q=80&w=800",
    capacity: 35,
    available_seats: 18,
    package_type: "Plus Uzbekistan",
    hotel_makkah: "Al Safwah Royale Orchid",
    hotel_madinah: "Saraya Taba Hotel",
    airlines: "Uzbekistan Airways",
    promo_price: null,
    itinerary_pdf_url: null,
    is_active: true,
    flash_sale: false,
  },
  {
    id: "mock-9",
    created_at: new Date().toISOString(),
    title: "Haji Khusus ONH Plus 2026",
    description: "Wujudkan impian Haji Mabrur dengan fasilitas premium, bimbingan ustadz profesional, dan akomodasi bintang 5 terdekat ke Masjidil Haram.",
    price: 185000000,
    start_date: "2026-05-20",
    end_date: "2026-06-25",
    image_url: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=80&w=800",
    capacity: 25,
    available_seats: 10,
    package_type: "Haji Khusus",
    hotel_makkah: "Fairmont Makkah Clock Royal",
    hotel_madinah: "The Oberoi Madinah",
    airlines: "Garuda Indonesia",
    promo_price: null,
    itinerary_pdf_url: null,
    is_active: true,
    flash_sale: false,
  },
  {
    id: "mock-10",
    created_at: new Date().toISOString(),
    title: "Umroh Keluarga Hemat 9 Hari",
    description: "Paket spesial keluarga dengan harga terjangkau namun tetap nyaman. Cocok untuk parents + anak-anak pertama kalinya ke Tanah Suci.",
    price: 24500000,
    start_date: "2025-11-15",
    end_date: "2025-11-24",
    image_url: "https://images.unsplash.com/photo-1519817650390-64a93db51149?q=80&w=800",
    capacity: 60,
    available_seats: 35,
    package_type: "Keluarga",
    hotel_makkah: "Al Kiswah Towers",
    hotel_madinah: "Saja Al Madinah Hotel",
    airlines: "Lion Air / Batik Air",
    promo_price: null,
    itinerary_pdf_url: null,
    is_active: true,
    flash_sale: false,
  },
  {
    id: "mock-11",
    created_at: new Date().toISOString(),
    title: "Umroh Backpacker Budget 8 Hari",
    description: "Umroh dengan budget terjangkau tanpa mengorbankan kekhusyukan ibadah. Pilihan tepat untuk generasi muda yang ingin ke Tanah Suci.",
    price: 19900000,
    start_date: "2025-12-05",
    end_date: "2025-12-13",
    image_url: "https://images.unsplash.com/photo-1565552684305-7e43f3665045?q=80&w=800",
    capacity: 50,
    available_seats: 40,
    package_type: "Budget",
    hotel_makkah: "Grand Makkah Hotel",
    hotel_madinah: "Shaza Madinah",
    airlines: "Air Asia",
    promo_price: null,
    itinerary_pdf_url: null,
    is_active: true,
    flash_sale: false,
  },
  {
    id: "mock-12",
    created_at: new Date().toISOString(),
    title: "Umroh Plus Eropa Islam 18 Hari",
    description: "Napak tilas jejak Islam di Eropa – Granada Spanyol, Cordoba, Istanbul Turki – sebelum menyempurnakan ibadah Umroh di Tanah Haram.",
    price: 52000000,
    start_date: "2025-10-20",
    end_date: "2025-11-07",
    image_url: "https://images.unsplash.com/photo-1527668752968-14dc70a27c95?q=80&w=800",
    capacity: 30,
    available_seats: 12,
    package_type: "Plus Eropa",
    hotel_makkah: "Swissôtel Al Maqam",
    hotel_madinah: "InterContinental Madinah",
    airlines: "Turkish Airlines",
    promo_price: null,
    itinerary_pdf_url: null,
    is_active: true,
    flash_sale: false,
  },
];


export default async function Home() {
  let packagesData = null;
  let fetchError = null;
  let ustadzData: any[] = DEFAULT_USTADZ;

  try {
    const { data: packages, error } = await publicSupabase
      .from("packages")
      .select("*")
      .eq("is_active", true)
      .order("start_date", { ascending: true })
      .limit(12);

    if (error) throw error;
    packagesData = packages;
  } catch (err) {
    // Silently fallback to mock data since env vars are placeholders
    packagesData = MOCK_PACKAGES;
  }

  const flashSalePackages = (packagesData || []).filter((p: any) => p.flash_sale || p.promo_price);

  try {
    const { data: ustadz, error } = await publicSupabase
      .from("ustadz")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (!error && ustadz && ustadz.length > 0) {
      ustadzData = ustadz;
    }
  } catch (err) {
    // fallback to default ustadz
  }


  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-black">
          <iframe
            src="https://www.youtube.com/embed/a3MeLj37S8w?autoplay=1&mute=1&loop=1&playlist=a3MeLj37S8w&controls=0&showinfo=0&rel=0&modestbranding=1"
            title="Jawara Wisata Hero Video"
            className="w-[100vw] h-[56.25vw] min-h-[100vh] min-w-[177.77vh] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <div className="container mx-auto relative z-10 px-4 text-center mt-20">
          <div className="animate-fade-in-up space-y-8 max-w-5xl mx-auto">
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-white tracking-tight leading-tight drop-shadow-2xl">
              Travel Haji, Umroh dan <br />
              Halal Tours
            </h1>
            <p className="text-lg md:text-xl text-white/90 font-light max-w-3xl mx-auto leading-relaxed italic opacity-90">
              "Ikutkanlah umroh kepada haji, karena keduanya menghilangkan kemiskinan dan dosa-dosa sebagaimana pembakaran menghilangkan karat pada besi, emas, dan perak. Sementara tidak ada pahala bagi haji yang mabrur kecuali surga." (HR. An Nasai, Tirmidzi dan Ahmad)
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Link href="/contact">
                <Button size="lg" className="bg-[#d4a017] hover:bg-[#b88a10] text-white text-lg px-10 py-7 rounded-full shadow-xl transition-all hover:scale-105 hover:shadow-2xl font-bold">
                  Konsultasi Gratis
                </Button>
              </Link>
              <Link href="/packages">
                <Button variant="ghost" size="lg" className="text-white hover:text-[#d4a017] hover:bg-white/10 text-lg px-8 py-7 rounded-full transition-all flex items-center gap-2 group">
                  Lihat Paket <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Certifications Section */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 text-center">
          <div className="flex flex-col items-center gap-4 mb-10">
            <div className="flex items-center gap-1 text-[#d4a017]">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="h-6 w-6 fill-current" />
              ))}
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Kami telah dipercaya melayani para jamaah sejak tahun 2012 dan memiliki izin resmi PIHK (Penyelenggara Ibadah Haji Khusus) NO.394 TAHUN 2021, izin resmi PPIU (Penyelenggara Perjalanan Ibadah Umroh) NO U. 533 TAHUN 2020.
            </p>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-80 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Replace with actual logo images */}
            <div className="h-12 w-auto relative aspect-[3/1] min-w-[120px]">
              <span className="text-xl font-bold text-gray-400">AMPHURI</span>
            </div>
            <div className="h-12 w-auto relative aspect-[3/1] min-w-[120px]">
              <span className="text-xl font-bold text-gray-400">KAN</span>
            </div>
            <div className="h-12 w-auto relative aspect-[3/1] min-w-[120px]">
              <span className="text-xl font-bold text-gray-400">IATA</span>
            </div>
            <div className="h-12 w-auto relative aspect-[3/1] min-w-[120px]">
              <span className="text-xl font-bold text-gray-400">GARUDA</span>
            </div>
            <div className="h-12 w-auto relative aspect-[3/1] min-w-[120px]">
              <span className="text-xl font-bold text-gray-400">SAUDIA</span>
            </div>
          </div>
        </div>
      </section>

      {/* Services Bento Grid */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">Berbagai Layanan di Satu Tempat</h2>
            <p className="text-muted-foreground text-lg">Ingin ibadah, jelajah dunia atau nabung dulu? Semua ada di <span className="font-bold text-primary">Jawara Wisata</span>.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[300px]">
            {/* Haji - Large Card */}
            <div className="lg:col-span-2 group relative overflow-hidden rounded-3xl cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500">
              <Image
                src="https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=80&w=1200"
                alt="Haji"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-8 text-white">
                <h3 className="font-bold text-3xl mb-2">Haji</h3>
                <p className="text-white/80 max-w-md transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                  Sempurnakan rukun Islam dengan waktu tunggu lebih cepat hingga tanpa antri.
                </p>
              </div>
            </div>

            {/* Umroh */}
            <div className="group relative overflow-hidden rounded-3xl cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500">
              <Image
                src="https://images.unsplash.com/photo-1519817650390-64a93db51149?q=80&w=800"
                alt="Umroh"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-8 text-white">
                <h3 className="font-bold text-2xl mb-2">Umroh</h3>
                <p className="text-sm text-white/80 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  Dapatkan ketenangan hati dari ibadah umroh di Tanah Suci.
                </p>
              </div>
            </div>

            {/* Jelajah Dunia */}
            <div className="group relative overflow-hidden rounded-3xl cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500">
              <Image
                src="https://images.unsplash.com/photo-1527668752968-14dc70a27c95?q=80&w=800" // Turkey/Cordoba
                alt="Jelajah Dunia"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-8 text-white">
                <h3 className="font-bold text-2xl mb-2">Jelajah Dunia</h3>
                <p className="text-sm text-white/80 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  Jelajahi keagungan peradaban Islam di berbagai belahan dunia.
                </p>
              </div>
            </div>

            {/* Badal Haji */}
            <div className="group relative overflow-hidden rounded-3xl cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500">
              <Image
                src="https://images.unsplash.com/photo-1565552684305-7e43f3665045?q=80&w=800"
                alt="Badal Haji"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-8 text-white">
                <h3 className="font-bold text-2xl mb-2">Badal Haji</h3>
                <p className="text-sm text-white/80 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  Bantu sempurnakan rukun islam orang terkasih.
                </p>
              </div>
            </div>

            {/* Badal Umroh & Tabungan Split */}
            <div className="lg:col-span-1 grid grid-rows-2 gap-6">
              <div className="group relative overflow-hidden rounded-3xl cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 bg-emerald-900 border border-emerald-800">
                <div className="absolute inset-0 flex items-center justify-center">
                  <HeartHandshake className="w-16 h-16 text-emerald-500/20 group-hover:text-emerald-500/40 transition-colors" />
                </div>
                <div className="absolute bottom-0 left-0 p-6">
                  <h3 className="font-bold text-xl text-white mb-1">Badal Umroh</h3>
                  <p className="text-xs text-white/60">Hadiahkan umroh untuk yang telah tiada.</p>
                </div>
              </div>
              <div className="group relative overflow-hidden rounded-3xl cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 bg-[#d4a017] border border-[#b88a10]">
                <div className="absolute inset-0 flex items-center justify-center">
                  <BookOpen className="w-16 h-16 text-white/20 group-hover:text-white/40 transition-colors" />
                </div>
                <div className="absolute bottom-0 left-0 p-6">
                  <h3 className="font-bold text-xl text-white mb-1">Tabungan Umroh</h3>
                  <p className="text-xs text-white/80">Rencanakan ibadahmu mulai hari ini.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ===== FLASH SALE SECTION ===== */}
      {flashSalePackages.length > 0 && (
        <section className="py-16 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #1a0a00 0%, #3d1500 40%, #6b2600 70%, #d4a017 100%)" }}>
          {/* Islamic Mozaik Pattern Overlay */}
          <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.3 }}>
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="islamicMozaik" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                  {/* Islamic 8-pointed star tile */}
                  <g fill="none" stroke="#d4a017" strokeWidth="0.8">
                    {/* Outer square */}
                    <rect x="2" y="2" width="76" height="76" />
                    {/* Inner rotated square (diamond) */}
                    <polygon points="40,2 78,40 40,78 2,40" />
                    {/* 8-pointed star */}
                    <polygon points="40,8 47,26 65,19 58,37 76,40 58,43 65,61 47,54 40,72 33,54 15,61 22,43 4,40 22,37 15,19 33,26" />
                    {/* Inner octagon */}
                    <polygon points="40,20 52,28 60,40 52,52 40,60 28,52 20,40 28,28" />
                    {/* Center cross lines */}
                    <line x1="40" y1="2" x2="40" y2="78" />
                    <line x1="2" y1="40" x2="78" y2="40" />
                    <line x1="2" y1="2" x2="78" y2="78" />
                    <line x1="78" y1="2" x2="2" y2="78" />
                    {/* Corner small squares */}
                    <rect x="2" y="2" width="14" height="14" transform="rotate(45, 9, 9)" />
                    <rect x="64" y="2" width="14" height="14" transform="rotate(45, 71, 9)" />
                    <rect x="2" y="64" width="14" height="14" transform="rotate(45, 9, 71)" />
                    <rect x="64" y="64" width="14" height="14" transform="rotate(45, 71, 71)" />
                    {/* Petal arcs */}
                    <path d="M40,20 Q52,26 60,40 Q52,54 40,60 Q28,54 20,40 Q28,26 40,20Z" />
                    {/* Inner diamond */}
                    <polygon points="40,30 50,40 40,50 30,40" />
                  </g>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#islamicMozaik)" />
            </svg>
          </div>

          {/* Radial glow elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full opacity-15" style={{ background: "radial-gradient(circle, #d4a017, transparent)" }} />
            <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full opacity-15" style={{ background: "radial-gradient(circle, #ff6b00, transparent)" }} />
          </div>


          <div className="container mx-auto px-4 md:px-6 relative z-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
              <div className="flex items-center gap-4">
                {/* Flash Icon */}
                <div className="flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center animate-pulse" style={{ background: "linear-gradient(135deg, #d4a017, #ff8c00)" }}>
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M13 2L4.09 12.9a1 1 0 00.79 1.6H11v7.5a.5.5 0 00.86.35L21 12.5H15V2.5a.5.5 0 00-.5-.5H13z" />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full text-black" style={{ background: "#d4a017" }}>TERBATAS</span>
                    <span className="text-xs text-white/60">Hanya tersisa beberapa seat!</span>
                  </div>
                  <h2 className="font-serif text-3xl md:text-4xl font-bold text-white">⚡ Flash Sale Spesial</h2>
                  <p className="text-white/70 text-sm mt-1">Harga terbaik untuk ibadah terbaik — jangan sampai ketinggalan!</p>
                </div>
              </div>
              {/* Countdown Timer */}
              <FlashSaleCountdown />
            </div>

            {/* Flash Sale Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {flashSalePackages.slice(0, 3).map((pkg: any) => {
                const discount = pkg.promo_price
                  ? Math.round(((pkg.price - pkg.promo_price) / pkg.price) * 100)
                  : 0;
                return (
                  <Link key={pkg.id} href={`/packages/${pkg.id}`} className="group block">
                    <div className="relative rounded-2xl overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20 hover:border-[#d4a017]/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                      {/* Image */}
                      <div className="relative aspect-[16/9] overflow-hidden">
                        {pkg.image_url && (
                          <Image
                            src={pkg.image_url}
                            alt={pkg.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        {/* Discount Badge */}
                        {discount > 0 && (
                          <div className="absolute top-3 left-3 px-3 py-1 rounded-xl text-sm font-black text-white" style={{ background: "linear-gradient(135deg, #d4a017, #ff6b00)" }}>
                            HEMAT {discount}%
                          </div>
                        )}
                        <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full animate-pulse">
                          <span className="w-1.5 h-1.5 bg-white rounded-full" />
                          FLASH SALE
                        </div>
                        <div className="absolute bottom-3 left-3 right-3">
                          <h3 className="font-bold text-white text-base leading-tight line-clamp-2">{pkg.title}</h3>
                        </div>
                      </div>
                      {/* Price Info */}
                      <div className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            {pkg.promo_price && (
                              <p className="text-white/50 text-xs line-through">
                                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(pkg.price)}
                              </p>
                            )}
                            <p className="text-[#d4a017] font-black text-xl">
                              {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(pkg.promo_price || pkg.price)}
                            </p>
                          </div>
                          <div className="flex items-center gap-1.5 text-white/60 text-xs">
                            <Users className="w-3.5 h-3.5" />
                            <span>{pkg.available_seats} seat</span>
                          </div>
                        </div>
                        <div className="mt-3 w-full py-2.5 rounded-xl text-center text-sm font-bold text-white transition-all group-hover:brightness-110" style={{ background: "linear-gradient(135deg, #d4a017, #b88a10)" }}>
                          Pesan Sekarang ⚡
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ===== ALL PACKAGES SECTION ===== */}
      <section className="py-24 bg-stone-50 border-t border-gray-100">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">Paket Pilihan Kami</h2>
              <p className="text-muted-foreground text-lg">Hadirkan kenyamanan beribadah dengan fasilitas terbaik dari Jawara Wisata.</p>
            </div>
            <Link href="/packages" className="hidden md:flex items-center gap-2 text-[#d4a017] font-bold hover:underline">
              Lihat Semua Paket <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {packagesData && packagesData.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {packagesData.map((pkg: any) => (
                <PackageCard key={pkg.id} pkg={pkg} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
              <p className="text-muted-foreground">Belum ada paket yang tersedia saat ini.</p>
            </div>
          )}

          <div className="mt-10 text-center">
            <Link href="/packages">
              <Button variant="outline" className="text-[#d4a017] border-[#d4a017] hover:bg-[#d4a017] hover:text-white rounded-full px-10 py-6 text-base font-bold">
                Lihat Semua Paket <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Visi Misi Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="p-8 bg-stone-50 rounded-3xl h-full flex flex-col justify-center">
              <h2 className="font-serif text-4xl font-bold mb-6">Visi</h2>
              <p className="text-xl text-muted-foreground italic leading-relaxed">
                "Menjadi biro haji, umroh, islamic dan halal tours terbesar di Indonesia dengan pelayanan prima."
              </p>
              <div className="flex gap-4 mt-8 opacity-20">
                <div className="w-12 h-32 bg-[#d4a017] rounded-full" />
                <div className="w-12 h-48 bg-[#d4a017] rounded-full" />
                <div className="w-12 h-64 bg-[#d4a017] rounded-full" />
                <div className="w-12 h-40 bg-[#d4a017] rounded-full" />
              </div>
            </div>
            <div className="p-8 bg-stone-50 rounded-3xl h-full">
              <h2 className="font-serif text-4xl font-bold mb-8">Misi</h2>
              <div className="space-y-6">
                {[
                  "Membangun hubungan interpersonal yang bersifat kekeluargaan dengan jamaah.",
                  "Terus menerus meningkatkan pelayanan haji, umrah, dan halal tours dengan sepenuh hati.",
                  "Memudahkan jamaah dalam program pembayaran biaya haji dan umrah.",
                  "Menjaga kualitas syariat dalam setiap ibadah haji khusus dan umrah.",
                  "Memberi pelayanan terbaik dengan menyediakan makanan halal dan fasilitas shalat."
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <span className="text-[#d4a017] font-bold text-xl">0{i + 1}</span>
                    <p className="text-muted-foreground">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Panduan Umroh Digital Banner */}
      <section className="py-16 bg-stone-50 border-y border-gray-100">
        <div className="container mx-auto px-4">
          <div className="rounded-3xl overflow-hidden relative" style={{ background: "linear-gradient(135deg, #0a2a1a 0%, #1a4a2a 60%, #d4a017 200%)" }}>
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="pp" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                    <g fill="none" stroke="#d4a017" strokeWidth="0.6">
                      <polygon points="30,2 56,16 56,44 30,58 4,44 4,16" />
                      <polygon points="30,13 48,23 48,37 30,47 12,37 12,23" />
                    </g>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#pp)" />
              </svg>
            </div>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 p-10 md:p-14">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-10 h-10 text-[#d4a017]" />
                </div>
                <div>
                  <span className="text-[11px] font-black uppercase tracking-widest text-[#d4a017] bg-[#d4a017]/10 border border-[#d4a017]/30 px-3 py-1 rounded-full">Gratis</span>
                  <h2 className="font-serif text-2xl md:text-3xl font-bold text-white mt-2">Panduan Umroh Digital</h2>
                  <p className="text-white/70 text-sm mt-1 max-w-md">Doa lengkap Arab & terjemah, video manasik, tata cara step-by-step, dan audio doa — semua gratis untuk Anda.</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {["📖 Doa-doa Lengkap", "🎥 Video Manasik", "📋 Tata Cara Umroh", "🎧 Audio Doa"].map((tag) => (
                      <span key={tag} className="text-xs text-white/80 bg-white/10 border border-white/20 px-2.5 py-1 rounded-full font-medium">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
              <Link href="/panduan-umroh" className="flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-white text-sm transition-all hover:scale-105 hover:shadow-xl flex-shrink-0" style={{ background: "linear-gradient(135deg, #d4a017, #b88a10)" }}>
                Buka Panduan <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Ustadz Pembimbing Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">Kenali Ustadz Pembimbing</h2>
              <p className="text-muted-foreground text-lg">Perjalanan akan jauh lebih bermakna dengan bimbingan para ustadz mumpuni</p>
            </div>
            <Link href="/about" className="hidden md:flex items-center gap-2 text-[#d4a017] font-bold hover:underline">
              Lihat Lebih Banyak <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ustadzData.map((ustadz: any, i: number) => (
              <div key={ustadz.id || i} className="group cursor-pointer">
                <div className="relative aspect-square rounded-3xl overflow-hidden mb-4 bg-gray-100 shadow-md">
                  <Image
                    src={ustadz.photo_url}
                    alt={ustadz.name}
                    fill
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                    <p className="text-white font-medium text-sm">Lihat Profil</p>
                  </div>
                </div>
                <h3 className="font-bold text-base leading-tight mb-1">{ustadz.name}</h3>
                <p className="text-muted-foreground text-sm">{ustadz.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Testimonials Section */}
      <section className="py-24 bg-stone-50">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-center mb-16">Pengalaman Nyata dari Jamaah Kami</h2>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl group cursor-pointer">
              <Image
                src="https://images.unsplash.com/photo-1549231482-66a7b7381ddf?q=80&w=1200"
                alt="Video Thumbnail"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/40 transition-colors">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white transition-transform group-hover:scale-110">
                  <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[20px] border-l-white border-b-[10px] border-b-transparent ml-1" />
                </div>
              </div>
            </div>

            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-lg border border-gray-100">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-[#d4a017] rounded-lg flex items-center justify-center">
                  <span className="text-white font-serif font-bold text-xl">J</span>
                </div>
                <div>
                  <h4 className="font-bold text-lg">Jamaah Jawara Wisata</h4>
                  <p className="text-sm text-muted-foreground">Program Tabungan Umroh</p>
                </div>
              </div>
              <blockquote className="text-xl leading-relaxed text-muted-foreground mb-8">
                "Program tabungan umroh di Jawara Wisata sangat membantu mewujudkan keinginan saya berkunjung lagi ke Tanah Suci. Saya dibantu dalam merincikan durasi dan kebutuhan tabungan tiap bulannya dan alhamdulillah dalam kurun waktu 3 tahun saya dapat berangkat umroh bersama."
              </blockquote>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden relative">
                  <Image
                    src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200"
                    alt="User"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h5 className="font-bold">Annisa Khusni Isnaini</h5>
                  <p className="text-xs text-muted-foreground">Data Analyst Actuary</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Articles Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="font-serif text-4xl font-bold mb-4">Artikel</h2>
              <p className="text-muted-foreground text-lg">Dapatkan keilmuan tentang Islam hingga tips traveling di sini.</p>
            </div>
            <Link href="/articles" className="text-[#d4a017] font-bold hover:underline flex items-center gap-2">
              Baca artikel lainnya <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="group cursor-pointer">
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden mb-6">
                  <Image
                    src={`https://images.unsplash.com/photo-${i === 1 ? '1542816417-0983c9c9ad53' : i === 2 ? '1519817650390-64a93db51149' : '1564121211835-18aa715370a2'}?q=80&w=800`}
                    alt="Article"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-1 rounded-full text-xs font-bold text-primary">
                    Tips Umroh
                  </div>
                </div>
                <h3 className="font-bold text-xl mb-3 leading-snug group-hover:text-[#d4a017] transition-colors">
                  {i === 1 ? "Persiapan Penting Sebelum Berangkat Umroh Pertama Kali" : i === 2 ? "Keutamaan Shalat di Masjidil Haram yang Perlu Anda Tahu" : "Histori dan Makna Tempat-Tempat Bersejarah di Mekkah"}
                </h3>
                <p className="text-muted-foreground line-clamp-2">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>



    </div>
  );
}
