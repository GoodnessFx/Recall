import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // Delete in order due to FKs
  const { data: itemRows } = await supabase.from("saved_items").select("id").eq("user_id", user.id);
  const itemIds = (itemRows ?? []).map((r) => r.id as string);
  if (itemIds.length) {
    await supabase.from("item_embeddings").delete().in("item_id", itemIds);
    await supabase.from("item_tags").delete().in("item_id", itemIds);
  }
  await supabase.from("saved_items").delete().eq("user_id", user.id);
  await supabase.from("tags").delete().eq("user_id", user.id);
  await supabase.from("reminders").delete().eq("user_id", user.id);
  await supabase.from("contacts").delete().eq("user_id", user.id);
  await supabase.from("user_settings").delete().eq("user_id", user.id);
  // Optionally delete profile
  await supabase.from("profiles").delete().eq("user_id", user.id);
  // Finally remove auth user (requires service role; otherwise soft delete)
  return NextResponse.json({ ok: true });
}
