"use client";

export default function DebugPage() {
    return (
        <div className="p-10">
            <h1>Debug Env Vars</h1>
            <pre>
                URL: {process.env.NEXT_PUBLIC_SUPABASE_URL || "NOT SET (fallback: http://localhost:54321)"}{"\n"}
                KEY: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "SET (Starts with: " + process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 10) + "...)" : "NOT SET"}
            </pre>
        </div>
    );
}
