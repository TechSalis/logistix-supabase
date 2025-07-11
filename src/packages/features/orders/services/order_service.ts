import { getSupabaseAnonClient } from "../../../core/db/supabase_client.ts";
import { CreateOrder } from "../types.ts";

export async function createOrder(
  user_id: string,
  token: string,
  { pickup, dropoff, description, extras, order_type }: CreateOrder,
) {
  return await getSupabaseAnonClient(token).from("Orders").insert({
    user_id,
    pickup,
    dropoff,
    description,
    extras,
    order_type,
  } as CreateOrder);
}

export async function getOrders(
  token: string,
  userId: string,
  limit: number = 10,
  page: number = 0,
) {
  const response = await getSupabaseAnonClient(token).from("Orders")
    .select("ref_number,pickup,dropoff,description,order_type")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .range(page * limit, (page + 1) * limit);

  return response;
}

export async function getOrder(token: string, orderId: string) {
  return await getSupabaseAnonClient(token).from("Orders")
    .select().eq("order_id", orderId).single();
}
