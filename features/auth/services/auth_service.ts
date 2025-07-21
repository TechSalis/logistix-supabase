import { AuthError } from "https://esm.sh/@supabase/supabase-js@2";
import { getSupabaseAnonClient } from "../../../../core/db/supabase_client.ts";
import { UserRole } from "../../../../core/db/types.ts";
import { UserMetadata } from "../helpers/auth_interface.ts";

export type LoginParams = {
    email: string;
    password: string;
};
export type SignUpParams = {
    role: UserRole;
} & LoginParams;

export type LoginResponse = {
    user: Record<string, unknown> | undefined;
    session?: Record<string, unknown>;
    error: AuthError | null;
};

export async function loginAnonymously(
    role: UserRole,
): Promise<LoginResponse> {
    const response = await getSupabaseAnonClient().auth.signInAnonymously({
        options: { data: { role: role } },
    });

    return {
        error: response.error,
        user: { ...response.data.user },
        session: { ...response.data.session },
    };
}

export async function upgradeAnonymousUser(
    params: SignUpParams,
    data?: UserMetadata,
): Promise<LoginResponse> {
    const response = await getSupabaseAnonClient().auth.updateUser({
        email: params.email,
        password: params.password,
        data: { ...data, role: params.role },
    });
    return {
        error: response.error,
        user: { ...response.data.user },
    };
}

export async function signupWithPassword(
    params: SignUpParams,
    data?: UserMetadata,
): Promise<LoginResponse> {
    const response = await getSupabaseAnonClient().auth.signUp({
        email: params.email,
        password: params.password,
        options: { data: { ...data, role: params.role } },
    });

    return {
        error: response.error,
        user: { ...response.data.user },
        session: { ...response.data.session },
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
        user: { ...response.data.user },
        session: { ...response.data.session },
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
        user: { ...response.data.user },
        session: { ...response.data.session },
    };
}

export async function getUserFromToken(jwt: string) {
    const response = await getSupabaseAnonClient().auth.getUser(jwt);
    return { user: response.data.user, error: response.error };
}

export async function logout(token: string) {
    const response = await getSupabaseAnonClient(token).auth.signOut({
        scope: "local",
    });
    return { error: response.error };
}

export async function refreshToken(token: string, refresh_token: string) {
    const response = await getSupabaseAnonClient(token).auth.refreshSession(
        { refresh_token },
    );
    return { session: response.data.session, error: response.error };
}
