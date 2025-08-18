import { UserRole } from "../../../../core/db/types.ts";
import {
    badRequest,
    internalServerError,
} from "../../../../core/functions/http.ts";
import { LoginResponse, SignUpParams } from "../services/auth_service.ts";
import { validateAuthSignUpInput } from "../validators/auth_validator.ts";
import { mapAuthResponse, UserMetadata } from "./auth_interface.ts";

export async function handleAuthSignup(
    req: Request,
    service: (
        params: SignUpParams,
        metadata?: UserMetadata,
    ) => Promise<LoginResponse>,
) {
    try {
        var { email, password, role, metadata } = await req.json();
    } catch (_) {
        return badRequest();
    }

    const validationError = validateAuthSignUpInput(email, password, role);
    if (!validationError.valid) {
        return badRequest(validationError.error);
    }

    const authService = await service({
        email: email as string,
        password: password as string,
        role: role as UserRole,
    }, metadata as UserMetadata | undefined);

    const response = mapAuthResponse({
        user: authService.user,
        session: authService.session,
        error: authService.error,
    });

    return response || internalServerError();
}
