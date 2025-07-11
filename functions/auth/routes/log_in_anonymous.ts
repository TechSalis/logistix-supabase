import { internalServerError } from "@core/functions/http.ts";
import { handleAuth } from "@features/auth/helpers/handle_auth.ts";
import { loginAnonymously } from "@features/auth/services/auth_service.ts";

export const urlPathPattern = '/anonymous/login';

export async function execute(req: Request) {
    try {
        const response = await handleAuth(req, (_) => loginAnonymously());
        if (response) return response;
    } catch (err) {
        console.error(urlPathPattern, "error:", err);
    }
    return internalServerError();
}
