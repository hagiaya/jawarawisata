"use client";

import { useState, useEffect } from "react";

function pad(n: number) {
    return n.toString().padStart(2, "0");
}

export function FlashSaleCountdown() {
    // Flash sale ends at midnight 3 days from now (set once on client)
    const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 });
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // End in ~23:59:59 from now, refreshes daily on page reload
        const endTime = new Date();
        endTime.setHours(23, 59, 59, 0);
        if (endTime <= new Date()) endTime.setDate(endTime.getDate() + 1);

        const tick = () => {
            const now = new Date().getTime();
            const diff = endTime.getTime() - now;
            if (diff <= 0) {
                setTimeLeft({ h: 0, m: 0, s: 0 });
                return;
            }
            const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const s = Math.floor((diff % (1000 * 60)) / 1000);
            setTimeLeft({ h, m, s });
        };

        tick();
        const interval = setInterval(tick, 1000);
        return () => clearInterval(interval);
    }, []);

    if (!mounted) return null;

    return (
        <div className="flex flex-col items-end gap-1.5">
            <span className="text-white/60 text-xs uppercase tracking-widest">Berakhir dalam</span>
            <div className="flex items-center gap-2">
                {[
                    { label: "JAM", value: timeLeft.h },
                    { label: "MENIT", value: timeLeft.m },
                    { label: "DETIK", value: timeLeft.s },
                ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <div className="flex flex-col items-center">
                            <div
                                className="w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl text-white shadow-lg"
                                style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(10px)", border: "1px solid rgba(212,160,23,0.4)" }}
                            >
                                {pad(item.value)}
                            </div>
                            <span className="text-white/50 text-[9px] mt-1 tracking-widest font-bold">{item.label}</span>
                        </div>
                        {i < 2 && (
                            <span className="text-[#d4a017] font-black text-2xl mb-4 animate-pulse">:</span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
