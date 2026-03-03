"use server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

async function getTwitterAccessToken() {
  const supabase = createSupabaseServerClient();
  const { data: sessionData } = await supabase.auth.getSession();
  // provider_token may exist depending on provider config
  const token = (sessionData.session as unknown as { provider_token?: string })?.provider_token;
  return token;
}

export async function syncXBookmarks() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const accessToken = await getTwitterAccessToken();
  if (!accessToken) {
    return { ok: false, error: "Missing X access token" };
  }

  // Pull x_user_id from profile or /2/users/me
  let x_user_id: string | null = null;
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, x_user_id")
    .eq("user_id", user.id)
    .maybeSingle();
  x_user_id = profile?.x_user_id ?? null;

  if (!x_user_id) {
    const meRes = await fetch("https://api.twitter.com/2/users/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (meRes.ok) {
      const me = await meRes.json();
      x_user_id = me.data?.id;
      if (x_user_id) {
        await supabase
          .from("profiles")
          .upsert({ user_id: user.id, x_user_id }, { onConflict: "user_id" });
      }
    }
  }

  if (!x_user_id) return { ok: false, error: "Unable to resolve X user id" };

  // Fetch bookmarks with pagination
  let paginationToken: string | undefined = undefined;
  let imported = 0;
  for (let i = 0; i < 20; i++) {
    const url = new URL(`https://api.twitter.com/2/users/${x_user_id}/bookmarks`);
    url.searchParams.set("max_results", "100");
    if (paginationToken) url.searchParams.set("pagination_token", paginationToken);
    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (res.status === 403) break;
    if (!res.ok) break;
    const json: unknown = await res.json();
    const j = json as {
      data?: Array<Record<string, unknown>>;
      includes?: {
        tweets?: Array<{ id: string } & Record<string, unknown>>;
        users?: Array<{ id: string } & Record<string, unknown>>;
      };
      meta?: { next_token?: string };
    };
    const tweets: Array<Record<string, unknown>> = j?.data ?? [];
    // includes are available if needed in future:
    // const incTweets: Array<{ id: string } & Record<string, unknown>> = j?.includes?.tweets ?? [];
    // const incUsers: Array<{ id: string } & Record<string, unknown>> = j?.includes?.users ?? [];

    for (const t of tweets) {
      const text = (t?.text as string | undefined) ?? "";
      const id = (t?.id as string | undefined) ?? "";
      const title = text.slice(0, 160) || "Tweet";
      const url = `https://x.com/i/web/status/${id}`;
      await supabase
        .from("saved_items")
        .upsert(
          {
            user_id: user.id,
            source: "x",
            original_url: url,
            title,
            text_content: text || null,
            raw_json: t,
          },
          { onConflict: "user_id,original_url" }
        )
        .throwOnError();
      imported++;
    }
    paginationToken = j?.meta?.next_token;
    if (!paginationToken) break;
    await new Promise((r) => setTimeout(r, 500)); // be gentle
  }
  return { ok: true, imported };
}
