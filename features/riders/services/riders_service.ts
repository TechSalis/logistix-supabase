import { getSupabaseAnonClient } from "../../../../core/db/supabase_client.ts";
import { OrderStatus } from "../../../../core/db/types.ts";
import type { Coordinates } from "../../../../core/utils/types.ts";

export function findNearestRiders(
  userCoordinates: Coordinates,
  token: string,
  count: number = 1,
) {
  return getSupabaseAnonClient(token).rpc(
    "fn_find_nearest_riders",
    {
      user_lat: userCoordinates.lat,
      user_lng: userCoordinates.lng,
    },
  ).limit(count);
}

export async function acceptDelivery(
  rider_id: string,
  order_id: string,
  token: string,
) {
  const user_id = await getSupabaseAnonClient(token).from("orders")
    .select("user_id").eq("order_id", order_id).single();

  return getSupabaseAnonClient(token).from("orders_status")
    .insert({
      order_id,
      rider_id,
      user_id: user_id.data?.user_id,
      status: OrderStatus.Accepted,
    });
}
