import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const [items, tags, itemTags, reminders, contacts, settings] = await Promise.all([
    supabase.from("saved_items").select("*").eq("user_id", user.id),
    supabase.from("tags").select("*").eq("user_id", user.id),
    supabase.from("item_tags").select("*"),
    supabase.from("reminders").select("*").eq("user_id", user.id),
    supabase.from("contacts").select("*").eq("user_id", user.id),
    supabase.from("user_settings").select("*").eq("user_id", user.id),
  ]);
  const payload = {
    items: items.data ?? [],
    tags: tags.data ?? [],
    itemTags: itemTags.data ?? [],
    reminders: reminders.data ?? [],
    contacts: contacts.data ?? [],
    settings: settings.data ?? [],
    exportedAt: new Date().toISOString(),
  };
  return new NextResponse(JSON.stringify(payload, null, 2), {
    headers: { "Content-Type": "application/json", "Content-Disposition": "attachment; filename=recall-export.json" },
  });
}

