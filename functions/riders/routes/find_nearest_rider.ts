import { handleRequest } from "@core/lib/handle_request.ts";
import { badRequest, internalServerError } from "@core/functions/http.ts";
import validateCoordinates from "@core/utils/validators/coordinates_validator.ts";
import { Coordinates } from "@core/utils/types.ts";
import { findNearestRider } from "@features/riders/services/riders_service.ts";

export const urlPathPattern = "/find-nearest?lat=:lat&lng=:lng";

export default handleRequest(async ({ params, token }) => {
  const validation = validateCoordinates(params.query?.lat, params.query?.lng);
  if (!validation.valid) {
    return badRequest(validation.error);
  }

  const coordinates: Coordinates = {
    lat: Number(params.query!.lat),
    lng: Number(params.query!.lng),
  };
  try {
    const rider = await findNearestRider(coordinates, token);
    return rider
      ? new Response(JSON.stringify(rider), { status: 200 })
      : internalServerError();
  } catch (err) {
    console.error("findNearestRider RPC failed:", err);
    return internalServerError();
  }
});
