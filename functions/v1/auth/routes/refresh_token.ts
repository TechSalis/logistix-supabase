import { badRequest, internalServerError } from "@core/functions/http.ts";
import { authRefreshToken } from "../index.ts";
import { refreshToken } from "@features/auth/services/auth_service.ts";
import { verifyRequestAuthThen } from "@core/utils/handle_request.ts";
import { error } from "@core/utils/logger.ts";

export default verifyRequestAuthThen(async ({ userId, req, token }) => {
  try {
    try {
      var { refresh_token } = await req.json() as Record<string, unknown>;
    } catch (_) {
      error(`${authRefreshToken} json error:`, userId);
      return badRequest();
    }

    if (
      refresh_token == undefined || refresh_token == null ||
      typeof refresh_token !== "string" || refresh_token == "null" ||
      refresh_token.length == 0
    ) {
      error(`${authRefreshToken} validation error:`, userId, {
        error: "A valid refresh_token is required",
      });
      return badRequest("A valid refresh_token is required");
    }

    const response = await refreshToken(token, refresh_token as string);

    if (response.error) {
      error(`${authRefreshToken} response error:`, userId, {
        error: response.error,
      });
    }

    return Response.json(
      response.error ?? response.session,
      { status: response.error?.status ?? 200 },
    );
  } catch (err) {
    error(`${authRefreshToken} error:`, userId, { error: err });
  }
  return internalServerError();
});
