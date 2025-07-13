import { handleRequest } from "@core/lib/handle_request.ts";
import { badRequest, internalServerError } from "@core/functions/http.ts";
import validateCoordinates from "@core/utils/validators/coordinates_validator.ts";
import { Coordinates } from "@core/utils/types.ts";
import { findNearestRiders } from "@features/riders/services/riders_service.ts";

export const urlPathPattern = "/nearest";

//?lat=:lat&lng=:lng"
export default handleRequest(async ({ params, token }) => {
  const validation = validateCoordinates(
    params.queryParams?.lat,
    params.queryParams?.lng,
  );
  if (!validation.valid) {
    return badRequest(validation.error);
  }

  const coordinates: Coordinates = {
    lat: Number(params.queryParams!.lat),
    lng: Number(params.queryParams!.lng),
  };
  try {
    const { riders, error } = await findNearestRiders(
      coordinates,
      token,
      Number(params.queryParams?.count ?? 1),
    );

    if (riders) return new Response(JSON.stringify(riders), { status: 200 });
    if (error) return internalServerError(error.message);
  } catch (err) {
    console.error("findNearestRider RPC failed:", err);
  }
  return internalServerError();
});
