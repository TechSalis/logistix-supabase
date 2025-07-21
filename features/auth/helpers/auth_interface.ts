import { AuthError } from "https://esm.sh/@supabase/supabase-js@2";
import { jsonResponseMessage } from "../../../../core/functions/http.ts";
import { UserRole } from "../../../../core/db/types.ts";

export type UserResponse = {
    id: string;
    is_anonymous: boolean;
    user_metadata: UserMetadata;
};

export type UserMetadata = {
    role?: UserRole;
    name?: string;
    email?: string;
    phone?: string;
    image_url?: string;
};

// Map raw user and session into reusable entities
export function mapUser(rawUser: Record<string, unknown>): UserResponse {
    return {
        id: rawUser.id as string,
        is_anonymous: rawUser.is_anonymous as boolean,
        user_metadata: rawUser.user_metadata as UserMetadata,
    };
}

export type SessionResponse = {
    refresh_token: string;
    access_token: string;
    expires_at?: number;
};

export function mapSession(
    rawSession: Record<string, unknown>,
): SessionResponse {
    return {
        refresh_token: rawSession.refresh_token as string,
        access_token: rawSession.access_token as string,
        expires_at: rawSession.expires_at as number,
    };
}

export function mapAuthResponse(auth: {
    user: Record<string, unknown> | undefined;
    session?: Record<string, unknown> | undefined;
    error: AuthError | null;
}) {
    if (auth.error) {
        return jsonResponseMessage(
            auth.error.message as string,
            auth.error.status as number,
        );
    }
    if (auth.user) {
        const user = mapUser(auth.user as Record<string, unknown>);
        const session = auth.session
            ? mapSession(auth.session as Record<string, unknown>)
            : null;

        return Response.json({ user, session }, { status: 200 });
    }
}
