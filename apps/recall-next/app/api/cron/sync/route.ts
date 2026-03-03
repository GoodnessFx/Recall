import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Resend } from "resend";

export const dynamic = "force-dynamic";

export async function GET() {
  // System job: iterate all users and perform sync and reminders checks
  const supabase = createSupabaseServerClient();
  // This requires service role key. Use serverless function with SUPABASE_SERVICE_ROLE_KEY.
  const admin = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/users`, {
    headers: { apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!, Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}` },
  });
  if (!admin.ok) return NextResponse.json({ ok: false, error: "auth list users failed" }, { status: 500 });
  const users = await admin.json();

  let synced = 0;
  for (const u of users?.users ?? []) {
    // Impersonation not directly supported here; this endpoint is a placeholder for Vercel Cron invoking a Supabase Edge Function per-user.
    // As a lighter approach, just check reminders due for all users.
    const { data: reminders } = await supabase
      .from("reminders")
      .select("id, user_id, title, due_date, notified")
      .lte("due_date", new Date().toISOString())
      .eq("notified", false);
    const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
    for (const r of reminders ?? []) {
      if (resend) {
        await resend.emails.send({
          from: process.env.EMAIL_FROM || "Recall <noreply@yourdomain.com>",
          to: [u.email].filter(Boolean) as string[],
          subject: `Reminder: ${r.title}`,
          text: `Due: ${new Date(r.due_date).toLocaleString()}`,
        });
      }
      await supabase.from("reminders").update({ notified: true }).eq("id", r.id);
    }
    // Weekly digest
    if (resend) {
      const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      const { data: recent } = await supabase
        .from("saved_items")
        .select("title, source, created_at")
        .eq("user_id", u.id)
        .gte("created_at", since)
        .order("created_at", { ascending: false })
        .limit(50);
      if ((recent ?? []).length) {
        const lines = (recent ?? []).map(
          (it) => `• [${it.source}] ${it.title ?? ""} — ${new Date(it.created_at as string).toLocaleDateString()}`
        );
        await resend.emails.send({
          from: process.env.EMAIL_FROM || "Recall <noreply@yourdomain.com>",
          to: [u.email].filter(Boolean) as string[],
          subject: `Recall Weekly Digest`,
          text: `Your latest items:\n\n${lines.join("\n")}`,
        });
      }
    }
    synced++;
  }
  return NextResponse.json({ ok: true, synced });
}
