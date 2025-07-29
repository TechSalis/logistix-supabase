import { getSupabaseAnonClient } from "../../../../core/db/supabase_client.ts";

export async function saveFCMToken(
    fcm_token: string,
    user_id: string,
    token: string,
) {
    return await getSupabaseAnonClient(token).from("fcm_tokens").upsert({
        fcm_token,
        user_id,
    });
}

export async function deleteFCMToken(
    fcm_token: string,
    user_id: string,
    token: string,
) {
    return await getSupabaseAnonClient(token).from("fcm_tokens").delete()
        .eq("fcm_token", fcm_token).eq("user_id", user_id);
}

export async function getFCMTokens(
    user_ids: string[],
    token: string,
    limit?: number,
) {
    let query = getSupabaseAnonClient(token).from("fcm_tokens").select(
        "fcm_token",
    ).in("user_id", user_ids).order("created_at", { ascending: false });

    if (limit) query = query.limit(limit);

    return await query;
}

export async function getFCMToken(
    user_id: string,
    token: string,
) {
    const query = await getSupabaseAnonClient(token).from("fcm_tokens").select(
        "fcm_token",
    ).eq("user_id", user_id).order("created_at", { ascending: false }).limit(1);

    return { ...query, token: query.data?.[0].fcm_token };
}
