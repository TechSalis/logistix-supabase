import { getSupabaseAnonClient } from "../../../core/db/supabase_client.ts";

export async function saveFCMToken(
    fcm_token: string,
    user_id: string,
    token: string,
) {
    return await getSupabaseAnonClient(token).from("fcm_tokens").insert({
        fcm_token,
        user_id,
    });
}

export async function retrieveFCMTokens(
    user_ids: string[],
    token: string,
    limit?: number,
) {
    let query = getSupabaseAnonClient(token).from("fcm_tokens").select(
        "user_id,fcm_token",
    ).in("user_id", user_ids);

    if (limit) query = query.limit(limit);
    
    return await query;
}
