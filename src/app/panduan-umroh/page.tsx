"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
    BookOpen, Play, Pause, Volume2, VolumeX,
    ChevronDown, Search, ArrowLeft, Headphones,
    Video, FileText, Heart, Share2, Download,
    CheckCircle2, Star, Clock
} from "lucide-react";

// ── Doa Data ─────────────────────────────────────────────
const DUAS = [
    {
        id: "niat-umroh",
        category: "Niat",
        title: "Niat Umroh",
        arabic: "لَبَّيْكَ اللَّهُمَّ عُمْرَةً",
        transliteration: "Labbayka Allāhumma 'Umratan",
        translation: "Ya Allah, aku penuhi panggilan-Mu untuk melaksanakan Umroh.",
        note: "Dibaca saat memakai ihram di miqat",
        audio: null,
    },
    {
        id: "talbiyah",
        category: "Niat",
        title: "Talbiyah",
        arabic: "لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ لَا شَرِيكَ لَكَ لَبَّيْكَ، إِنَّ الْحَمْدَ وَالنِّعْمَةَ لَكَ وَالْمُلْكَ، لَا شَرِيكَ لَكَ",
        transliteration: "Labbayk Allāhumma labbayk, labbayk lā sharīka laka labbayk, innal-ḥamda wan-ni'mata laka wal-mulk, lā sharīka lak",
        translation: "Aku datang memenuhi panggilan-Mu ya Allah, aku datang memenuhi panggilan-Mu. Tiada sekutu bagi-Mu, aku datang memenuhi panggilan-Mu. Sesungguhnya segala puji, nikmat dan kekuasaan hanya milik-Mu. Tiada sekutu bagi-Mu.",
        note: "Dibaca berulang-ulang sejak ihram hingga memulai thawaf",
        audio: null,
    },
    {
        id: "doa-masuk-masjid",
        category: "Masjid",
        title: "Doa Masuk Masjidil Haram",
        arabic: "اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ",
        transliteration: "Allāhumma iftaḥ lī abwāba raḥmatik",
        translation: "Ya Allah, bukakanlah untukku pintu-pintu rahmat-Mu.",
        note: "Dibaca saat memasuki Masjidil Haram, diawali kaki kanan",
        audio: null,
    },
    {
        id: "doa-melihat-kabah",
        category: "Thawaf",
        title: "Doa Melihat Ka'bah Pertama Kali",
        arabic: "اللَّهُمَّ زِدْ هَذَا الْبَيْتَ تَشْرِيفًا وَتَعْظِيمًا وَتَكْرِيمًا وَمَهَابَةً، وَزِدْ مَنْ شَرَّفَهُ وَكَرَّمَهُ مِمَّنْ حَجَّهُ أَوِ اعْتَمَرَهُ تَشْرِيفًا وَتَكْرِيمًا وَتَعْظِيمًا وَبِرًّا",
        transliteration: "Allāhumma zid hādhal-bayta tashrīfan wa ta'ẓīman wa takrīman wa mahābatan, wa zid man sharrafahū wa karrarahū mimman ḥajjahū awi'tamarahū tashrīfan wa takrīman wa ta'ẓīman wa birran",
        translation: "Ya Allah, tambahkanlah kemuliaan, keagungan, kehormatan, dan kewibawaan Ka'bah ini. Dan tambahkanlah kepada orang yang bermulia dan memuliakan-Nya dari orang yang berhaji atau berumroh, kemuliaan, kehormatan, keagungan, dan kebaikan.",
        note: "Dibaca pertama kali melihat Ka'bah sambil mengangkat tangan",
        audio: null,
    },
    {
        id: "doa-thawaf",
        category: "Thawaf",
        title: "Doa Thawaf (Antara Rukun Yamani & Hajar Aswad)",
        arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
        transliteration: "Rabbanā ātinā fid-dunyā ḥasanatan wa fil-ākhirati ḥasanatan wa qinā 'adhāban-nār",
        translation: "Ya Tuhan kami, berilah kami kebaikan di dunia dan kebaikan di akhirat, dan lindungilah kami dari siksa api neraka.",
        note: "Dibaca di antara Rukun Yamani hingga Hajar Aswad setiap putaran",
        audio: null,
    },
    {
        id: "doa-sai",
        category: "Sa'i",
        title: "Doa di Bukit Shafa",
        arabic: "إِنَّ الصَّفَا وَالْمَرْوَةَ مِنْ شَعَائِرِ اللَّهِ",
        transliteration: "Innaṣ-ṣafā wal-marwata min sha'ā'irillāh",
        translation: "Sesungguhnya Shafa dan Marwah adalah sebagian dari syiar-syiar (ibadah) Allah.",
        note: "Dibaca saat pertama kali naik ke bukit Shafa",
        audio: null,
    },
    {
        id: "doa-zamzam",
        category: "Zamzam",
        title: "Doa Minum Air Zamzam",
        arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا وَرِزْقًا وَاسِعًا وَشِفَاءً مِنْ كُلِّ دَاءٍ",
        transliteration: "Allāhumma innī as'aluka 'ilman nāfi'an wa rizqan wāsi'an wa shifā'an min kulli dā'",
        translation: "Ya Allah, sesungguhnya aku memohon kepada-Mu ilmu yang bermanfaat, rezeki yang luas, dan kesembuhan dari segala penyakit.",
        note: "Dibaca sambil menghadap kiblat sebelum minum air Zamzam",
        audio: null,
    },
    {
        id: "doa-tahallul",
        category: "Tahallul",
        title: "Doa Tahallul (Mencukur Rambut)",
        arabic: "اللَّهُمَّ اغْفِرْ لِلْمُحَلِّقِينَ، اللَّهُمَّ اغْفِرْ لِلْمُحَلِّقِينَ، اللَّهُمَّ اغْفِرْ لِلْمُحَلِّقِينَ وَالْمُقَصِّرِينَ",
        transliteration: "Allāhummaghfir lil-muḥalliqīn (3x) ... wal-muqaṣṣirīn",
        translation: "Ya Allah, ampunilah orang-orang yang mencukur rambutnya (3x) ... dan orang-orang yang memendekkannya.",
        note: "Dibaca saat mencukur atau memendekkan rambut sebagai tanda selesai ihram",
        audio: null,
    },
];

