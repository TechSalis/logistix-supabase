import { internalServerError } from "@core/functions/http.ts";
import { logout } from "@features/auth/services/auth_service.ts";
import { authLogoutPattern } from "../index.ts";
import { handleRequest } from "@core/utils/handle_request.ts";

export default handleRequest(async ({ token }) => {
  try {
    const response = await logout(token);

    return Response.json(
      response.error ?? { message: "Success" },
      { status: response.error?.status ?? 200 },
    );
  } catch (err) {
    console.error(authLogoutPattern, "error:", err);
  }
  return internalServerError();
});
