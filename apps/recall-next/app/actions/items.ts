"use server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { z } from "zod";
import { embed, generateText } from "ai";
import { openai } from "@ai-sdk/openai";

const manualSchema = z.object({
  url: z.string().url().optional().nullable(),
  title: z.string().max(280).optional().nullable(),
  text: z.string().max(8000).optional().nullable(),
});

export async function saveManualItem(input: z.infer<typeof manualSchema>) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  const freeLimit = Number(process.env.NEXT_PUBLIC_FREE_ITEM_LIMIT ?? "500");
  const { count } = await supabase
    .from("saved_items")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);
  if ((count ?? 0) >= freeLimit) {
    throw new Error("Free tier limit reached. Upgrade to add more items.");
  }
  const parsed = manualSchema.parse(input);
  const { data: item, error } = await supabase
    .from("saved_items")
    .insert({
      user_id: user.id,
      source: "manual",
      original_url: parsed.url ?? null,
      title: parsed.title ?? null,
      text_content: parsed.text ?? null,
      raw_json: {},
    })
    .select("id, title, text_content, original_url")
    .single();
  if (error) throw error;

  const baseText =
    [item.title, item.text_content, item.original_url].filter(Boolean).join("\n\n");

  // AI categorize + summarize
  const { text } = await generateText({
    model: openai("gpt-4o-mini"),
    prompt:
      "Classify into contexts (tech, lifestyle, blockchain, food, etc.), suggest tags, summary, and optional reminder. Respond JSON with keys: tags, summary, context, suggested_reminder.\n" +
      baseText,
  });
  let tags: string[] = [];
  let summary = "";
  let context = "general";
  let suggested: null | { title: string; date: string } = null;
  try {
    const j = JSON.parse(text);
    tags = Array.isArray(j.tags) ? j.tags.slice(0, 8) : [];
    summary = typeof j.summary === "string" ? j.summary : "";
    context = typeof j.context === "string" ? j.context : "general";
    suggested =
      j.suggested_reminder && j.suggested_reminder.title && j.suggested_reminder.date
        ? j.suggested_reminder
        : null;
  } catch {
    // ignore
  }

  // Upsert tags
  const tagIds: string[] = [];
  for (const name of tags) {
    const { data: t } = await supabase
      .from("tags")
      .upsert({ user_id: user.id, name }, { onConflict: "user_id,name" })
      .select("id")
      .single();
    if (t?.id) tagIds.push(t.id);
  }
  if (tagIds.length) {
    await supabase
      .from("item_tags")
      .insert(tagIds.map((tag_id) => ({ item_id: item.id, tag_id })))
      .throwOnError();
  }

  // Embedding
  if (baseText.trim()) {
    const { embedding } = await embed({
      model: openai.embedding("text-embedding-3-small"), // 1536 dims
      value: baseText,
    });
    await supabase.from("item_embeddings").insert({
      item_id: item.id,
      embedding,
    });
  }

  // Suggested reminder
  if (suggested) {
    const due = new Date(suggested.date);
    if (!Number.isNaN(due.getTime())) {
      await supabase.from("reminders").insert({
        user_id: user.id,
        item_id: item.id,
        title: suggested.title,
        due_date: due.toISOString(),
      });
    }
  }

  return { id: item.id, summary, context };
}

export async function hybridSearch(query: string) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  const { embedding } = await embed({
    model: openai.embedding("text-embedding-3-small"),
    value: query,
  });
  const { data } = await supabase.rpc("hybrid_search", {
    user_uuid: user.id,
    query_embedding: embedding,
    query_text: query,
    match_count: 30,
  });
  return data ?? [];
}
