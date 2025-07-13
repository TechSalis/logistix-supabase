import { internalServerError } from "@core/functions/http.ts";
import { handleAuthLogin } from "../../../src/features/auth/helpers/handle_login.ts";
import { loginWithPassword } from "@features/auth/services/auth_service.ts";

export const urlPathPattern = "/login";

export async function execute(req: Request) {
  try {
    const response = await handleAuthLogin(req, loginWithPassword);
    if (response) return response;
  } catch (err) {
    console.error(urlPathPattern, "error:", err);
  }
  return internalServerError();
}
