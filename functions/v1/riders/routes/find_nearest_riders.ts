import { verifyRequestAuthThen } from "@core/utils/handle_request.ts";
import { badRequest, internalServerError } from "@core/functions/http.ts";
import validateCoordinates from "@core/utils/validators/coordinates_validator.ts";
import { Coordinates } from "@core/utils/types.ts";
import { findNearestRiders } from "@features/riders/services/riders_service.ts";
import { findNearestRidersPattern } from "../index.ts";
import { error as consoleError } from "@core/utils/logger.ts";


export default verifyRequestAuthThen(async ({ userId, params, token }) => {
  const validation = validateCoordinates(
    params.queryParams?.lat,
    params.queryParams?.lng,
  );
  if (!validation.valid) {
    consoleError(`${findNearestRidersPattern} error`, userId, {
      error: validation.error,
    });
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

    if (riders) return Response.json(riders, { status: 200 });
    if (error) {
      consoleError(`${findNearestRidersPattern} reponse`, userId, {
        error,
      });
      return Response.json(error, { status: 500 });
    }
  } catch (err) {
    consoleError(`${findNearestRidersPattern}`, userId, { error: err });
  }
  return internalServerError();
});
