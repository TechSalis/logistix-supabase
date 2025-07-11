import { AuthError } from "https://esm.sh/@supabase/auth-js@2.70.0/dist/module/index.d.ts";
import { getSupabaseAnonClient } from "../../../core/db/supabase_client.ts";
import { UserRole } from "../../../core/db/types.ts";
import { UserMetadata } from "../helpers/auth_interface.ts";

export type LoginParams = {
    email: string;
    password: string;
    role?: UserRole;
};

export type LoginResponse = {
    user: Record<string, unknown> | undefined;
    session?: Record<string, unknown> | undefined;
    error: AuthError | null;
};

export async function loginAnonymously(): Promise<LoginResponse> {
    const response = await getSupabaseAnonClient().auth.signInAnonymously({
        options: { data: { role: "customer" as UserRole } },
    });

    return {
        error: response.error,
        user: response.data.user == null
            ? undefined
            : { ...response.data.user },
        session: response.data.session == null
            ? undefined
            : { ...response.data.session },
    };
}

export async function upgradeAnonymousUser(
    login: LoginParams,
): Promise<LoginResponse> {
    const response = await getSupabaseAnonClient().auth.updateUser({
        email: login.email,
        password: login.password,
    });
    return {
        error: response.error,
        user: response.data.user == null
            ? undefined
            : { ...response.data.user },
    };
}

export async function signupWithPassword(
    login: LoginParams,
    data?: UserMetadata,
): Promise<LoginResponse> {
    const response = await getSupabaseAnonClient().auth.signUp({
        email: login.email,
        password: login.password,
        options: {
            data: { ...data, role: (data?.role || "customer") as UserRole },
        },
    });

    return {
        error: response.error,
        user: response.data.user == null
            ? undefined
            : { ...response.data.user },
        session: response.data.session == null
            ? undefined
            : { ...response.data.session },
    };
}

export async function loginWithPassword(
    login: LoginParams,
): Promise<LoginResponse> {
    const response = await getSupabaseAnonClient().auth.signInWithPassword({
        email: login.email,
        password: login.password,
    });
    return {
        error: response.error,
        user: response.data.user == null
            ? undefined
            : { ...response.data.user },
        session: response.data.session == null
            ? undefined
            : { ...response.data.session },
    };
}

export async function loginWithSocialToken(
    provider: "google" | "facebook" | "apple",
    token: string,
): Promise<LoginResponse> {
    const response = await getSupabaseAnonClient().auth.signInWithIdToken({
        provider,
        token: token,
    });
    return {
        error: response.error,
        user: response.data.user == null
            ? undefined
            : { ...response.data.user },
        session: response.data.session == null
            ? undefined
            : { ...response.data.session },
    };
}

export async function getUserFromToken(jwt: string) {
    const response = await getSupabaseAnonClient().auth.getUser(jwt);
    return { user: response.data.user, error: response.error };
}
