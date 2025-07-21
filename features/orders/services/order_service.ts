import { getSupabaseAnonClient } from "../../../../core/db/supabase_client.ts";
import { CreateOrder } from "../types.ts";

export async function createOrder(
  user_id: string,
  token: string,
  { pickup, dropoff, description, extras, order_type }: CreateOrder,
) {
  return await getSupabaseAnonClient(token).from("orders").insert({
    user_id,
    pickup,
    dropoff,
    description,
    extras,
    order_type,
  } as CreateOrder).select("ref_number")
    .single();
}

export async function getOrders(
  token: string,
  limit: number = 10,
  page: number = 0,
  order_types?: Array<string>,
  // order_statuses?: Array<string>,
  userId?: string,
) {
  let query = getSupabaseAnonClient(token).from("orders")
    .select("ref_number,pickup,dropoff,description,order_type")
    .order("created_at", { ascending: false })
    .range(page * limit, (page + 1) * limit - 1);

  if (userId) query = query.eq("user_id", userId);
  if (order_types && order_types?.length > 0) {
    query = query.in("order_type", order_types);
  }
  // if (order_statuses && order_statuses?.length > 0) {
  //   query = query.in("order_status", order_statuses);
  // }
  return await query;
}

// export async function getLatestOrder(token: string, userId?: string) {
//   const query = getSupabaseAnonClient(token).from("Orders")
//     .select("ref_number,pickup,dropoff,description,order_type")
//     .eq("user_id", userId)
//     .order("created_at", { ascending: false })
//     .limit(1);
//   return await query;
// }

export async function getOrderByRefNumber(orderId: string, token: string) {
  return await getSupabaseAnonClient(token).from("orders")
    .select()
    .eq("ref_number", orderId)
    .limit(1);
}
export async function getOrderById(orderId: string, token: string) {
  return await getSupabaseAnonClient(token).from("orders")
    .select()
    .eq("order_id", orderId)
    .limit(1);
}

export async function cancelOrderByRefNumber(orderId: string, token: string) {
  return await getSupabaseAnonClient(token).from("orders")
    .update({ "status": "cancelled" })
    .eq("ref_number", orderId);
}
export async function cancelOrderById(orderId: string, token: string) {
  return await getSupabaseAnonClient(token).from("orders")
    .update({ "status": "cancelled" })
    .eq("order_id", orderId);
}
