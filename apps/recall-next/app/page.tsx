import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-dvh bg-neutral-950 text-white">
      <main className="mx-auto max-w-3xl p-8">
        <div className="flex items-center gap-3">
          <Image src="/next.svg" alt="logo" width={32} height={32} className="dark:invert" />
          <h1 className="text-2xl font-semibold">Recall</h1>
        </div>
        <p className="mt-4 text-neutral-400">
          Unified second brain. Import your saved content, auto-tag, and recall with AI.
        </p>
        <div className="mt-6 flex gap-3">
          <a href="/login" className="rounded bg-white/10 hover:bg-white/20 px-4 py-2">Sign in</a>
          <a href="/import" className="rounded border border-white/10 hover:bg-white/10 px-4 py-2">Import</a>
        </div>
      </main>
    </div>
  );
}
