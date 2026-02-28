"use client";

import { useState } from "react";
import { CheckCircle2, Copy, Clock, ShieldCheck, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

// ─── Types ───────────────────────────────────────────────────────────────────
type Category = "transfer" | "va" | "qris" | "ewallet";

interface PaymentGatewayProps {
    amount: number;
    invoiceId: string;
    onPaymentMethodSelect?: (method: string, detail: string) => void;
}

// ─── Bank / Channel Data ─────────────────────────────────────────────────────
const TRANSFER_BANKS = [
    {
        id: "bca",
        name: "BCA",
        accountNumber: "8290 1234 567",
        accountName: "PT JAWARA WISATA INDONESIA",
        color: "#003468",
        logo: (
            <svg viewBox="0 0 60 20" className="h-7 w-auto" fill="none">
                <text x="0" y="16" fontFamily="Arial" fontWeight="bold" fontSize="18" fill="#003468">BCA</text>
            </svg>
        ),
    },
    {
        id: "mandiri",
        name: "Mandiri",
        accountNumber: "1400 0987 6543",
        accountName: "PT JAWARA WISATA INDONESIA",
        color: "#003087",
        logo: (
            <svg viewBox="0 0 80 20" className="h-7 w-auto">
                <text x="0" y="16" fontFamily="Arial" fontWeight="bold" fontSize="14" fill="#003087">MANDIRI</text>
            </svg>
        ),
    },
    {
        id: "bri",
        name: "BRI",
        accountNumber: "0123 0100 1234 567",
        accountName: "PT JAWARA WISATA INDONESIA",
        color: "#015CAB",
        logo: (
            <svg viewBox="0 0 50 20" className="h-7 w-auto">
                <text x="0" y="16" fontFamily="Arial" fontWeight="bold" fontSize="18" fill="#015CAB">BRI</text>
            </svg>
        ),
    },
    {
        id: "bni",
        name: "BNI",
        accountNumber: "0456 7890 12",
        accountName: "PT JAWARA WISATA INDONESIA",
        color: "#FF6600",
        logo: (
            <svg viewBox="0 0 50 20" className="h-7 w-auto">
                <text x="0" y="16" fontFamily="Arial" fontWeight="bold" fontSize="18" fill="#FF6600">BNI</text>
            </svg>
        ),
    },
];

const VA_BANKS = [
    { id: "bca-va", name: "BCA Virtual Account", prefix: "39012", color: "#003468" },
    { id: "mandiri-va", name: "Mandiri Virtual Account", prefix: "88812", color: "#003087" },
    { id: "bri-va", name: "BRI Virtual Account", prefix: "12345", color: "#015CAB" },
    { id: "bni-va", name: "BNI Virtual Account", prefix: "99887", color: "#FF6600" },
    { id: "permata-va", name: "Permata Virtual Account", prefix: "77612", color: "#E31E26" },
];

const EWALLETS = [
    { id: "gopay", name: "GoPay", color: "#00AED6", deeplink: "gopay://pay?amount=" },
    { id: "ovo", name: "OVO", color: "#4C3494", deeplink: "ovo://pay?amount=" },
    { id: "dana", name: "DANA", color: "#1890FF", deeplink: "dana://pay?amount=" },
    { id: "shopeepay", name: "ShopeePay", color: "#EE4D2D", deeplink: "shopeepay://pay?amount=" },
    { id: "linkaja", name: "LinkAja", color: "#E82529", deeplink: "linkaja://pay?amount=" },
];

// ─── Helper ───────────────────────────────────────────────────────────────────
function formatIDR(n: number) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(n);
}

