import { getSupabaseAnonClient } from "../../../../core/db/supabase_client.ts";
import { Message } from "../types/message_types.ts";

export async function addMessage(message: Message, token: string) {
    return await getSupabaseAnonClient(token).from("messages").insert(message)
        .select('message_id')
    .single();
}
