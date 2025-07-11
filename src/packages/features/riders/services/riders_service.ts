import { getSupabaseAnonClient } from "../../../core/db/supabase_client.ts";
import { Coordinates } from "../../../core/utils/types.ts";

export async function findNearestRider(userCoordinates: Coordinates, token: string) {
  const { data, error } = await getSupabaseAnonClient(token).rpc('find_nearest_riders', {
    user_lat: userCoordinates.lat,
    user_lng: userCoordinates.lng,
  });

  if (error) console.error("Error finding nearest rider:", error);
  return data;
}
