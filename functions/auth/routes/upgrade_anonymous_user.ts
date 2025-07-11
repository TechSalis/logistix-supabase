import { internalServerError } from "@core/functions/http.ts";
import { handleAuth } from "@features/auth/helpers/handle_auth.ts";
import { upgradeAnonymousUser } from "@features/auth/services/auth_service.ts";

export const urlPathPattern = '/anonymous/upgrade';

export async function execute(req: Request) {
    try {
        const response = await handleAuth(req, upgradeAnonymousUser);
        if (response) return response;
    } catch (err) {
        console.error(urlPathPattern, "error:", err);
    }
    return internalServerError();
}
