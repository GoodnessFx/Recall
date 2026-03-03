import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const form = await request.formData();
  const file = form.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "Missing file" }, { status: 400 });
  const ext = file.name.split(".").pop();
  const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { data, error } = await supabase.storage.from("media").upload(path, file, {
    contentType: file.type,
    upsert: false,
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const { data: pub } = supabase.storage.from("media").getPublicUrl(data.path);
  const publicUrl = pub.publicUrl;
  await supabase
    .from("saved_items")
    .insert({
      user_id: user.id,
      source: "upload",
      title: file.name,
      media_urls: [publicUrl],
      raw_json: { file: { name: file.name, type: file.type, size: (file as any).size } },
    })
    .throwOnError();
  return NextResponse.json({ ok: true, url: publicUrl });
}
