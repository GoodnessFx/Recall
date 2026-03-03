export const dynamic = "force-dynamic";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import Link from "next/link";
import Image from "next/image";

export default async function DashboardPage() {
  const supabase = createSupabaseServerClient();

  const { data: items } = await supabase
    .from("saved_items")
    .select("id, title, original_url, created_at")
    .order("created_at", { ascending: false })
    .limit(30);

  return (
    <main className="min-h-dvh bg-neutral-950 text-white">
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <Image src="/icons/recall.svg" alt="Recall" width={24} height={24} />
          <h1 className="text-lg font-semibold">Recall</h1>
          <nav className="ml-6 flex gap-4 text-sm text-neutral-400">
            <Link className="hover:text-white" href="/dashboard">Home</Link>
            <Link className="hover:text-white" href="/search">Search</Link>
            <Link className="hover:text-white" href="/import">Import</Link>
          </nav>
        </div>
        <form action={signOut}>
          <button className="rounded-md bg-white/10 hover:bg-white/20 px-3 py-1.5 text-sm">Sign out</button>
        </form>
      </header>
      <section className="p-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items?.map((it) => (
          <a
            key={it.id}
            href={it.original_url ?? "#"}
            target="_blank"
            className="group rounded-xl border border-white/10 p-4 bg-white/[0.03] hover:bg-white/[0.06] transition"
          >
            <div className="text-sm text-neutral-400">
              {new Date(it.created_at as string).toLocaleString()}
            </div>
            <div className="mt-2 font-medium group-hover:underline">
              {it.title ?? it.original_url}
            </div>
          </a>
        ))}
        {!items?.length && (
          <div className="col-span-full text-center text-neutral-400 py-20">
            No items yet. <Link className="underline" href="/import">Import one</Link>
          </div>
        )}
      </section>
    </main>
  );
}

async function signOut() {
  "use server";
  const supabase = createSupabaseServerClient();
  await supabase.auth.signOut();
}
