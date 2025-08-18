import { verifyRequestAuthThen } from "@core/utils/handle_request.ts";
import { badRequest, internalServerError } from "@core/functions/http.ts";
import { getRiderPattern } from "../index.ts";
import { error as consoleError } from "@core/utils/logger.ts";
import validateId from "@core/utils/validators/uuid_validator.ts";
import { getRider } from "@features/riders/services/riders_service.ts";

export default verifyRequestAuthThen(async ({ params, userId, token }) => {
  try {
    const user_id = params.pathParams.user_id;

    const validation = validateId(user_id);
    if (!validation.valid) {
      consoleError(`${getRiderPattern} validation error`, userId, {
        validation,
      });
      return badRequest(`Invalid user ID: ${user_id}`);
    }

    const response = await getRider(user_id, token);

    if (response.error) {
      consoleError(`${getRiderPattern} reponse`, userId, {
        response,
      });
      return Response.json(response.error, { status: response.status });
    }

    return Response.json(response.data, { status: response.status });
  } catch (err) {
    consoleError(`${getRiderPattern}`, userId, { error: err });
  }
  return internalServerError();
});
