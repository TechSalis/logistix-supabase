import { internalServerError } from "@core/functions/http.ts";
import { handleAuth } from "@features/auth/helpers/handle_auth.ts";
import { signupWithPassword } from "@features/auth/services/auth_service.ts";

export const urlPathPattern = "/signup";

export async function execute(req: Request) {
  try {
    const response = await handleAuth(req, signupWithPassword);
    if (response) return response;
  } catch (err) {
    console.error(urlPathPattern, "error:", err);
  }
  return internalServerError();
}
