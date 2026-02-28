"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { format, addDays } from "date-fns";
import { CheckCircle2, Calendar } from "lucide-react";

interface BookingActionsProps {
    pkg: any; // We can use 'any' or the package type
}

export function BookingActions({ pkg }: BookingActionsProps) {
    // Generate some mock alternative dates for the UI if needed, 
    // or just use the main one. We'll provide 3 options based on the start_date.
    const baseDate = new Date(pkg.start_date);
    const duration = Math.ceil(
        (new Date(pkg.end_date).getTime() - new Date(pkg.start_date).getTime()) /
        (1000 * 60 * 60 * 24)
    );

    const availableDates = [
        {
            id: 1,
            start: baseDate,
            end: new Date(pkg.end_date),
            label: "Keberangkatan Terdekat",
            available: pkg.available_seats || 10
        },
        {
            id: 2,
            start: addDays(baseDate, 14),
            end: addDays(baseDate, 14 + duration),
            label: "Batch 2",
            available: 15
        },
        {
            id: 3,
            start: addDays(baseDate, 28),
            end: addDays(baseDate, 28 + duration),
            label: "Batch 3",
            available: 20
        }
    ];

    const [selectedDateId, setSelectedDateId] = useState(availableDates[0].id);

    return (
        <div className="space-y-6 pt-6 border-t">
            <div>
                <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-[#d4a017]" />
                    Pilih Tanggal Keberangkatan
                </h3>
                <div className="grid gap-3">
                    {availableDates.map((date) => (
                        <div
                            key={date.id}
                            onClick={() => setSelectedDateId(date.id)}
                            className={`relative flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedDateId === date.id ? 'border-[#d4a017] bg-[#d4a017]/5' : 'border-gray-200 hover:border-[#d4a017]/50'}`}
                        >
                            {selectedDateId === date.id && (
                                <div className="absolute -top-3 -right-3 bg-[#d4a017] text-white rounded-full p-1 shadow-md">
                                    <CheckCircle2 className="w-5 h-5" />
                                </div>
                            )}
                            <div>
                                <p className="font-bold text-lg">
                                    {format(date.start, "dd MMM yyyy")}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {date.label} • {duration} Hari
                                </p>
                            </div>
                            <div className="mt-2 sm:mt-0 text-left sm:text-right">
                                <p className="text-sm font-medium text-[#d4a017]">
                                    Sisa {date.available} Seat
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="pt-4">
                <Button size="lg" className="w-full text-lg h-14 bg-[#d4a017] hover:bg-[#b88a10] text-white font-bold rounded-xl shadow-lg transition-all hover:scale-[1.02]" asChild>
                    <Link href={`/packages/${pkg.id}/book?dateId=${selectedDateId}`}>
                        Pesan Paket Ini Sekarang
                    </Link>
                </Button>
                <p className="text-center text-xs text-muted-foreground mt-3 flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Transaksi Aman & Terpercaya
                </p>
            </div>
        </div>
    );
}
