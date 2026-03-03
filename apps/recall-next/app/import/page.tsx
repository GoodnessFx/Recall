import { saveManualItem } from "@/app/actions/items";
import { revalidatePath } from "next/cache";

export default function ImportPage() {
  async function action(formData: FormData) {
    "use server";
    const url = formData.get("url") as string | null;
    const title = formData.get("title") as string | null;
    const text = formData.get("text") as string | null;
    await saveManualItem({ url: url || undefined, title: title || undefined, text: text || undefined });
    revalidatePath("/dashboard");
  }

  return (
    <main className="min-h-dvh p-6 bg-neutral-950 text-white">
      <h1 className="text-2xl font-semibold mb-4">Import</h1>
      <form action={action} className="grid gap-3 max-w-xl">
        <input name="url" placeholder="https://example.com" className="bg-white/5 border border-white/10 rounded px-3 py-2" />
        <input name="title" placeholder="Title (optional)" className="bg-white/5 border border-white/10 rounded px-3 py-2" />
        <textarea name="text" placeholder="Notes / text" rows={6} className="bg-white/5 border border-white/10 rounded px-3 py-2" />
        <button className="self-start rounded bg-white/10 hover:bg-white/20 px-4 py-2">Save</button>
      </form>
      <section className="mt-8">
        <h2 className="font-medium mb-2">Bookmarklet</h2>
        <p className="text-sm text-neutral-400 mb-2">Drag this to your bookmarks bar and click on any page.</p>
        <a
          className="inline-block rounded bg-white/10 hover:bg-white/20 px-3 py-1.5 text-sm"
          href={
            "javascript:(function(){window.open('" +
            (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000") +
            "/import?url='+encodeURIComponent(location.href),'_blank');})();"
          }
        >
          Save to Recall
        </a>
      </section>
      <section className="mt-8">
        <h2 className="font-medium mb-2">Upload Media</h2>
        <form action="/api/upload" method="POST" encType="multipart/form-data" className="grid gap-3 max-w-xl">
          <input type="file" name="file" accept="image/*,video/*" className="bg-white/5 border border-white/10 rounded px-3 py-2" />
          <button className="self-start rounded bg-white/10 hover:bg-white/20 px-4 py-2">Upload</button>
        </form>
        <p className="text-sm text-neutral-500 mt-2">Uploads are stored in Supabase Storage and added to your feed.</p>
      </section>
    </main>
  );
}
