"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const [supabase] = useState(() => createClient());

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                        phone: phone,
                    },
                },
            });

            if (error) {
                setError(error.message);
                return;
            }

            // Automatically sign in or redirect to confirmation page
            // For now, we assume email confirmation might be off or we just redirect to login
            router.push("/login?message=Pendaftaran berhasil, silakan masuk.");
        } catch (err) {
            setError("Terjadi kesalahan yang tidak terduga.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold">Daftar Akun Baru</CardTitle>
                    <CardDescription>
                        Masukkan data Anda di bawah ini untuk membuat akun baru
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleRegister} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="fullName">Nama Lengkap (Sesuai KTP/Paspor)</Label>
                            <Input
                                id="fullName"
                                placeholder="Fulan bin Fulan"
                                required
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">No. WhatsApp / HP</Label>
                            <Input
                                id="phone"
                                type="tel"
                                placeholder="08123456789"
                                required
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="fulan@contoh.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Kata Sandi (Min. 6 Karakter)</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="******"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        {error && (
                            <div className="text-sm text-red-500 font-medium">{error}</div>
                        )}
                        <Button type="submit" className="w-full bg-[#d4a017] hover:bg-[#b88a10] text-white font-bold" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Daftar Sekarang
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <div className="text-sm text-gray-500">
                        Sudah punya akun?{" "}
                        <Link href="/login" className="text-[#d4a017] hover:underline font-bold">
                            Masuk di sini
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
