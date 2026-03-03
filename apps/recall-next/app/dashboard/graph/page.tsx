import { createSupabaseServerClient } from "@/lib/supabase/server";
import GraphClient from "@/components/graph";

export default async function GraphPage() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return (
      <main className="min-h-dvh grid place-items-center p-8 bg-neutral-950 text-white">
        <div>Please sign in</div>
      </main>
    );
  }
  const { data: items } = await supabase
    .from("saved_items")
    .select("id, title, created_at")
    .eq("user_id", user.id)
    .limit(200);
  const { data: tags } = await supabase.from("tags").select("id, name").eq("user_id", user.id);
  const { data: itemTags } = await supabase.from("item_tags").select("item_id, tag_id");
  const nodes: Array<{ id: string; name?: string; group?: string }> = [];
  const links: Array<{ source: string; target: string }> = [];
  for (const t of tags ?? []) nodes.push({ id: t.id as string, name: t.name as string, group: "tag" });
  for (const it of items ?? []) nodes.push({ id: it.id as string, name: (it.title as string) ?? "", group: "item" });
  for (const jt of itemTags ?? []) links.push({ source: jt.item_id as string, target: jt.tag_id as string });
  const data: { nodes: Array<{ id: string; name?: string; group?: string }>; links: Array<{ source: string; target: string }> } = {
    nodes,
    links,
  };
  return (
    <main className="min-h-dvh bg-neutral-950 text-white">
      <div className="p-4 border-b border-white/10">Knowledge Graph</div>
      <GraphClient data={data} />
    </main>
  );
}
