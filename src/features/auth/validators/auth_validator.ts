import { ValidatorResponse } from "../../../core/utils/types.ts";
import { isUserRole } from "../../../core/db/types.ts";

export function validateAuthLoginInput(
    email: unknown,
    password: unknown,
): ValidatorResponse {
    if (email == null || password == null) {
        return {
            valid: false,
            error: "Email and password are required.",
        };
    } else if (
        typeof email !== "string" || typeof password !== "string"
    ) {
        return {
            valid: false,
            error: "Email and password must be strings.",
        };
    }

    let error: string = "";
    // Basic email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        error += "Invalid email format.";
    }
    if (error.length > 0) return { valid: false, error };
    return { valid: true };
}

export function validateAuthSignUpInput(
    email: unknown,
    password: unknown,
    role: unknown,
): ValidatorResponse {
    if (
        email == null || email == undefined || password == null ||
        password == undefined || role == null || role == undefined
    ) {
        return {
            valid: false,
            error: "Email, password and role are required.",
        };
    } else if (
        typeof email !== "string" || typeof password !== "string" ||
        typeof role !== "string"
    ) {
        return {
            valid: false,
            error: "Email, password and role must be strings.",
        };
    }

    let error: string = "";
    // Basic email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        error += "Invalid email format.";
    }
    if (password.length < 6) {
        error += " Password must be at least 6 characters long.";
    }
    if (!isUserRole(role)) {
        error += " User role is invalid.";
    }
    if (error.length > 0) return { valid: false, error };
    return { valid: true };
}
