import { badRequest, internalServerError } from "@core/functions/http.ts";
import { loginAnonymously } from "@features/auth/services/auth_service.ts";
import { mapAuthResponse } from "../../../src/features/auth/helpers/auth_interface.ts";
import { authAnonymousLogin } from "../index.ts";
import { isUserRole, UserRole } from "@core/db/types.ts";

export async function execute(req: Request) {
  try {
    try {
      var { role } =  await req.json() as Record<string, unknown>;
    } catch (_) {
      return badRequest();
    }

    if (!isUserRole(role)) {
      return badRequest("User role is invalid.");
    }

    const authService = await loginAnonymously(role as UserRole);

    const response = mapAuthResponse({
      user: authService.user,
      session: authService.session,
      error: authService.error,
    });

    if (response) return response;
  } catch (err) {
    console.error(authAnonymousLogin, "error:", err);
  }
  return internalServerError();
}
