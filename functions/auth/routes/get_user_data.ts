import { internalServerError } from "@core/functions/http.ts";
import { getUserFromToken } from "@features/auth/services/auth_service.ts";
import { authUserPattern } from "../index.ts";
import { handleRequest } from "@core/utils/handle_request.ts";

export default handleRequest(async ({ token }) => {
  try {
    const response = await getUserFromToken(token);

    return Response.json(
      response.error ?? { message: "Success" },
      { status: response.error?.status ?? 200 },
    );
  } catch (err) {
    console.error(authUserPattern, "error:", err);
  }
  return internalServerError();
});
