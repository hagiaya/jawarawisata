import Image from "next/image";
import { CheckCircle2, ShieldCheck, Award, MapPin, Play, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata = {
    title: "Tentang Kami | Jawara Wisata",
    description: "Company Profile Jawara Wisata - Penyelenggara Perjalanan Ibadah Umroh dan Haji Khusus Terpercaya",
};

export default function AboutPage() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* 1. HERO & TENTANG PERUSAHAAN */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="https://images.unsplash.com/photo-1564121211835-18aa715370a2?q=80&w=1920"
                        alt="Kaaba Makkah"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-black/60" />
                </div>
                <div className="relative z-10 container mx-auto px-4 text-center mt-12">
                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 animate-fade-in-up">
                        Tentang Jawara Wisata
                    </h1>
                    <p className="text-xl text-white/90 max-w-3xl mx-auto italic font-light animate-fade-in-up delay-100">
                        Penyelenggara Perjalanan Ibadah Umroh (PPIU) dan Haji Khusus yang berdedikasi tinggi untuk melayani tamu Allah.
                    </p>
                </div>
            </section>

            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="relative aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
                            <Image
                                src="https://images.unsplash.com/photo-1565552684305-7e43f3665045?q=80&w=1000"
                                alt="Kantor Pusat Jawara Wisata"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="space-y-6">
                            <h2 className="text-sm font-bold tracking-widest uppercase text-[#d4a017]">Siapa Kami</h2>
                            <h3 className="font-serif text-3xl md:text-4xl font-bold leading-tight">
                                Menjadi Pendamping Terbaik Perjalanan Suci Anda
                            </h3>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                Jawara Wisata didirikan dengan niat tulus untuk memfasilitasi umat Islam di Indonesia dalam menunaikan ibadah umroh dan haji. Kami memahami bahwa perjalanan ke Tanah Suci adalah impian setiap muslim, oleh karena itu kami menjanjikan pelayanan sepenuh hati sejak dari Tanah Air hingga kembali lagi.
                            </p>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                Berbekal pengalaman bertahun-tahun, kami tidak hanya menawarkan paket wisata religi, namun juga pengalaman spiritual mendalam bersama mutawwif dan asatidz profesional.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. LEGALITAS & SERTIFIKAT */}
            <section className="py-20 bg-stone-50 border-y border-stone-200">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16 max-w-2xl mx-auto">
                        <ShieldCheck className="w-16 h-16 text-[#d4a017] mx-auto mb-6" />
                        <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">Legalitas & Sertifikasi Resmi</h2>
                        <p className="text-muted-foreground text-lg">Keamanan dan kenyamanan Anda terjamin karena Jawara Wisata telah memiliki legalitas lengkap dari instansi berwenang.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 text-center max-w-4xl mx-auto">
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100/50 hover:shadow-lg transition-all">
                            <h3 className="text-xl font-bold mb-3 text-emerald-900">Izin PPIU Kemenag</h3>
                            <p className="text-[#d4a017] font-mono text-lg font-semibold mb-3">NO. U. 533 TAHUN 2020</p>
                            <p className="text-sm text-muted-foreground">Penyelenggara Perjalanan Ibadah Umroh Izin Kementerian Agama Republik Indonesia.</p>
                        </div>
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100/50 hover:shadow-lg transition-all">
                            <h3 className="text-xl font-bold mb-3 text-emerald-900">Izin PIHK</h3>
                            <p className="text-[#d4a017] font-mono text-lg font-semibold mb-3">NO. 394 TAHUN 2021</p>
                            <p className="text-sm text-muted-foreground">Penyelenggara Ibadah Haji Khusus terdaftar resmi.</p>
                        </div>
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100/50 hover:shadow-lg transition-all">
                            <h3 className="text-xl font-bold mb-3 text-emerald-900">Anggota AMPHURI</h3>
                            <p className="text-[#d4a017] font-mono text-lg font-semibold mb-3">A.0982 / 2021</p>
                            <p className="text-sm text-muted-foreground">Asosiasi Muslim Penyelenggara Haji dan Umrah Republik Indonesia.</p>
                        </div>
                    </div>

                    <div className="mt-12 flex flex-wrap justify-center items-center gap-12 opacity-70">
                        {/* Placeholder for real certificate icons/logos */}
                        <div className="flex items-center gap-2 font-bold text-xl text-stone-400"><Award className="w-8 h-8" /> KAN</div>
                        <div className="flex items-center gap-2 font-bold text-xl text-stone-400"><Award className="w-8 h-8" /> IATA</div>
                        <div className="flex items-center gap-2 font-bold text-xl text-stone-400"><Award className="w-8 h-8" /> ASITA</div>
                    </div>
                </div>
            </section>

            {/* 3. VISI MISI */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-12 items-stretch">
                        <div className="p-10 lg:p-14 bg-emerald-900 text-white rounded-[2rem] h-full flex flex-col justify-center relative overflow-hidden shadow-2xl">
                            {/* Decorative background circle */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-800 rounded-full blur-3xl opacity-50 transform translate-x-1/2 -translate-y-1/2" />

                            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6 text-[#d4a017] relative z-10">Visi Kami</h2>
                            <p className="text-xl md:text-2xl leading-relaxed italic font-light relative z-10 text-white/90">
                                "Menjadi penyelenggara haji, umroh, islamic dan halal tours terbesar di Indonesia dengan memberikan pelayanan prima berlandaskan syariat demi mencapai kemabruran tamu-tamu Allah."
                            </p>
                        </div>

                        <div className="p-10 lg:p-14 bg-stone-50 rounded-[2rem] border border-stone-100 h-full shadow-lg">
                            <h2 className="font-serif text-4xl font-bold mb-8">Misi Kami</h2>
                            <div className="space-y-6">
                                {[
                                    "Membangun hubungan interpersonal yang bersifat kekeluargaan dengan jamaah.",
                                    "Terus menerus meningkatkan kualitas pelayanan haji, umrah, dan halal tours sesuai tata cara sunnah Rasulullah SAW.",
                                    "Memudahkan dan mendampingi jamaah dalam program perencanaan keberangkatan ibadah.",
                                    "Memberikan fasilitas terbaik (akomodasi, konsumsi, dan transportasi) selama di Tanah Suci."
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-5 items-start">
                                        <div className="w-10 h-10 rounded-full bg-[#d4a017]/10 flex-shrink-0 flex items-center justify-center text-[#d4a017] font-bold mt-1">
                                            {i + 1}
                                        </div>
                                        <p className="text-lg text-muted-foreground leading-relaxed">{item}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. GALERI FOTO & VIDEO KEBERANGKATAN */}
            <section className="py-24 bg-black text-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16 max-w-2xl mx-auto">
                        <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4 text-[#d4a017]">Galeri Keberangkatan</h2>
                        <p className="text-white/70 text-lg">Momen indah nan syahdu bersama ribuan jamaah Jawara Wisata yang telah merindukan Baitullah.</p>
                    </div>

                    {/* Video Highlight */}
                    <div className="relative aspect-video max-w-4xl mx-auto rounded-3xl overflow-hidden mb-12 group cursor-pointer border border-[#d4a017]/20">
                        <Image
                            src="https://images.unsplash.com/photo-1549231482-66a7b7381ddf?q=80&w=1200"
                            alt="Video Thumbnail"
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-80"
                        />
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                            <div className="bg-[#d4a017] text-white p-5 rounded-full shadow-2xl scale-100 group-hover:scale-110 transition-transform">
                                <Play className="w-10 h-10 fill-current" />
                            </div>
                        </div>
                        <div className="absolute bottom-6 left-6 right-6">
                            <h3 className="text-2xl font-bold text-white mb-2 shadow-black/50 drop-shadow-md">Dokumenter Perjalanan Spesial Ramadhan 2023</h3>
                            <p className="text-white/80 shadow-black/50 drop-shadow-sm">Makkah - Madinah</p>
                        </div>
                    </div>

                    {/* Photo Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            "1542816417-0983c9c9ad53",
                            "1519817650390-64a93db51149",
                            "1564121211835-18aa715370a2",
                            "1565552684305-7e43f3665045"
                        ].map((id, index) => (
                            <div key={index} className="relative aspect-square rounded-xl overflow-hidden group">
                                <Image
                                    src={`https://images.unsplash.com/photo-${id}?q=80&w=600&auto=format&fit=crop`}
                                    alt={`Galeri ${index + 1}`}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100 grayscale group-hover:grayscale-0"
                                />
                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform">
                                    <p className="text-sm font-medium">Jamaah Grup Umroh {index + 1}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. TESTIMONI JAMAAH */}
            <section className="py-24 bg-stone-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">Suara Hati Jamaah</h2>
                        <p className="text-muted-foreground text-lg">Mereka yang telah membuktikan langsung layanan Jawara Wisata.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                name: "Bpk. H. Ahmad Rasyid",
                                type: "Paket Plus Turki 12 Hari",
                                body: "Alhamdulillah pelayanan Jawara Wisata sangat memuaskan. Mulai dari pendaftaran, pembekalan (manasik), keberangkatan, sampai kepulangan semua diatur sangat rapi. Mutawwif nya luar biasa penyabar."
                            },
                            {
                                name: "Ibu Hj. Siti Maemunah",
                                type: "Paket VIP Ramadhan",
                                body: "Saya dan suami sangat terkesan dengan hotel yang jaraknya hanya beberapa langkah dari pelataran Masjid Nabawi dan Masjidil Haram. Sangat memudahkan kami yang sudah lanjut usia untuk ibadah lima waktu."
                            },
                            {
                                name: "Keluarga dr. Faisal",
                                type: "Paket Reguler Spesial Liburan",
                                body: "Pengalaman umroh pertama untuk anak-anak kami. Pendekatan ustadz pembimbing sangat cocok untuk milenial dan anak muda. Makananan juga disesuaikan cita rasa Indonesia jadi kami tidak kesulitan beradaptasi."
                            }
                        ].map((testi, i) => (
                            <div key={i} className="bg-white p-8 rounded-[2rem] shadow-sm hover:shadow-xl transition-all border border-stone-100 relative">
                                <div className="absolute -top-6 left-8 bg-[#d4a017] rounded-full p-2">
                                    <div className="bg-white rounded-full p-1.5 flex gap-1">
                                        {[1, 2, 3, 4, 5].map(star => <Star key={star} className="w-3 h-3 text-[#d4a017] fill-current" />)}
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <blockquote className="text-lg leading-relaxed text-muted-foreground mb-6 h-40 overflow-y-auto">
                                        "{testi.body}"
                                    </blockquote>
                                    <div className="border-t pt-4">
                                        <h4 className="font-bold text-lg">{testi.name}</h4>
                                        <p className="text-sm text-[#d4a017] font-medium">{testi.type}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA SECTION */}
            <section className="py-20 bg-emerald-900 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full">
                    <Image
                        src="https://images.unsplash.com/photo-1542816417-0983c9c9ad53?q=80&w=1200"
                        alt="Background Makkah"
                        fill
                        className="object-cover opacity-10 mix-blend-overlay"
                    />
                </div>
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6">Siap Memulai Perjalanan Suci?</h2>
                    <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto">
                        Jangan tunda lagi niat baik Anda. Tim Jawara Wisata siap membantu setiap kelengkapan dokumen dan kebutuhan persiapan keberangkatan Anda.
                    </p>
                    <Link href="/packages">
                        <Button size="lg" className="bg-[#d4a017] hover:bg-[#b88a10] text-white px-8 py-6 text-lg rounded-full font-bold shadow-xl hover:scale-105 transition-all">
                            Pilih Paket Sekarang
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
}
