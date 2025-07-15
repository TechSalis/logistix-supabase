import { internalServerError } from "@core/functions/http.ts";
import { handleAuthSignup } from "../../../src/features/auth/helpers/handle_sign_up.ts";
import { signupWithPassword } from "@features/auth/services/auth_service.ts";
import { authSignupPattern } from "../index.ts";


export async function execute(req: Request) {
  try {
    const response = await handleAuthSignup(req, signupWithPassword);
    if (response) return response;
  } catch (err) {
    console.error(authSignupPattern, "error:", err);
  }
  return internalServerError();
}
