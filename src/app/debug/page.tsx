"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function DebugPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const check = async () => {
            const supabase = createClient();
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                setData({ error: "No session found. Please login first." });
                setLoading(false);
                return;
            }

            const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();

            setData({
                user: session.user.email,
                role: profile?.role || "PROFILE NOT FOUND",
                full_data: profile
            });
            setLoading(false);
        };
        check();
    }, []);

    return (
        <div className="p-10 font-mono text-sm">
            <h1 className="text-xl font-bold mb-4">Diagnostic Tool</h1>
            {loading ? <p>Checking status...</p> : (
                <div className="bg-gray-100 p-4 rounded-lg">
                    <p><strong>Email:</strong> {data.user}</p>
                    <p><strong>Detected Role:</strong> <span className={data.role === 'admin' ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>{data.role}</span></p>
                    <hr className="my-4" />
                    <pre>{JSON.stringify(data.full_data, null, 2)}</pre>
                </div>
            )}
            <div className="mt-8 gap-4 flex">
                <a href="/" className="text-blue-500 underline">Ke Beranda</a>
                <a href="/admin" className="text-blue-500 underline">Coba Akses Admin</a>
            </div>
        </div>
    );
}
