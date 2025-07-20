import { internalServerError } from "@core/functions/http.ts";
import { handleAuthSignup } from "@features/auth/helpers/handle_sign_up.ts";
import { upgradeAnonymousUser } from "@features/auth/services/auth_service.ts";
import { authAnonymousUpgrade } from "../index.ts";
import { error } from "@core/utils/logger.ts";

export async function execute(req: Request) {
  try {
    const response = await handleAuthSignup(req, upgradeAnonymousUser);
    if (response) return response;
  } catch (err) {
    error(`${authAnonymousUpgrade} error:`, { error: err });
  }
  return internalServerError();
}
