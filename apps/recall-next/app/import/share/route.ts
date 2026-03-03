import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const form = await request.formData();
  const title = (form.get("title") as string | null) ?? undefined;
  const text = (form.get("text") as string | null) ?? undefined;
  const url = (form.get("url") as string | null) ?? undefined;
  const { error } = await supabase.from("saved_items").insert({
    user_id: user.id,
    source: "share",
    title: title || null,
    text_content: text || null,
    original_url: url || null,
    raw_json: {},
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
