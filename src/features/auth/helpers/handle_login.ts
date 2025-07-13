import {
    badRequest,
    internalServerError,
} from "../../../core/functions/http.ts";
import { LoginParams, LoginResponse } from "../services/auth_service.ts";
import { validateAuthLoginInput } from "../validators/auth_validator.ts";
import { mapAuthResponse } from "./auth_interface.ts";

export async function handleAuthLogin(
    req: Request,
    service: (login: LoginParams) => Promise<LoginResponse>,
) {
    try {
        var json = await req.json() as Record<string, unknown>;
        var { email, password } = json;
    } catch (_) {
        return badRequest();
    }
    
    const validationError = validateAuthLoginInput(email, password);
    if (!validationError.valid) {
        return badRequest(validationError.error);
    }

    const authService = await service({
        email: email as string,
        password: password as string,
    });

    const response = mapAuthResponse({
        user: authService.user,
        session: authService.session,
        error: authService.error,
    });
    return response || internalServerError();
}
