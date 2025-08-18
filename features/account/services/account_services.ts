import { getSupabaseAnonClient } from "../../../../core/db/supabase_client.ts";

export async function getUserProfile(
    user_id: string,
    token: string,
) {
    return await getSupabaseAnonClient(token).from("profiles").select().eq(
        "user_id",
        user_id,
    ).single();
}