// ── Video Data ────────────────────────────────────────────
const VIDEOS = [
    {
        id: "v1",
        title: "Panduan Lengkap Umroh untuk Pemula",
        channel: "Jawara Wisata",
        duration: "45:12",
        views: "1.2 Jt",
        youtubeId: "dQw4w9WgXcQ",
        thumbnail: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
        category: "Panduan",
        desc: "Panduan lengkap tata cara umroh dari miqat hingga tahallul untuk para jamaah pemula.",
    },
    {
        id: "v2",
        title: "Tata Cara Thawaf yang Benar",
        channel: "Jawara Wisata",
        duration: "18:30",
        views: "856 Rb",
        youtubeId: "dQw4w9WgXcQ",
        thumbnail: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
        category: "Thawaf",
        desc: "Penjelasan detail tata cara thawaf mengelilingi Ka'bah 7 kali beserta doa-doanya.",
    },
    {
        id: "v3",
        title: "Panduan Sa'i Shafa Marwah",
        channel: "Jawara Wisata",
        duration: "12:45",
        views: "634 Rb",
        youtubeId: "dQw4w9WgXcQ",
        thumbnail: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
        category: "Sa'i",
        desc: "Cara yang benar dalam melaksanakan sa'i antara bukit Shafa dan Marwah.",
    },
    {
        id: "v4",
        title: "Niat dan Persiapan Ihram",
        channel: "Jawara Wisata",
        duration: "21:00",
        views: "920 Rb",
        youtubeId: "dQw4w9WgXcQ",
        thumbnail: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
        category: "Ihram",
        desc: "Panduan lengkap cara berihram, niat, larangan ihram, dan tata cara memakai kain ihram.",
    },
    {
        id: "v5",
        title: "Ziarah Madinah: Masjid Nabawi & Raudhah",
        channel: "Jawara Wisata",
        duration: "33:20",
        views: "1.5 Jt",
        youtubeId: "dQw4w9WgXcQ",
        thumbnail: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
        category: "Ziarah",
        desc: "Panduan ziarah ke Masjid Nabawi, Raudhah, dan tempat-tempat bersejarah di Madinah.",
    },
    {
        id: "v6",
        title: "Larangan & Hal yang Membatalkan Ihram",
        channel: "Jawara Wisata",
        duration: "15:50",
        views: "510 Rb",
        youtubeId: "dQw4w9WgXcQ",
        thumbnail: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
        category: "Ihram",
        desc: "Penjelasan lengkap larangan-larangan saat berihram dan konsekuensinya.",
    },
];

