import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";
  if (code) {
    const supabase = createSupabaseServerClient();
    await supabase.auth.exchangeCodeForSession(code);
    const { data: sessionData } = await supabase.auth.getSession();
    const token = (sessionData.session as unknown as { provider_token?: string })?.provider_token;
    if (token) {
      const meRes = await fetch("https://api.twitter.com/2/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (meRes.ok) {
        const me = await meRes.json();
        const x_user_id = me?.data?.id as string | undefined;
        await supabase
          .from("profiles")
          .upsert({ user_id: sessionData.session?.user?.id, x_user_id }, { onConflict: "user_id" });
      }
    }
  }
  return NextResponse.redirect(new URL(next, request.url));
}
