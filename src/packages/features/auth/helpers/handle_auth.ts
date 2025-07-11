import { AuthError } from "https://esm.sh/@supabase/auth-js@2.70.0/dist/module/index.d.ts";
import { UserRole } from "../../../core/db/types.ts";
import {
    badRequest,
    internalServerError,
} from "../../../core/functions/http.ts";
import { LoginParams, LoginResponse } from "../services/auth_service.ts";
import validateAuthLoginInput from "../validators/auth_validator.ts";
import { mapSession, mapUser } from "./auth_interface.ts";

export async function handleAuth(
    req: Request,
    service: (login: LoginParams) => Promise<LoginResponse>,
) {
    const json = await req.json() as Record<string, unknown>;
    const { email, password, role } = json;

    const validationError = validateAuthLoginInput(email, password, role);
    if (!validationError.valid) {
        return badRequest(validationError.error);
    }

    const authService = await service({
        email: email as string,
        password: password as string,
        role: role as UserRole,
    });
    const response = handleAuthResponse({
        user: authService.user,
        session: authService.session,
        error: authService.error,
    });
    return response || internalServerError();
}

function handleAuthResponse(auth: {
    user: Record<string, unknown> | undefined;
    session?: Record<string, unknown> | undefined;
    error: AuthError | null;
}) {
    if (auth.error) {
        return new Response(auth.error.code as string, {
            status: auth.error.status as number,
        });
    }
    if (auth.user) {
        const user = mapUser(auth.user as Record<string, unknown>);
        const session = auth.session
            ? mapSession(auth.session as Record<string, unknown>)
            : null;

        return new Response(JSON.stringify({ user, session }), { status: 200 });
    }
}