// ── Audio Doa ─────────────────────────────────────────────
const AUDIOS = [
    { id: "a1", title: "Talbiyah", reciter: "Syaikh Sudais", duration: "2:15", category: "Niat", file: null },
    { id: "a2", title: "Doa Melihat Ka'bah", reciter: "Syaikh Shuraim", duration: "1:30", category: "Thawaf", file: null },
    { id: "a3", title: "Doa Thawaf (Lengkap)", reciter: "Ustadz Ahmad Fauzi", duration: "8:45", category: "Thawaf", file: null },
    { id: "a4", title: "Doa Sa'i Shafa Marwah", reciter: "Ustadz Ahmad Fauzi", duration: "5:20", category: "Sa'i", file: null },
    { id: "a5", title: "Doa Minum Zamzam", reciter: "Syaikh Sudais", duration: "0:45", category: "Zamzam", file: null },
    { id: "a6", title: "Doa Masuk Masjidil Haram", reciter: "Syaikh Shuraim", duration: "0:55", category: "Masjid", file: null },
    { id: "a7", title: "Doa Ziarah Makam Rasulullah", reciter: "Ustadz Ahmad Fauzi", duration: "3:10", category: "Ziarah", file: null },
    { id: "a8", title: "Doa Setelah Tahallul", reciter: "Syaikh Sudais", duration: "1:05", category: "Tahallul", file: null },
];

// ── Tata Cara Steps ───────────────────────────────────────
const TATACARA = [
    {
        step: 1,
        title: "Miqat & Ihram",
        icon: "🕌",
        color: "from-green-500 to-emerald-600",
        substeps: [
            "Mandi sunnah sebelum ihram & pakai wewangian (untuk laki-laki)",
            "Shalat sunnah ihram 2 rakaat",
            "Niat umroh: لَبَّيْكَ اللَّهُمَّ عُمْرَةً",
            "Memakai kain ihram (laki-laki); pakaian muslimah (perempuan)",
            "Membaca talbiyah sebanyak-banyaknya",
            "Jaga larangan ihram hingga tahallul",
        ],
        larangan: ["Tidak boleh memakai pakaian berjahit (laki-laki)", "Tidak boleh menutup kepala (laki-laki)", "Tidak boleh memakai wewangian", "Tidak boleh berhubungan suami istri", "Tidak boleh memotong kuku & rambut"],
    },
    {
        step: 2,
        title: "Thawaf",
        icon: "🕋",
        color: "from-amber-500 to-yellow-600",
        substeps: [
            "Masuk Masjidil Haram sambil baca doa masuk masjid",
            "Menuju Hajar Aswad untuk memulai thawaf",
            "Menghadap Hajar Aswad, ucapkan 'Bismillah, Allahu Akbar'",
            "Mengelilingi Ka'bah 7 kali berlawanan arah jarum jam",
            "Ka'bah selalu di sebelah kiri selama thawaf",
            "Baca doa 'Rabbanā ātinā...' di antara Rukun Yamani & Hajar Aswad",
            "Shalat 2 rakaat di belakang Maqam Ibrahim setelah thawaf",
            "Minum air zamzam & baca doa",
        ],
        larangan: [],
    },
    {
        step: 3,
        title: "Sa'i",
        icon: "🏃",
        color: "from-blue-500 to-indigo-600",
        substeps: [
            "Menuju bukit Shafa dari dalam Masjidil Haram",
            "Naik ke bukit Shafa, menghadap Ka'bah",
            "Baca ayat: 'Innaṣ-ṣafā wal-marwata min sha'ā'irillāh'",
            "Berdoa menghadap kiblat sambil mengangkat tangan",
            "Berjalan menuju bukit Marwah (1 kali perjalanan = 1 putaran)",
            "Berlari-lari kecil (harwalah) di antara 2 tanda hijau",
            "Naik bukit Marwah, menghadap Ka'bah, berdoa",
            "Ulangi Shafa ke Marwah hingga 7 kali (berakhir di Marwah)",
        ],
        larangan: [],
    },
    {
        step: 4,
        title: "Tahallul",
        icon: "✂️",
        color: "from-purple-500 to-violet-600",
        substeps: [
            "Setelah selesai Sa'i, lakukan tahallul",
            "Laki-laki: mencukur seluruh rambut kepala (afdhal) atau memendekkan",
            "Perempuan: memotong ujung rambut sepanjang 1 ruas jari",
            "Baca doa tahallul",
            "Semua larangan ihram sudah terangkat setelah tahallul",
            "Umroh selesai — Alhamdulillah! 🤲",
        ],
        larangan: [],
    },
];

