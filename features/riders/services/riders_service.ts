import { getSupabaseAnonClient } from "../../../../core/db/supabase_client.ts";
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

export function acceptOrder(
  order_id: string,
  token: string,
) {
  return getSupabaseAnonClient(token).from("orders")
    .update({ status: "accepted" }).eq("order_id", order_id);
}