function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };
    return (
        <button
            onClick={handleCopy}
            type="button"
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${copied ? "bg-green-100 text-green-600" : "bg-gray-100 hover:bg-[#d4a017]/10 hover:text-[#d4a017] text-gray-600"
                }`}
        >
            {copied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Tersalin!" : "Salin"}
        </button>
    );
}

// ─── QR Code SVG (Simulated QRIS) ────────────────────────────────────────────
function QrisDisplay({ invoiceId, amount }: { invoiceId: string; amount: number }) {
    // Simulated QR pattern (decorative)
    const cells = Array.from({ length: 25 }, (_, i) => {
        const row = Math.floor(i / 5);
        const col = i % 5;
        const pattern = [
            [1, 1, 1, 1, 1],
            [1, 0, 1, 0, 1],
            [1, 1, 0, 1, 1],
            [1, 0, 1, 0, 1],
            [1, 1, 1, 1, 1],
        ];
        return { row, col, filled: pattern[row][col] === 1 };
    });

    return (
        <div className="flex flex-col items-center gap-4">
            {/* QR Code frame */}
            <div className="relative p-4 bg-white rounded-2xl shadow-lg border border-gray-100">
                {/* Corner marks */}
                <div className="absolute top-3 left-3 w-10 h-10 border-4 border-gray-900 rounded-sm" />
                <div className="absolute top-3 right-3 w-10 h-10 border-4 border-gray-900 rounded-sm" />
                <div className="absolute bottom-3 left-3 w-10 h-10 border-4 border-gray-900 rounded-sm" />

                {/* Simulated QR grid */}
                <svg width="180" height="180" viewBox="0 0 100 100" className="mx-auto">
                    {/* Top-left finder */}
                    <rect x="5" y="5" width="25" height="25" rx="2" fill="#111" />
                    <rect x="10" y="10" width="15" height="15" rx="1" fill="white" />
                    <rect x="13" y="13" width="9" height="9" rx="1" fill="#111" />
                    {/* Top-right finder */}
                    <rect x="70" y="5" width="25" height="25" rx="2" fill="#111" />
                    <rect x="75" y="10" width="15" height="15" rx="1" fill="white" />
                    <rect x="78" y="13" width="9" height="9" rx="1" fill="#111" />
                    {/* Bottom-left finder */}
                    <rect x="5" y="70" width="25" height="25" rx="2" fill="#111" />
                    <rect x="10" y="75" width="15" height="15" rx="1" fill="white" />
                    <rect x="13" y="78" width="9" height="9" rx="1" fill="#111" />
                    {/* Random modules (simulated data) */}
                    {[
                        [35, 5], [40, 5], [45, 5], [50, 5], [60, 5], [65, 5],
                        [35, 10], [45, 10], [55, 10], [60, 10],
                        [38, 15], [42, 15], [50, 15], [58, 15], [62, 15],
                        [36, 20], [44, 20], [52, 20], [64, 20],
                        [5, 35], [10, 35], [20, 35], [35, 35], [45, 35], [55, 35], [65, 35], [75, 35], [85, 35], [95, 35],
                        [5, 40], [15, 40], [25, 40], [40, 40], [50, 40], [60, 40], [70, 40], [80, 40], [90, 40],
                        [8, 45], [18, 45], [30, 45], [42, 45], [55, 45], [68, 45], [78, 45], [88, 45],
                        [5, 50], [12, 50], [22, 50], [38, 50], [48, 50], [58, 50], [72, 50], [85, 50], [95, 50],
                        [5, 55], [15, 55], [28, 55], [40, 55], [52, 55], [65, 55], [75, 55], [88, 55],
                        [35, 60], [42, 60], [55, 60], [65, 60], [75, 60], [88, 60], [95, 60],
                        [38, 65], [45, 65], [58, 65], [68, 65], [78, 65], [92, 65],
                        [35, 75], [45, 75], [55, 75], [70, 75], [80, 75], [90, 75],
                        [38, 80], [48, 80], [62, 80], [72, 80], [85, 80], [95, 80],
                        [35, 85], [42, 85], [55, 85], [65, 85], [78, 85], [88, 85],
                        [35, 90], [45, 90], [58, 90], [70, 90], [82, 90], [95, 90],
                        [35, 95], [48, 95], [60, 95], [75, 95], [88, 95],
                    ].map(([x, y], i) => (
                        <rect key={i} x={x} y={y} width="5" height="5" fill="#111" />
                    ))}
                    {/* Center logo spot (QRIS mark) */}
                    <rect x="42" y="42" width="16" height="16" rx="2" fill="white" stroke="#d4a017" strokeWidth="1.5" />
                    <text x="50" y="53" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#d4a017">JW</text>
                </svg>

                {/* QRIS label */}
                <div className="text-center mt-2">
                    <span className="text-xs font-black tracking-widest" style={{ color: "#d4a017" }}>QRIS</span>
                </div>
            </div>

            {/* QR info */}
            <div className="text-center space-y-1">
                <p className="text-sm font-semibold text-gray-700">Scan dengan aplikasi apapun</p>
                <p className="text-xs text-gray-500">GoPay · OVO · DANA · ShopeePay · Mobile Banking</p>
            </div>

            {/* Amount */}
            <div className="w-full bg-amber-50 border border-amber-200 rounded-xl px-5 py-3 flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Pembayaran</span>
                <span className="font-black text-[#d4a017] text-lg">{formatIDR(amount)}</span>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-500">
                <Clock className="w-3.5 h-3.5" />
                <span>QR kedaluwarsa dalam <strong>30 menit</strong></span>
            </div>
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function PaymentGateway({ amount, invoiceId, onPaymentMethodSelect }: PaymentGatewayProps) {
    const [category, setCategory] = useState<Category>("va");
    const [selectedBank, setSelectedBank] = useState<string>(VA_BANKS[0].id);
    const [selectedWallet, setSelectedWallet] = useState<string>(EWALLETS[0].id);
    const [transferBank, setTransferBank] = useState<string>(TRANSFER_BANKS[0].id);

    const categories = [
        { id: "va" as Category, label: "Virtual Account", icon: "🏦" },
        { id: "transfer" as Category, label: "Transfer Bank", icon: "💸" },
        { id: "qris" as Category, label: "QRIS", icon: "📱" },
        { id: "ewallet" as Category, label: "E-Wallet", icon: "👛" },
    ];

    // Virtual Account number generator
    const selectedVA = VA_BANKS.find((b) => b.id === selectedBank);
    const vaNumber = selectedVA ? `${selectedVA.prefix}${invoiceId.replace(/\D/g, "").slice(-8).padStart(8, "0")}` : "";

    // Transfer bank selected
    const selectedTransferBank = TRANSFER_BANKS.find((b) => b.id === transferBank);

    // E-wallet selected
    const selectedEwallet = EWALLETS.find((w) => w.id === selectedWallet);

    const handleCategoryChange = (cat: Category) => {
        setCategory(cat);
        onPaymentMethodSelect?.(cat, cat === "va" ? selectedBank : cat === "transfer" ? transferBank : cat === "ewallet" ? selectedWallet : "qris");
    };

    return (
        <div className="space-y-5">
            {/* Category Tabs */}
            <div className="grid grid-cols-4 gap-2 p-1.5 bg-gray-100 rounded-2xl">
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        type="button"
                        onClick={() => handleCategoryChange(cat.id)}
                        className={`flex flex-col items-center gap-1 py-3 px-2 rounded-xl text-xs font-semibold transition-all ${category === cat.id
                                ? "bg-white text-[#d4a017] shadow-sm"
                                : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        <span className="text-lg">{cat.icon}</span>
                        <span className="leading-tight text-center">{cat.label}</span>
                    </button>
                ))}
            </div>

            {/* ── VIRTUAL ACCOUNT ──────────────────────────────── */}
            {category === "va" && (
                <div className="space-y-4">
                    {/* Bank selector */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {VA_BANKS.map((bank) => (
                            <button
                                key={bank.id}
                                type="button"
                                onClick={() => setSelectedBank(bank.id)}
                                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all ${selectedBank === bank.id
                                        ? "border-[#d4a017] bg-[#d4a017]/5 text-gray-800"
                                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                                    }`}
                            >
                                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: bank.color }} />
                                {bank.name.replace(" Virtual Account", "")}
                            </button>
                        ))}
                    </div>

                    {/* VA Details */}
                    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                        <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between" style={{ background: `${selectedVA?.color}10` }}>
                            <div className="flex items-center gap-2.5">
                                <div className="w-4 h-4 rounded-full" style={{ background: selectedVA?.color }} />
                                <span className="font-bold text-sm text-gray-800">{selectedVA?.name}</span>
                            </div>
                            <span className="text-xs text-gray-500 font-medium">Virtual Account</span>
                        </div>
                        <div className="px-5 py-5 space-y-4">
                            <div>
                                <p className="text-xs text-gray-500 mb-1.5 font-medium uppercase tracking-wide">Nomor Virtual Account</p>
                                <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                                    <span className="font-mono text-xl font-black tracking-widest text-gray-800">{vaNumber}</span>
                                    <CopyButton text={vaNumber} />
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-gray-500 mb-0.5 font-medium">Nama Penerima</p>
                                    <p className="font-semibold text-sm text-gray-800">PT JAWARA WISATA INDONESIA</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-500 mb-0.5 font-medium">Total Transfer</p>
                                    <p className="font-black text-base text-[#d4a017]">{formatIDR(amount)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Steps */}
                    <InstructionSteps
                        steps={[
                            `Buka aplikasi mobile banking atau ATM bank ${selectedVA?.name.replace(" Virtual Account", "")}`,
                            "Pilih menu Transfer → Virtual Account",
                            `Masukkan nomor VA: ${vaNumber}`,
                            `Konfirmasi transfer sebesar ${formatIDR(amount)}`,
                            "Simpan bukti transfer & kirim ke admin via WhatsApp",
                        ]}
                    />
                </div>
            )}

            {/* ── TRANSFER BANK ────────────────────────────────── */}
            {category === "transfer" && (
                <div className="space-y-4">
                    {/* Bank selecto */}
                    <div className="grid grid-cols-2 gap-2">
                        {TRANSFER_BANKS.map((bank) => (
                            <button
                                key={bank.id}
                                type="button"
                                onClick={() => setTransferBank(bank.id)}
                                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border-2 text-sm font-bold transition-all ${transferBank === bank.id
                                        ? "border-[#d4a017] bg-[#d4a017]/5"
                                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                                    }`}
                            >
                                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: bank.color }} />
                                {bank.name}
                            </button>
                        ))}
                    </div>

                    {/* Transfer details */}
                    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                        <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between" style={{ background: `${selectedTransferBank?.color}10` }}>
                            <span className="font-bold text-sm text-gray-800">Rekening {selectedTransferBank?.name}</span>
                            <span className="text-xs text-gray-500">Transfer Antar Bank</span>
                        </div>
                        <div className="px-5 py-5 space-y-4">
                            <div>
                                <p className="text-xs text-gray-500 mb-1.5 font-medium uppercase tracking-wide">Nomor Rekening</p>
                                <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                                    <span className="font-mono text-xl font-black tracking-widest text-gray-800">
                                        {selectedTransferBank?.accountNumber}
                                    </span>
                                    <CopyButton text={selectedTransferBank?.accountNumber || ""} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-gray-500 mb-0.5 font-medium">Atas Nama</p>
                                    <p className="font-semibold text-xs text-gray-800">{selectedTransferBank?.accountName}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-500 mb-0.5 font-medium">Jumlah Transfer</p>
                                    <div className="flex items-center justify-end gap-2">
                                        <p className="font-black text-base text-[#d4a017]">{formatIDR(amount)}</p>
                                        <CopyButton text={amount.toString()} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-start gap-2.5 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                        <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-amber-700">
                            Transfer <strong>sesuai nominal tepat</strong> agar sistem dapat memverifikasi pembayaran Anda secara otomatis.
                        </p>
                    </div>

                    <InstructionSteps
                        steps={[
                            `Buka aplikasi mobile banking atau ATM ${selectedTransferBank?.name}`,
                            "Pilih menu Transfer → ke rekening bank lain",
                            `Masukkan nomor rekening: ${selectedTransferBank?.accountNumber}`,
                            `Transfer tepat sebesar ${formatIDR(amount)}`,
                            "Kirim bukti transfer ke admin WhatsApp Jawara Wisata",
                        ]}
                    />
                </div>
            )}

            {/* ── QRIS ─────────────────────────────────────────── */}
            {category === "qris" && (
                <QrisDisplay invoiceId={invoiceId} amount={amount} />
            )}

            {/* ── E-WALLET ─────────────────────────────────────── */}
            {category === "ewallet" && (
                <div className="space-y-4">
                    {/* Wallet selector */}
                    <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                        {EWALLETS.map((wallet) => (
                            <button
                                key={wallet.id}
                                type="button"
                                onClick={() => setSelectedWallet(wallet.id)}
                                className={`flex flex-col items-center gap-1.5 px-2 py-3 rounded-xl border-2 text-xs font-bold transition-all ${selectedWallet === wallet.id
                                        ? "border-[#d4a017] bg-[#d4a017]/5"
                                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                                    }`}
                            >
                                <div
                                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[9px] font-black"
                                    style={{ background: wallet.color }}
                                >
                                    {wallet.name.slice(0, 2).toUpperCase()}
                                </div>
                                {wallet.name}
                            </button>
                        ))}
                    </div>

                    {/* E-wallet details */}
                    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                        <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <div
                                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-black"
                                    style={{ background: selectedEwallet?.color }}
                                >
                                    {selectedEwallet?.name.slice(0, 2).toUpperCase()}
                                </div>
                                <span className="font-bold text-sm text-gray-800">{selectedEwallet?.name}</span>
                            </div>
                            <span className="text-xs text-gray-500">E-Wallet</span>
                        </div>
                        <div className="px-5 py-5 space-y-4">
                            <div>
                                <p className="text-xs text-gray-500 mb-1.5 font-medium uppercase tracking-wide">Nomor {selectedEwallet?.name}</p>
                                <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                                    <span className="font-mono text-xl font-black tracking-widest text-gray-800">0812 9988 7766</span>
                                    <CopyButton text="081299887766" />
                                </div>
                                <p className="text-xs text-gray-500 mt-1.5">a/n: PT Jawara Wisata Indonesia</p>
                            </div>

                            <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                                <p className="text-sm text-gray-600 font-medium">Nominal Transfer</p>
                                <div className="flex items-center gap-2">
                                    <span className="font-black text-base text-[#d4a017]">{formatIDR(amount)}</span>
                                    <CopyButton text={amount.toString()} />
                                </div>
                            </div>

                            {/* Deep link button */}
                            <a
                                href={`${selectedEwallet?.deeplink}${amount}`}
                                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-white text-sm font-bold transition-all hover:opacity-90"
                                style={{ background: selectedEwallet?.color }}
                            >
                                <span>Buka {selectedEwallet?.name}</span>
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    <InstructionSteps
                        steps={[
                            `Buka aplikasi ${selectedEwallet?.name} di smartphone Anda`,
                            "Pilih menu Kirim Uang / Transfer",
                            `Masukkan nomor ${selectedEwallet?.name}: 0812 9988 7766`,
                            `Masukkan nominal: ${formatIDR(amount)}`,
                            "Kirim screenshot bukti pembayaran ke WhatsApp admin",
                        ]}
                    />
                </div>
            )}

            {/* Security note */}
            <div className="flex items-center gap-2.5 p-3 bg-green-50 border border-green-200 rounded-xl">
                <ShieldCheck className="w-4 h-4 text-green-600 flex-shrink-0" />
                <p className="text-xs text-green-700">
                    Pembayaran Anda <strong>aman & terlindungi</strong>. Tim admin akan memverifikasi dalam <strong>1x24 jam</strong>.
                </p>
            </div>
        </div>
    );
}

// ─── Instruction Steps ────────────────────────────────────────────────────────
function InstructionSteps({ steps }: { steps: string[] }) {
    return (
        <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Cara Pembayaran</p>
            {steps.map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#d4a017] text-white flex-shrink-0 flex items-center justify-center text-[10px] font-black mt-0.5">
                        {i + 1}
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">{step}</p>
                </div>
            ))}
        </div>
    );
}
