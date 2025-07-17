import { internalServerError } from "@core/functions/http.ts";
import { handleAuthSignup } from "../../../src/features/auth/helpers/handle_sign_up.ts";
import { upgradeAnonymousUser } from "@features/auth/services/auth_service.ts";
import { authAnonymousUpgrade } from "../index.ts";


export async function execute(req: Request) {
  try {
    const response = await handleAuthSignup(req, upgradeAnonymousUser);
    if (response) return response;
  } catch (err) {
    console.error(authAnonymousUpgrade, "error:", err);
  }
  return internalServerError();
}
