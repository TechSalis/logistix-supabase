import { badRequest, internalServerError } from "@core/functions/http.ts";
import { validateFcmToken } from "@features/account/services/fcm_service.ts";
import { saveFCMToken } from "@features/account/services/account_service.ts";
import { verifyRequestAuthThen } from "@core/utils/handle_request.ts";
import { saveFcmToken } from "../index.ts";
import { error } from "@core/utils/logger.ts";

export default verifyRequestAuthThen(async ({ req, userId, token }) => {
  try {
    var { fcm_token } = await req.json();

    if (fcm_token == undefined || fcm_token == null) {
      return badRequest("fcm_token is required");
    }
    if (typeof fcm_token !== "string" || !await validateFcmToken(fcm_token)) {
      return badRequest("fcm_token is invalid");
    }
  } catch (err) {
    error(`${saveFcmToken} validation error:`, { error: err });
    return internalServerError();
  }

  try {
    const response = await saveFCMToken(fcm_token, userId, token);

    if (response.error) {
      error(`${saveFcmToken} response error:`, { error: response.error });
    }

    return Response.json(
      response.error ? response.error : response.data ?? { message: "Success" },
      {
        status: response.status,
      },
    );
  } catch (err) {
    error(`${saveFcmToken} error:`, { error: err });
  }
  return internalServerError();
});
