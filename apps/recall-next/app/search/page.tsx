import { hybridSearch } from "@/app/actions/items";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const q = searchParams.q ?? "";
  const results: Array<{ id: string; title: string | null; original_url: string | null; source: string; created_at: string }> = q ? await hybridSearch(q as string) : [];
  return (
    <main className="min-h-dvh p-6 bg-neutral-950 text-white">
      <form className="max-w-2xl">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search anything..."
          className="w-full rounded border border-white/10 bg-white/5 px-4 py-3"
        />
      </form>
      <section className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((r) => (
          <a key={r.id} href={r.original_url ?? "#"} target="_blank" className="rounded-xl border border-white/10 p-4 bg-white/[0.03] hover:bg-white/[0.06] transition">
            <div className="text-xs text-neutral-400">{r.source}</div>
            <div className="mt-1 font-medium">{r.title ?? r.original_url}</div>
            <div className="text-xs text-neutral-500 mt-1">{new Date(r.created_at).toLocaleString()}</div>
          </a>
        ))}
      </section>
    </main>
  );
}