// ── Tab IDs ───────────────────────────────────────────────
type Tab = "doa" | "video" | "tatacara" | "audio";
const CATEGORIES_DOA = ["Semua", "Niat", "Thawaf", "Sa'i", "Masjid", "Zamzam", "Tahallul", "Ziarah"];
const CATEGORIES_VIDEO = ["Semua", "Panduan", "Thawaf", "Sa'i", "Ihram", "Ziarah"];
const CATEGORIES_AUDIO = ["Semua", "Niat", "Thawaf", "Sa'i", "Masjid", "Zamzam", "Ziarah", "Tahallul"];

// ── AudioCard ─────────────────────────────────────────────
function AudioCard({ audio, isPlaying, onToggle }: { audio: typeof AUDIOS[0]; isPlaying: boolean; onToggle: () => void }) {
    const catColor: Record<string, string> = {
        Niat: "bg-green-100 text-green-700",
        Thawaf: "bg-amber-100 text-amber-700",
        "Sa'i": "bg-blue-100 text-blue-700",
        Masjid: "bg-purple-100 text-purple-700",
        Zamzam: "bg-cyan-100 text-cyan-700",
        Tahallul: "bg-rose-100 text-rose-700",
        Ziarah: "bg-indigo-100 text-indigo-700",
    };
    return (
        <div className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${isPlaying ? "border-[#d4a017] bg-amber-50/50 shadow-md" : "border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm"}`}>
            <button
                onClick={onToggle}
                className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${isPlaying ? "bg-[#d4a017] text-white scale-105 shadow-lg" : "bg-gray-100 text-gray-600 hover:bg-[#d4a017] hover:text-white"}`}
            >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>
            <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-gray-900 truncate">{audio.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{audio.reciter}</p>
                {isPlaying && (
                    <div className="flex gap-1 mt-1.5 items-end h-3">
                        {[3, 5, 4, 6, 3, 5, 4, 3, 6, 4].map((h, i) => (
                            <div key={i} className="w-1 rounded-full bg-[#d4a017]"
                                style={{ height: `${h * 2}px`, animation: `pulse ${0.5 + i * 0.1}s ease-in-out infinite alternate` }} />
                        ))}
                    </div>
                )}
            </div>
            <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${catColor[audio.category] || "bg-gray-100 text-gray-600"}`}>{audio.category}</span>
                <span className="text-xs text-gray-400 font-medium flex items-center gap-1"><Clock className="w-3 h-3" />{audio.duration}</span>
            </div>
        </div>
    );
}

// ── Main Page ─────────────────────────────────────────────
export default function PanduanUmrohPage() {
    const [tab, setTab] = useState<Tab>("doa");
    const [search, setSearch] = useState("");
    const [doaCat, setDoaCat] = useState("Semua");
    const [videoCat, setVideoCat] = useState("Semua");
    const [audioCat, setAudioCat] = useState("Semua");
    const [expandedDoa, setExpandedDoa] = useState<string | null>(null);
    const [expandedStep, setExpandedStep] = useState<number | null>(1);
    const [playingAudio, setPlayingAudio] = useState<string | null>(null);
    const [playingVideo, setPlayingVideo] = useState<string | null>(null);
    const [favorites, setFavorites] = useState<Set<string>>(new Set());

    const toggleFav = (id: string) => setFavorites(prev => {
        const n = new Set(prev);
        n.has(id) ? n.delete(id) : n.add(id);
        return n;
    });

    const filteredDuas = DUAS.filter(d =>
        (doaCat === "Semua" || d.category === doaCat) &&
        (d.title.toLowerCase().includes(search.toLowerCase()) || d.translation.toLowerCase().includes(search.toLowerCase()))
    );

    const filteredVideos = VIDEOS.filter(v =>
        (videoCat === "Semua" || v.category === videoCat) &&
        v.title.toLowerCase().includes(search.toLowerCase())
    );

    const filteredAudios = AUDIOS.filter(a =>
        (audioCat === "Semua" || a.category === audioCat) &&
        a.title.toLowerCase().includes(search.toLowerCase())
    );

    const TABS = [
        { id: "doa" as Tab, label: "Doa-doa", icon: BookOpen, count: DUAS.length },
        { id: "video" as Tab, label: "Video Manasik", icon: Video, count: VIDEOS.length },
        { id: "tatacara" as Tab, label: "Tata Cara Umroh", icon: FileText, count: TATACARA.length },
        { id: "audio" as Tab, label: "Audio Doa", icon: Headphones, count: AUDIOS.length },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-amber-50/20">
            {/* ── Hero ── */}
            <div className="relative overflow-hidden py-16 px-4" style={{ background: "linear-gradient(135deg, #0a2a1a 0%, #1a4a2a 50%, #d4a017 150%)" }}>
                <div className="absolute inset-0 opacity-10">
                    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="pg" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                                <g fill="none" stroke="#d4a017" strokeWidth="0.6">
                                    <polygon points="40,4 74,22 74,58 40,76 6,58 6,22" />
                                    <polygon points="40,16 62,28 62,52 40,64 18,52 18,28" />
                                </g>
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#pg)" />
                    </svg>
                </div>
                <div className="container mx-auto max-w-4xl relative z-10 text-center">
                    <Link href="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-6 transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
                    </Link>
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 text-white/80 text-xs font-bold px-4 py-1.5 rounded-full mb-4">
                        <BookOpen className="w-3.5 h-3.5" /> Panduan Ibadah Digital
                    </div>
                    <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-3">Panduan Umroh Digital</h1>
                    <p className="text-white/70 text-lg max-w-xl mx-auto mb-8">
                        Doa lengkap, video manasik, tata cara, dan audio doa dalam satu tempat — panduan ibadah terpercaya untuk perjalanan Anda.
                    </p>
                    {/* Stats */}
                    <div className="flex flex-wrap justify-center gap-6">
                        {[
                            { label: "Doa Lengkap", val: `${DUAS.length}+` },
                            { label: "Video Manasik", val: `${VIDEOS.length}+` },
                            { label: "Audio Doa", val: `${AUDIOS.length}+` },
                            { label: "Tata Cara", val: `${TATACARA.length} Tahap` },
                        ].map((s, i) => (
                            <div key={i} className="text-center">
                                <p className="text-2xl font-black text-[#d4a017]">{s.val}</p>
                                <p className="text-xs text-white/60 font-medium">{s.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Sticky Search + Tabs ── */}
            <div className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
                <div className="container mx-auto max-w-4xl px-4 py-3">
                    {/* Search */}
                    <div className="relative mb-3">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Cari doa, video, atau panduan..."
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-[#d4a017]/30 focus:border-[#d4a017] transition-all"
                        />
                    </div>
                    {/* Tabs */}
                    <div className="flex gap-1 overflow-x-auto scrollbar-hide">
                        {TABS.map(t => {
                            const Icon = t.icon;
                            return (
                                <button
                                    key={t.id}
                                    onClick={() => { setTab(t.id); setSearch(""); }}
                                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex-shrink-0 ${tab === t.id
                                            ? "bg-[#d4a017] text-white shadow-md"
                                            : "text-gray-600 hover:bg-gray-100"
                                        }`}
                                >
                                    <Icon className="w-3.5 h-3.5" />
                                    {t.label}
                                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${tab === t.id ? "bg-white/20 text-white" : "bg-gray-200 text-gray-500"}`}>
                                        {t.count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* ── Content ── */}
            <div className="container mx-auto max-w-4xl px-4 py-8">

                {/* ══ TAB: DOA-DOA ══ */}
                {tab === "doa" && (
                    <div>
                        {/* Category filter */}
                        <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-6">
                            {CATEGORIES_DOA.map(c => (
                                <button key={c} onClick={() => setDoaCat(c)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex-shrink-0 border ${doaCat === c ? "bg-[#1a4a2a] text-white border-[#1a4a2a]" : "text-gray-600 border-gray-200 hover:border-[#d4a017]"}`}>
                                    {c}
                                </button>
                            ))}
                        </div>
                        <div className="space-y-3">
                            {filteredDuas.length === 0 && (
                                <div className="text-center py-16 text-gray-400">
                                    <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                    <p className="font-semibold">Tidak ada doa ditemukan</p>
                                </div>
                            )}
                            {filteredDuas.map(d => (
                                <div key={d.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                    <button
                                        onClick={() => setExpandedDoa(expandedDoa === d.id ? null : d.id)}
                                        className="w-full flex items-center gap-4 p-5 text-left hover:bg-gray-50/50 transition-colors"
                                    >
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">{d.category}</span>
                                            </div>
                                            <p className="font-bold text-gray-900">{d.title}</p>
                                            <p className="text-xs text-gray-500 mt-0.5 line-clamp-1 font-arabic text-right" dir="rtl">{d.arabic.slice(0, 40)}...</p>
                                        </div>
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            <button onClick={e => { e.stopPropagation(); toggleFav(d.id); }}
                                                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${favorites.has(d.id) ? "bg-rose-100 text-rose-500" : "bg-gray-100 text-gray-400 hover:text-rose-400"}`}>
                                                <Heart className={`w-4 h-4 ${favorites.has(d.id) ? "fill-current" : ""}`} />
                                            </button>
                                            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${expandedDoa === d.id ? "rotate-180" : ""}`} />
                                        </div>
                                    </button>
                                    {expandedDoa === d.id && (
                                        <div className="border-t border-gray-100 p-5 space-y-4">
                                            {/* Arabic */}
                                            <div className="bg-gradient-to-br from-emerald-50 to-amber-50/30 rounded-xl p-5 border border-emerald-100">
                                                <p className="text-2xl font-bold text-gray-900 leading-loose text-right font-arabic" dir="rtl" style={{ fontFamily: "'Traditional Arabic', 'Amiri', serif", lineHeight: 2.2 }}>
                                                    {d.arabic}
                                                </p>
                                            </div>
                                            {/* Transliterasi */}
                                            <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                                                <p className="text-[10px] text-amber-600 font-black uppercase tracking-widest mb-1">Transliterasi</p>
                                                <p className="text-sm text-amber-900 font-medium italic leading-relaxed">{d.transliteration}</p>
                                            </div>
                                            {/* Terjemah */}
                                            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                                                <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest mb-1">Terjemahan</p>
                                                <p className="text-sm text-blue-900 leading-relaxed">{d.translation}</p>
                                            </div>
                                            {/* Keterangan */}
                                            {d.note && (
                                                <div className="flex items-start gap-2 text-xs text-gray-500 bg-gray-50 rounded-xl p-3 border border-gray-100">
                                                    <span className="text-base">💡</span>
                                                    <span>{d.note}</span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ══ TAB: VIDEO MANASIK ══ */}
                {tab === "video" && (
                    <div>
                        <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-6">
                            {CATEGORIES_VIDEO.map(c => (
                                <button key={c} onClick={() => setVideoCat(c)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex-shrink-0 border ${videoCat === c ? "bg-[#1a4a2a] text-white border-[#1a4a2a]" : "text-gray-600 border-gray-200 hover:border-[#d4a017]"}`}>
                                    {c}
                                </button>
                            ))}
                        </div>

                        {playingVideo && (
                            <div className="mb-6 rounded-2xl overflow-hidden shadow-xl border border-gray-200">
                                <div className="relative aspect-video bg-black">
                                    <iframe
                                        src={`https://www.youtube.com/embed/${VIDEOS.find(v => v.id === playingVideo)?.youtubeId}?autoplay=1&rel=0`}
                                        allow="autoplay; encrypted-media"
                                        allowFullScreen
                                        className="absolute inset-0 w-full h-full"
                                    />
                                </div>
                                <div className="p-4 bg-white flex items-center justify-between">
                                    <div>
                                        <p className="font-bold text-gray-900 text-sm">{VIDEOS.find(v => v.id === playingVideo)?.title}</p>
                                        <p className="text-xs text-gray-500 mt-0.5">{VIDEOS.find(v => v.id === playingVideo)?.channel}</p>
                                    </div>
                                    <button onClick={() => setPlayingVideo(null)} className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 text-xs font-bold hover:bg-gray-200 transition-colors flex items-center gap-1">
                                        <Pause className="w-3.5 h-3.5" /> Tutup
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {filteredVideos.map(v => (
                                <div key={v.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all group">
                                    <div className="relative aspect-video bg-gray-900 cursor-pointer" onClick={() => setPlayingVideo(v.id)}>
                                        <div className="absolute inset-0 bg-gradient-to-br from-[#1a4a2a]/80 to-[#d4a017]/40 flex flex-col items-center justify-center gap-3">
                                            <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur border-2 border-white/50 flex items-center justify-center transition-all group-hover:scale-110 group-hover:bg-white/30">
                                                <Play className="w-6 h-6 text-white ml-1" />
                                            </div>
                                            <span className="text-xs text-white/80 font-medium bg-black/30 px-2 py-0.5 rounded-full">{v.duration}</span>
                                        </div>
                                        <span className="absolute top-3 left-3 text-[10px] font-black uppercase tracking-widest bg-[#d4a017] text-white px-2.5 py-1 rounded-full">{v.category}</span>
                                        <span className="absolute top-3 right-3 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full font-medium">{v.views} tayang</span>
                                    </div>
                                    <div className="p-4">
                                        <p className="font-bold text-gray-900 text-sm mb-1 leading-tight">{v.title}</p>
                                        <p className="text-xs text-gray-500 leading-relaxed mb-3">{v.desc}</p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-400 font-medium">{v.channel}</span>
                                            <button onClick={() => setPlayingVideo(v.id)}
                                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-all hover:opacity-90"
                                                style={{ background: "linear-gradient(135deg, #1a4a2a, #d4a017)" }}>
                                                <Play className="w-3.5 h-3.5" /> Tonton
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ══ TAB: TATA CARA UMROH ══ */}
                {tab === "tatacara" && (
                    <div className="space-y-4">
                        <div className="bg-gradient-to-br from-emerald-50 to-amber-50/30 rounded-2xl p-5 border border-emerald-200 mb-6">
                            <p className="font-bold text-emerald-800 mb-1">📖 Urutan Rukun Umroh</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {TATACARA.map(s => (
                                    <button key={s.step} onClick={() => setExpandedStep(s.step)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all"
                                        style={expandedStep === s.step ? { background: "#1a4a2a", color: "white", borderColor: "#1a4a2a" } : { borderColor: "#d4d4d4", color: "#555" }}>
                                        <span>{s.icon}</span> {s.step}. {s.title}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {TATACARA.map(step => (
                            <div key={step.step} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                <button
                                    onClick={() => setExpandedStep(expandedStep === step.step ? null : step.step)}
                                    className="w-full flex items-center gap-4 p-5 text-left hover:bg-gray-50/50 transition-colors"
                                >
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center flex-shrink-0 text-2xl shadow-md`}>
                                        {step.icon}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Langkah {step.step}</p>
                                        <p className="font-bold text-gray-900 text-base">{step.title}</p>
                                        <p className="text-xs text-gray-500 mt-0.5">{step.substeps.length} langkah detail</p>
                                    </div>
                                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform flex-shrink-0 ${expandedStep === step.step ? "rotate-180" : ""}`} />
                                </button>

                                {expandedStep === step.step && (
                                    <div className="border-t border-gray-100 p-5 space-y-4">
                                        <div className="space-y-2">
                                            {step.substeps.map((s, i) => (
                                                <div key={i} className="flex items-start gap-3">
                                                    <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                                                        <span className="text-white text-[10px] font-black">{i + 1}</span>
                                                    </div>
                                                    <p className="text-sm text-gray-700 leading-relaxed">{s}</p>
                                                </div>
                                            ))}
                                        </div>
                                        {step.larangan.length > 0 && (
                                            <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                                                <p className="text-xs font-black text-red-600 uppercase tracking-widest mb-2">⚠️ Larangan Ihram</p>
                                                <ul className="space-y-1.5">
                                                    {step.larangan.map((l, i) => (
                                                        <li key={i} className="flex items-start gap-2 text-xs text-red-700">
                                                            <span className="text-red-400 mt-0.5 flex-shrink-0">×</span> {l}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Catatan penting */}
                        <div className="bg-gradient-to-br from-[#1a0a00] to-[#3d1500] rounded-2xl p-6 text-center mt-4">
                            <p className="text-2xl mb-2">🤲</p>
                            <p className="text-white font-bold mb-1">Semoga Ibadah Anda Mabrur</p>
                            <p className="text-white/60 text-sm">Lakukan setiap rukun dengan khusyuk, ikhlas, dan penuh penghayatan. Konsultasikan dengan mutawif jika ada pertanyaan.</p>
                        </div>
                    </div>
                )}

                {/* ══ TAB: AUDIO DOA ══ */}
                {tab === "audio" && (
                    <div>
                        <style>{`
                            @keyframes audioBar {
                                0%, 100% { height: 4px; }
                                50%       { height: 16px; }
                            }
                        `}</style>

                        {/* Mini Player */}
                        {playingAudio && (
                            <div className="mb-6 bg-gradient-to-br from-[#1a4a2a] to-[#d4a017]/40 rounded-2xl p-5 border border-[#d4a017]/30 shadow-xl">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
                                        <Headphones className="w-7 h-7 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-white">{AUDIOS.find(a => a.id === playingAudio)?.title}</p>
                                        <p className="text-xs text-white/60">{AUDIOS.find(a => a.id === playingAudio)?.reciter}</p>
                                        {/* Fake waveform */}
                                        <div className="flex gap-1 mt-2 items-end h-5">
                                            {Array.from({ length: 20 }).map((_, i) => (
                                                <div key={i} className="w-1 rounded-full bg-[#d4a017]"
                                                    style={{ height: `${4 + Math.random() * 12}px`, animation: `audioBar ${0.4 + i * 0.05}s ease-in-out infinite alternate` }} />
                                            ))}
                                        </div>
                                    </div>
                                    <button onClick={() => setPlayingAudio(null)}
                                        className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                                        <Pause className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Category filter */}
                        <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-6">
                            {CATEGORIES_AUDIO.map(c => (
                                <button key={c} onClick={() => setAudioCat(c)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex-shrink-0 border ${audioCat === c ? "bg-[#1a4a2a] text-white border-[#1a4a2a]" : "text-gray-600 border-gray-200 hover:border-[#d4a017]"}`}>
                                    {c}
                                </button>
                            ))}
                        </div>

                        <div className="space-y-3">
                            {filteredAudios.length === 0 && (
                                <div className="text-center py-16 text-gray-400">
                                    <Headphones className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                    <p className="font-semibold">Tidak ada audio ditemukan</p>
                                </div>
                            )}
                            {filteredAudios.map(a => (
                                <AudioCard
                                    key={a.id}
                                    audio={a}
                                    isPlaying={playingAudio === a.id}
                                    onToggle={() => setPlayingAudio(playingAudio === a.id ? null : a.id)}
                                />
                            ))}
                        </div>

                        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-sm text-amber-700">
                            <p className="font-bold mb-1">💡 Panduan Penggunaan Audio</p>
                            <p>Gunakan audio doa ini untuk membantu menghafal doa-doa umroh sebelum berangkat. Dengarkan secara berulang sambil membaca teks doa.</p>
                        </div>
                    </div>
                )}
            </div>

            {/* ── CTA Bottom ── */}
            <div className="container mx-auto max-w-4xl px-4 pb-12">
                <div className="rounded-2xl p-6 text-center" style={{ background: "linear-gradient(135deg, #1a4a2a, #0a2a1a)" }}>
                    <p className="text-white font-bold text-lg mb-1">Butuh Bimbingan Lebih Lanjut?</p>
                    <p className="text-white/60 text-sm mb-5">Ustadz pembimbing kami siap membantu pertanyaan seputar ibadah umroh Anda</p>
                    <div className="flex flex-wrap gap-3 justify-center">
                        <Link href="/packages" className="px-6 py-3 rounded-xl font-bold text-white text-sm transition-all hover:scale-105" style={{ background: "linear-gradient(135deg, #d4a017, #b88a10)" }}>
                            Lihat Paket Umroh
                        </Link>
                        <a href="https://wa.me/6281234567890?text=Assalamualaikum%2C%20saya%20ingin%20bertanya%20tentang%20panduan%20umroh"
                            target="_blank" rel="noopener noreferrer"
                            className="px-6 py-3 rounded-xl font-bold text-white text-sm transition-all hover:scale-105"
                            style={{ background: "#25D366" }}>
                            Tanya via WhatsApp
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
