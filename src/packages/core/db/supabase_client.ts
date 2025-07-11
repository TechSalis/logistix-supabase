import {
  createClient,
  SupabaseClient,
} from "https://esm.sh/@supabase/supabase-js@2";

let client: SupabaseClient | null = null;
export function getSupabaseAnonClient(accessToken?: string): SupabaseClient {
  if (client && !accessToken) return client;
  const _client = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    {
      auth: { debug: true, persistSession: false, autoRefreshToken: false },
      global: accessToken
        ? {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
        : {},
    },
  );
  if (!accessToken) client = _client;
  return _client;
}
