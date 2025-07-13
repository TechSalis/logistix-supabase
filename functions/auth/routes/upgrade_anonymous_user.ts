import { internalServerError } from "@core/functions/http.ts";
import { handleAuthSignup } from "../../../src/features/auth/helpers/handle_sign_up.ts";
import { upgradeAnonymousUser } from "@features/auth/services/auth_service.ts";

export const urlPathPattern = "/anonymous/upgrade";

export async function execute(req: Request) {
  try {
    const response = await handleAuthSignup(req, upgradeAnonymousUser);
    if (response) return response;
  } catch (err) {
    console.error(urlPathPattern, "error:", err);
  }
  return internalServerError();
}
