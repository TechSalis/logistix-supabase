import { getSupabaseAnonClient } from "../../../../core/db/supabase_client.ts";
import { FCMData, FCMNotification } from "../utils/fcm.ts";
import { sendFcmNotification } from "./fcm_service.ts";

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

export async function getFCMToken(
    user_id: string,
    token: string,
) {
    const query = await getSupabaseAnonClient(token).from("fcm_tokens").select(
        "fcm_token",
    ).eq("user_id", user_id).order("created_at", { ascending: false }).limit(1);

    if (query.error) return query;
    return { fcm_token: query.data.at(0)!.fcm_token, error: null };
}

// export async function getFCMTokens(
//     user_ids: string[],
//     token: string,
//     limit?: number,
// ) {
//     let query = getSupabaseAnonClient(token).from("fcm_tokens").select(
//         "fcm_token",
//     ).in("user_id", user_ids).order("created_at", { ascending: false });

//     if (limit) query = query.limit(limit);

//     return await query;
// }

export async function sendFcmNotificationToUser(
    user_id: string,
    message: { notification: FCMNotification; data?: FCMData },
    token: string,
    thread_id?: string,
) {
    const fcm = await getFCMToken(user_id, token);

    if (fcm.error) return { error: fcm.error, success: false };

    return sendFcmNotification(fcm.fcm_token, message, thread_id);
}
