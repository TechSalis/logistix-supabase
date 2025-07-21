import { internalServerError } from "@core/functions/http.ts";
import { getUserFromToken } from "@features/auth/services/auth_service.ts";
import { authUserPattern } from "../index.ts";
import { verifyRequestAuthThen } from "@core/utils/handle_request.ts";
import { error } from "@core/utils/logger.ts";

export default verifyRequestAuthThen(async ({ userId,token }) => {
  try {
    const response = await getUserFromToken(token);

    if (response.error) {
      error(`${authUserPattern} response error:`, userId,{ error: response.error });
    }

    return Response.json(
      response.error ?? { message: "Success" },
      { status: response.error?.status ?? 200 },
    );
    
  } catch (err) {
    error(`${authUserPattern}  error:`,userId, { error: err });
  }
  return internalServerError();
});
