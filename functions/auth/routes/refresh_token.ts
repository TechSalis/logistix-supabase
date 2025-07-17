import { badRequest, internalServerError } from "@core/functions/http.ts";
import { authRefreshToken } from "../index.ts";
import { refreshToken } from "@features/auth/services/auth_service.ts";
import { handleRequest } from "@core/utils/handle_request.ts";

export default handleRequest(async ({ req, token }) => {
  try {
    try {
      var { refresh_token } = await req.json() as Record<string, unknown>;
    } catch (_) {
      return badRequest();
    }

    if (
      refresh_token == undefined || refresh_token == null ||
      typeof refresh_token !== "string" || refresh_token == "null" ||
      refresh_token.length == 0
    ) {
      return badRequest("A valid refresh_token is required");
    }

    const response = await refreshToken(token, refresh_token as string);
    return Response.json(
      response.error ?? response.session,
      { status: response.error?.status ?? 200 },
    );
  } catch (err) {
    console.error(authRefreshToken, "error:", err);
  }
  return internalServerError();
});
