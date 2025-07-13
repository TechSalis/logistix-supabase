import { internalServerError } from "@core/functions/http.ts";
import { loginAnonymously } from "@features/auth/services/auth_service.ts";
import { mapAuthResponse } from "../../../src/features/auth/helpers/auth_interface.ts";

export const urlPathPattern = "/anonymous/login";

export async function execute(_: Request) {
  try {
    const authService = await loginAnonymously();

    const response = mapAuthResponse({
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
