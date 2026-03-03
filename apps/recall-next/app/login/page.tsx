import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function LoginPage() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return (
      <main className="min-h-dvh grid place-items-center p-8 bg-neutral-950 text-white">
        <div className="max-w-md w-full space-y-6 text-center">
          <h1 className="text-3xl font-semibold">Recall</h1>
          <p className="text-neutral-400">Set Supabase env vars to enable authentication.</p>
        </div>
      </main>
    );
  }
  const supabase = createSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (session) redirect("/dashboard");

  const origin = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const callbackUrl = `${origin}/auth/callback`;

  async function signIn() {
    "use server";
    const supa = createSupabaseServerClient();
    const { error } = await supa.auth.signInWithOAuth({
      provider: "twitter",
      options: {
        redirectTo: callbackUrl,
        skipBrowserRedirect: false,
      },
    });
    if (error) {
      console.error(error);
    }
    // redirect happens automatically
  }

  return (
    <main className="min-h-dvh grid place-items-center p-8 bg-neutral-950 text-white">
      <div className="max-w-md w-full space-y-6 text-center">
        <h1 className="text-3xl font-semibold">Recall</h1>
        <p className="text-neutral-400">
          A unified second brain. Sign in to start collecting and recalling.
        </p>
        <form action={signIn}>
          <button className="inline-flex items-center gap-2 rounded-md bg-white/10 hover:bg-white/20 px-4 py-2 transition">
            <svg width="18" height="18" viewBox="0 0 24 24" className="opacity-80"><path fill="currentColor" d="M23 3c-.8.4-1.7.6-2.6.8c.9-.6 1.6-1.4 1.9-2.5c-.9.6-1.9 1-3 1.3C17.5 1.6 16.3 1 15 1c-2.6 0-4.7 2.1-4.7 4.7c0 .4 0 .8.1 1.1C6.7 6.6 3.6 4.9 1.5 2.3c-.5.8-.8 1.7-.8 2.8c0 1.7.9 3.2 2.2 4.1c-.7 0-1.4-.2-2-.5v.1c0 2.4 1.7 4.4 4 4.9c-.4.1-.8.2-1.2.2c-.3 0-.6 0-.8-.1c.6 2 2.5 3.5 4.7 3.5c-1.7 1.3-3.8 2-6.1 2c-.4 0-.8 0-1.2-.1C2.3 21.4 5 22 7.9 22C15 22 19.4 16 19.4 10.3v-.6C20.3 8.9 21.2 8 22 7c-.8.4-1.7.6-2.6.8c.9-.6 1.6-1.4 1.9-2.5"/></svg>
            Sign in with X (Twitter)
          </button>
        </form>
        <p className="text-xs text-neutral-500">
          By continuing you agree to our{" "}
          <Link className="underline" href="/terms">Terms</Link> and{" "}
          <Link className="underline" href="/privacy">Privacy</Link>.
        </p>
      </div>
    </main>
  );
}
