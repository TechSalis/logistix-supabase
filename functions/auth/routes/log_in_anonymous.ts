import { internalServerError } from "@core/functions/http.ts";
import { loginAnonymously } from "@features/auth/services/auth_service.ts";
import { handleAuthResponse } from "@features/auth/helpers/handle_auth.ts";

export const urlPathPattern = "/anonymous/login";

export async function execute(_: Request) {
  try {
    const authService = await loginAnonymously();

    const response = handleAuthResponse({
      user: authService.user,
      session: authService.session,
      error: authService.error,
    });

    if (response) return response;
  } catch (err) {
    console.error(urlPathPattern, "error:", err);
  }
  return internalServerError();
}
