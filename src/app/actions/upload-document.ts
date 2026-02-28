"use server";

import { createClient } from "@supabase/supabase-js";

export async function uploadDocument(invoiceId: string, docType: "ktp" | "passport", base64File: string) {
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
        const supabase = createClient(supabaseUrl, supabaseKey);

        const cleanId = invoiceId.replace("INV-", "");

        // 1. Fetch current booking to ensure it exists
        const { data: booking, error: fetchErr } = await supabase
            .from("bookings")
            .select("*")
            .eq("id", cleanId)
            .single();

        if (fetchErr || !booking) {
            return { success: false, error: "Booking tidak ditemukan" };
        }

        // 2. Decode base64 to Buffer
        const base64Data = base64File.replace(/^data:image\/\w+;base64,/, "").replace(/^data:application\/pdf;base64,/, "");
        const buffer = Buffer.from(base64Data, "base64");
        const ext = base64File.includes("application/pdf") ? "pdf" : "jpg";

        const fileName = `doc_${docType}_${cleanId}_${Date.now()}.${ext}`;

        // 3. Upload to receipts bucket using admin privileges
        const { data: uploadData, error: uploadErr } = await supabase
            .storage
            .from("receipts")
            .upload(fileName, buffer, {
                contentType: ext === "pdf" ? "application/pdf" : "image/jpeg",
                upsert: true
            });

        let fileUrl = "";

        if (uploadErr) {
            // If receipts bucket doesn't exist or RLS blocks Service Role, fallback to storing as massive data URL in bookings
            console.warn("Storage upload failed, falling back to base64 DB storage", uploadErr);
            fileUrl = base64File; // store base64 as long text
        } else {
            // Get public URL
            const { data: publicUrlData } = supabase.storage.from("receipts").getPublicUrl(fileName);
            fileUrl = publicUrlData.publicUrl;
        }

        // 4. Update booking record
        const updatePayload: any = {};
        if (docType === "ktp") {
            updatePayload.ktp_url = fileUrl;
        } else {
            updatePayload.passport_url = fileUrl;
        }

        const { error: updateErr } = await supabase
            .from("bookings")
            .update(updatePayload)
            .eq("id", cleanId);

        if (updateErr) {
            return { success: false, error: "Gagal update database booking" };
        }

        return { success: true, url: fileUrl };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}
