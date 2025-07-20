import { internalServerError } from "@core/functions/http.ts";
import { logout } from "@features/auth/services/auth_service.ts";
import { authLogoutPattern } from "../index.ts";
import { verifyRequestAuthThen } from "@core/utils/handle_request.ts";
import { error } from "@core/utils/logger.ts";

export default verifyRequestAuthThen(async ({ token }) => {
  try {
    const response = await logout(token);

    if (response.error) {
      error(`${authLogoutPattern} response error:`, { error: response.error });
    }
    
    return Response.json(
      response.error ?? { message: "Success" },
      { status: response.error?.status ?? 200 },
    );
  } catch (err) {
    error(`${authLogoutPattern} error:`, { error: err });
  }
  return internalServerError();
});
