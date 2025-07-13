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
  limit: number = 10,
  page: number = 0,
  orderTypes?: Array<string>,
  userId?: string,
) {
  let query = getSupabaseAnonClient(token).from("Orders")
    .select("ref_number,pickup,dropoff,description,order_type")
    .order("created_at", { ascending: false })
    .range(page * limit, (page + 1) * limit);

  if (userId) query = query.eq("user_id", userId);
  if (orderTypes && orderTypes?.length > 0) {
    console.log("order types:", orderTypes);
    query = query.in("order_type", orderTypes);
  }
  return await query;
}

export async function getOrderByRefNumber(orderId: string, token: string) {
  return await getSupabaseAnonClient(token).from("Orders")
    .select()
    .eq("ref_number", orderId)
    .limit(1);
}
export async function getOrderById(orderId: string, token: string) {
  return await getSupabaseAnonClient(token).from("Orders")
    .select()
    .eq("order_id", orderId)
    .limit(1);
}

export async function cancelOrderByRefNumber(orderId: string, token: string) {
  return await getSupabaseAnonClient(token).from("Orders")
    .update({ "status": "cancelled" })
    .eq("ref_number", orderId);
}
export async function cancelOrderById(orderId: string, token: string) {
  return await getSupabaseAnonClient(token).from("Orders")
    .update({ "status": "cancelled" })
    .eq("order_id", orderId);
}
