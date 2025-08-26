import { getSupabaseAnonClient } from "../../../../core/db/supabase_client.ts";
import { OrderStatus } from "../../../../core/db/types.ts";
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
  } as CreateOrder).select("order_id,ref_number")
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
  let query = getSupabaseAnonClient(token).from("orders_view")
    .select("*")
    .order("created_at", { ascending: false })
    .range(page * limit, (page + 1) * limit - 1);

  if (userId) query = query.eq("user_id", userId);

  if (order_types && order_types.length > 0) {
    query = query.in("order_type", order_types);
  }
  // if (order_statuses && order_statuses?.length > 0) {
  //   query = query.in("order_status", order_statuses);
  // }
  return await query;
}

// export async function getLatestOrder(token: string, userId?: string) {
//   const query = getSupabaseAnonClient(token).from("Orders")
//     .select("order_id,ref_number,pickup,dropoff,description,order_type")
//     .eq("user_id", userId)
//     .order("created_at", { ascending: false })
//     .limit(1);
//   return await query;
// }

export async function getOrderByRefNumber(ref_number: string, token: string) {
  return await getSupabaseAnonClient(token).from("orders_view")
    .select()
    .eq("ref_number", ref_number)
    .limit(1);
}

export async function getOrderById(orderId: string, token: string) {
  return await getSupabaseAnonClient(token).from("orders_view")
    .select()
    .eq("order_id", orderId)
    .limit(1);
}

// export async function cancelOrderByRefNumber(orderId: string, token: string) {
//   return await getSupabaseAnonClient(token).from("orders")
//     .update({ "status": "cancelled" })
//     .eq("ref_number", orderId);
// }

export async function cancelOrderById(orderId: string, token: string) {
  return await getSupabaseAnonClient(token).from("orders_status")
    .update({ "status": "cancelled" })
    .eq("order_id", orderId);
}

export async function acceptOrder(
  rider_id: string,
  order_id: string,
  token: string,
) {
  const client = getSupabaseAnonClient(token);
  const getUser = await client.from("orders")
    .select("user_id").eq("order_id", order_id).single();

  if (getUser.error) return getUser;

  const insert = await client.from("orders_status")
    .insert({
      order_id,
      rider_id,
      user_id: getUser.data?.user_id,
      status: OrderStatus.accepted,
    });

  if (insert.error) return insert;

  return getUser;
}
