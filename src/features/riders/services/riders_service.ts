import PostgrestError from "https://esm.sh/@supabase/postgrest-js@1.19.4/dist/cjs/PostgrestError.js";
import { getSupabaseAnonClient } from "../../../core/db/supabase_client.ts";
import { Coordinates } from "../../../core/utils/types.ts";

export interface Rider {
  id: string;
  name: string;
  phone: string;
  coordinates: Coordinates;
}

export async function findNearestRiders(
  userCoordinates: Coordinates,
  token: string,
  count: number = 1,
): Promise<{ riders?: Rider[], error?: PostgrestError }> {
  const { data, error } = await getSupabaseAnonClient(token).rpc(
    "fn_find_nearest_riders",
    {
      user_lat: userCoordinates.lat,
      user_lng: userCoordinates.lng,
    },
  ).limit(count);

  if (error) {
    console.error("Error finding nearest rider:", error);
    return { error };
  }
  return { riders: data };
}
