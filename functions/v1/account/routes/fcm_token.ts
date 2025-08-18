import { badRequest, internalServerError, notFound } from "@core/functions/http.ts";
import { validateFcmToken } from "@features/account/services/fcm_service.ts";
import { saveFCMToken, deleteFCMToken } from "@features/account/services/notification_service.ts";
import { verifyRequestAuthThen } from "@core/utils/handle_request.ts";
import { fcmToken } from "../index.ts";
import { error } from "@core/utils/logger.ts";
import { PostgrestSingleResponse } from "https://esm.sh/@supabase/postgrest-js@1.19.4/dist/cjs/types.js";

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
    error(`${fcmToken} validation error:`, userId, { error: err });
    return internalServerError();
  }

  try {
    let response: PostgrestSingleResponse<null>;
    switch (req.method) {
      case "POST":
        response = await saveFCMToken(fcm_token, userId, token);
        break;
      case "DELETE":
        response = await deleteFCMToken(fcm_token, userId, token);
        break;
      default:
        return notFound();
    }

    if (response.error) {
      error(`${fcmToken} response error:`, userId, {
        error: response.error,
      });

      return Response.json(
        response.error ,
        { status: response.status },
      );
    }

    return Response.json(
      response.data ?? { message: "Success" },
      { status: 200 },
    );
  } catch (err) {
    error(`${fcmToken} error:`, userId, { error: err });
  }
  return internalServerError();
});
