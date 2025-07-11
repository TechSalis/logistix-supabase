import { ValidatorResponse } from "../../../core/utils/types.ts";

export default function validateAuthLoginInput(email: unknown, password: unknown, role?: unknown): ValidatorResponse {

    if (email == null || password == null) {
        return { valid: false, error: 'Email and password are required.' };
    } else if (typeof email !== 'string' || typeof password !== 'string' || (role !== undefined && typeof role !== 'string')) {
        return { valid: false, error: 'Email, password, and role must be strings.' };
    }

    // Basic email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return { valid: false, error: 'Invalid email format.' };
    }
    if (password.length < 6) {
        return { valid: false, error: 'Password must be at least 6 characters long.' };
    }
    return { valid: true };
}