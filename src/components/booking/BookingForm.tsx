"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, UploadCloud, CreditCard, User, FileText, CheckCircle2, ChevronRight, ChevronLeft } from "lucide-react";
import { PaymentGateway } from "@/components/booking/PaymentGateway";

interface BookingFormProps {
    pkg: any;
    user: any;
}

type Step = 1 | 2 | 3 | 4;

export function BookingForm({ pkg, user }: BookingFormProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentStep, setCurrentStep] = useState<Step>(1);

    // Skema bayar
    const [paymentScheme, setPaymentScheme] = useState<'full' | 'installment' | 'dp'>('dp');
    // Metode bayar dari payment gateway
    const [paymentGatewayMethod, setPaymentGatewayMethod] = useState<string>("va");
    const [paymentGatewayDetail, setPaymentGatewayDetail] = useState<string>("bca-va");

    // Jamaah Form State
    const [whatsapp, setWhatsapp] = useState('');
    const [ktpFile, setKtpFile] = useState<File | null>(null);
    const [passportFile, setPassportFile] = useState<File | null>(null);
    const [invoiceId, setInvoiceId] = useState('');

    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const randomString = Math.random().toString(36).substring(2, 6).toUpperCase();
        const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
        setInvoiceId(`INV-${dateStr}-${randomString}`);
    }, []);

    const hargaPaket = pkg.promo_price || pkg.price;
    const dpAmount = 5000000;
    const installmentAmount = Math.round((hargaPaket - dpAmount) / 3);

    const totalTagihanSaatIni =
        paymentScheme === 'full' ? hargaPaket :
            paymentScheme === 'dp' ? dpAmount :
                installmentAmount;

    const formatIDR = (n: number) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

    const handleNext = () => {
        if (currentStep === 1 && !whatsapp.trim()) {
            setError("Nomor WhatsApp wajib diisi");
            return;
        }
        if (currentStep === 2 && !ktpFile) {
            setError("Upload KTP wajib dilakukan");
            return;
        }
        setError(null);
        setCurrentStep((s) => Math.min(s + 1, 4) as Step);
    };

    const handleBack = () => {
        setCurrentStep((s) => Math.max(s - 1, 1) as Step);
    };

    const handleBooking = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await new Promise(resolve => setTimeout(resolve, 1200));
            router.push("/bookings/success");
            router.refresh();
        } catch (err: any) {
            setError(err.message || "Gagal membuat pesanan.");
        } finally {
            setLoading(false);
        }
    };

    // ──────────────────────────────────────────────────────────────────────────
    const steps = [
        { num: 1, label: "Jamaah" },
        { num: 2, label: "Dokumen" },
        { num: 3, label: "Pembayaran" },
        { num: 4, label: "Konfirmasi" },
    ];

    return (
        <form onSubmit={handleBooking} className="space-y-6">
            {/* ── Step Indicator ─────────────────────────────── */}
            <div className="flex items-center justify-between mb-2 relative">
                {/* connector line */}
                <div className="absolute left-0 right-0 top-5 h-0.5 bg-gray-200 -z-0" />
                <div
                    className="absolute left-0 top-5 h-0.5 bg-[#d4a017] -z-0 transition-all duration-500"
                    style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
                />
                {steps.map((step) => (
                    <div key={step.num} className="flex flex-col items-center gap-1.5 bg-white z-10 px-1">
                        <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all border-2 ${currentStep > step.num
                                    ? "bg-[#d4a017] border-[#d4a017] text-white"
                                    : currentStep === step.num
                                        ? "bg-white border-[#d4a017] text-[#d4a017]"
                                        : "bg-white border-gray-200 text-gray-400"
                                }`}
                        >
                            {currentStep > step.num ? <CheckCircle2 className="w-5 h-5" /> : step.num}
                        </div>
                        <span className={`text-xs font-semibold ${currentStep === step.num ? "text-[#d4a017]" : "text-gray-400"}`}>
                            {step.label}
                        </span>
                    </div>
                ))}
            </div>

            {/* ── STEP 1: Informasi Jamaah ───────────────────── */}
            {currentStep === 1 && (
                <Card className="border-0 shadow-sm ring-1 ring-gray-100 overflow-hidden">
                    <CardHeader className="bg-stone-50 border-b border-gray-100 pb-4">
                        <CardTitle className="text-xl flex items-center gap-2">
                            <User className="w-5 h-5 text-[#d4a017]" />
                            Informasi Jamaah
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Nama Lengkap (Sesuai KTP)</Label>
                                <Input value={user?.user_metadata?.full_name || user?.email || ""} disabled className="bg-muted cursor-not-allowed" />
                            </div>
                            <div className="space-y-2">
                                <Label>Email</Label>
                                <Input value={user?.email || ""} disabled className="bg-muted cursor-not-allowed" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="whatsapp">Nomor WhatsApp Aktif <span className="text-red-500">*</span></Label>
                            <Input
                                id="whatsapp"
                                type="tel"
                                placeholder="Contoh: 081234567890"
                                value={whatsapp}
                                onChange={(e) => setWhatsapp(e.target.value)}
                            />
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* ── STEP 2: Dokumen ────────────────────────────── */}
            {currentStep === 2 && (
                <Card className="border-0 shadow-sm ring-1 ring-gray-100 overflow-hidden">
                    <CardHeader className="bg-stone-50 border-b border-gray-100 pb-4">
                        <CardTitle className="text-xl flex items-center gap-2">
                            <UploadCloud className="w-5 h-5 text-[#d4a017]" />
                            Dokumen Persyaratan
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <Label className="flex justify-between items-center">
                                    <span>Upload KTP <span className="text-red-500">*</span></span>
                                    {ktpFile && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                                </Label>
                                <label htmlFor="ktp-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-stone-50 hover:bg-stone-100 border-stone-200 hover:border-[#d4a017] transition-all">
                                    <UploadCloud className="w-8 h-8 mb-2 text-muted-foreground" />
                                    <p className="text-sm text-muted-foreground font-medium">{ktpFile ? ktpFile.name : "Klik untuk upload KTP"}</p>
                                    <p className="text-xs text-muted-foreground">JPG, PNG, PDF (Max 5MB)</p>
                                    <Input id="ktp-upload" type="file" className="hidden" accept="image/*,.pdf" onChange={(e) => setKtpFile(e.target.files?.[0] || null)} />
                                </label>
                            </div>
                            <div className="space-y-3">
                                <Label className="flex justify-between items-center">
                                    <span>Upload Paspor <span className="text-muted-foreground font-normal text-xs">(Bisa menyusul)</span></span>
                                    {passportFile && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                                </Label>
                                <label htmlFor="passport-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-stone-50 hover:bg-stone-100 border-stone-200 hover:border-[#d4a017] transition-all">
                                    <UploadCloud className="w-8 h-8 mb-2 text-muted-foreground" />
                                    <p className="text-sm text-muted-foreground font-medium">{passportFile ? passportFile.name : "Klik untuk upload Paspor"}</p>
                                    <p className="text-xs text-muted-foreground">Bagian biodata saja</p>
                                    <Input id="passport-upload" type="file" className="hidden" accept="image/*,.pdf" onChange={(e) => setPassportFile(e.target.files?.[0] || null)} />
                                </label>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* ── STEP 3: Pilih Metode & Skema Bayar ────────── */}
            {currentStep === 3 && (
                <div className="space-y-5">
                    {/* Skema Bayar */}
                    <Card className="border-0 shadow-sm ring-1 ring-gray-100 overflow-hidden">
                        <CardHeader className="bg-stone-50 border-b border-gray-100 pb-4">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-[#d4a017]" />
                                Skema Pembayaran
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-5">
                            <div className="grid md:grid-cols-3 gap-3">
                                {[
                                    { id: 'dp', title: 'Bayar DP', desc: 'Booking seat sekarang', price: dpAmount, badge: null },
                                    { id: 'installment', title: 'Cicilan 3x', desc: 'Tanpa bunga riba', price: installmentAmount, badge: "POPULER" },
                                    { id: 'full', title: 'Bayar Lunas', desc: 'Sekali bayar, lebih hemat', price: hargaPaket, badge: null },
                                ].map((method) => (
                                    <div
                                        key={method.id}
                                        onClick={() => setPaymentScheme(method.id as any)}
                                        className={`relative cursor-pointer p-4 rounded-xl border-2 transition-all ${paymentScheme === method.id ? 'border-[#d4a017] bg-[#d4a017]/5' : 'border-gray-200 hover:border-gray-300'}`}
                                    >
                                        {method.badge && (
                                            <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[10px] font-black px-2 py-0.5 rounded-full text-white bg-[#d4a017]">
                                                {method.badge}
                                            </span>
                                        )}
                                        {paymentScheme === method.id && (
                                            <CheckCircle2 className="absolute top-3 right-3 w-4 h-4 text-[#d4a017]" />
                                        )}
                                        <h4 className="font-bold text-sm mb-0.5">{method.title}</h4>
                                        <p className="text-xs text-muted-foreground mb-2">{method.desc}</p>
                                        <p className="font-black text-base text-[#d4a017]">{formatIDR(method.price)}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Payment Gateway */}
                    <Card className="border-0 shadow-sm ring-1 ring-gray-100 overflow-hidden">
                        <CardHeader className="bg-stone-50 border-b border-gray-100 pb-4">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-[#d4a017]" />
                                Metode Pembayaran
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-5">
                            <PaymentGateway
                                amount={totalTagihanSaatIni}
                                invoiceId={invoiceId}
                                onPaymentMethodSelect={(method, detail) => {
                                    setPaymentGatewayMethod(method);
                                    setPaymentGatewayDetail(detail);
                                }}
                            />
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* ── STEP 4: Konfirmasi & Invoice ───────────────── */}
            {currentStep === 4 && (
                <div className="space-y-5">
                    {/* Invoice Card */}
                    <div className="bg-gradient-to-br from-emerald-900 to-emerald-800 text-white rounded-2xl p-6 shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-700 rounded-full blur-3xl opacity-40 translate-x-1/2 -translate-y-1/2" />
                        <div className="relative z-10 space-y-5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-emerald-300" />
                                    <span className="text-emerald-200 text-sm">Invoice Pembayaran</span>
                                </div>
                                <span className="font-mono text-sm bg-white/10 px-3 py-1 rounded-lg">{invoiceId}</span>
                            </div>

                            <div className="border-t border-emerald-700/60 pt-4 space-y-2.5">
                                <div className="flex justify-between text-sm">
                                    <span className="text-emerald-200">Paket</span>
                                    <span className="font-semibold text-right max-w-[200px]">{pkg.title}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-emerald-200">Nama Jamaah</span>
                                    <span className="font-semibold">{user?.user_metadata?.full_name || user?.email}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-emerald-200">No. WhatsApp</span>
                                    <span className="font-semibold">{whatsapp}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-emerald-200">Skema</span>
                                    <span className="font-semibold">
                                        {paymentScheme === 'full' ? 'Lunas' : paymentScheme === 'dp' ? 'Down Payment (DP)' : 'Cicilan 3x'}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-emerald-200">Metode Bayar</span>
                                    <span className="font-semibold capitalize">{paymentGatewayMethod === 'va' ? 'Virtual Account' : paymentGatewayMethod === 'transfer' ? 'Transfer Bank' : paymentGatewayMethod === 'qris' ? 'QRIS' : 'E-Wallet'}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-emerald-200">Dokumen KTP</span>
                                    <span className={`font-semibold ${ktpFile ? 'text-green-300' : 'text-amber-300'}`}>
                                        {ktpFile ? `✓ ${ktpFile.name}` : 'Belum diupload'}
                                    </span>
                                </div>
                            </div>

                            <div className="border-t border-emerald-700/60 pt-4 flex items-center justify-between">
                                <span className="text-emerald-200 text-sm">Total Dibayar Sekarang</span>
                                <span className="text-3xl font-black text-[#d4a017]">{formatIDR(totalTagihanSaatIni)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Checklist */}
                    <div className="space-y-2.5 bg-stone-50 rounded-2xl p-4">
                        {[
                            { label: "Data jamaah terisi lengkap", done: !!whatsapp },
                            { label: "KTP sudah diupload", done: !!ktpFile },
                            { label: "Skema pembayaran dipilih", done: true },
                            { label: "Metode pembayaran dipilih", done: true },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${item.done ? 'bg-green-500' : 'bg-amber-400'}`}>
                                    {item.done ? <CheckCircle2 className="w-3.5 h-3.5 text-white" /> : <span className="text-white text-[10px] font-bold">!</span>}
                                </div>
                                <span className={`text-sm ${item.done ? 'text-gray-700' : 'text-amber-600 font-medium'}`}>{item.label}</span>
                            </div>
                        ))}
                    </div>

                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm text-center">
                            {error}
                        </div>
                    )}

                    <Button
                        type="submit"
                        size="lg"
                        className="w-full h-14 text-lg bg-[#d4a017] hover:bg-[#b88a10] text-white font-bold rounded-xl shadow-xl transition-all hover:scale-[1.02]"
                        disabled={loading}
                    >
                        {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                        {loading ? "Memproses Pembayaran..." : "Konfirmasi & Bayar Sekarang 🔐"}
                    </Button>
                    <p className="text-center text-xs text-muted-foreground">
                        Dengan menekan tombol ini, Anda menyetujui syarat & ketentuan Jawara Wisata.
                    </p>
                </div>
            )}

            {/* ── Navigation Buttons ─────────────────────────── */}
            {currentStep < 4 && (
                <div className="flex gap-3 pt-2">
                    {currentStep > 1 && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleBack}
                            className="flex-1 h-12 rounded-xl border-gray-200 font-semibold flex items-center gap-2"
                        >
                            <ChevronLeft className="w-4 h-4" /> Kembali
                        </Button>
                    )}
                    <Button
                        type="button"
                        onClick={handleNext}
                        className="flex-1 h-12 bg-[#d4a017] hover:bg-[#b88a10] text-white font-bold rounded-xl flex items-center justify-center gap-2"
                    >
                        {currentStep === 3 ? "Lihat Ringkasan" : "Lanjut"}
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>
            )}

            {/* Error message */}
            {currentStep < 4 && error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
            )}
        </form>
    );
}
