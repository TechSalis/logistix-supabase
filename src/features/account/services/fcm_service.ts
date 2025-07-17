import { createJwt } from "../../../core/lib/jwt.ts";

const serviceAccount = JSON.parse(
    atob(Deno.env.get("GOOGLE_SERVICE_ACCOUNT")!),
);

let jwtCache: { token: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
    const now = Math.floor(Date.now() / 1000);
    if (jwtCache && now < jwtCache.expiresAt - 60) { // Add 60s buffer
        return jwtCache.token;
    }

    const payload = {
        iss: serviceAccount.client_email,
        scope: "https://www.googleapis.com/auth/firebase.messaging",
        aud: "https://oauth2.googleapis.com/token",
        iat: now,
        exp: now + 3600,
    };

    const jwt = await createJwt(payload, serviceAccount.private_key as string);
    const response = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
            assertion: jwt,
        }),
    });

    const tokenJson = await response.json();

    jwtCache = {
        token: tokenJson.access_token,
        expiresAt: payload.exp,
    };

    return tokenJson.access_token;
}

const url = "https://fcm.googleapis.com/v1/projects/logistix-83bee";

export async function validateFcmToken(token: string): Promise<boolean> {
    const accessToken = await getAccessToken();

    const response = await fetch(`${url}/messages:send`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ registration_ids: [token], dry_run: true }),
    });
    const body = await response.json();
    return body.success && !body.failure;
}

export type FCMNotification = {
    title: string;
    body: string;
};

/**
 * Example request body:
 */
// deno-lint-ignore no-unused-vars
const FCM_REQUEST_BODY_EXAMPLE = {
    "message": {
        "token": "device_fcm_token",
        "notification": {
            "title": "Hello",
            "body": "This is a test notification"
        },
        "data": {
            "order_id": "123",
            "type": "new_order"
        },
        "android": {
            "priority": "high",
            "notification": {
                "sound": "default",
                "click_action": "FLUTTER_NOTIFICATION_CLICK"
            }
        },
        "apns": {
            "headers": {
                "apns-priority": "10"
            },
            "payload": {
                "aps": {
                    "content-available": 1,
                    "mutable-content": 1
                }
            }
        },
        "webpush": {
            "headers": {
                "Urgency": "high"
            }
        }
    },
    "validate_only": false
} as const;

export async function sendFcmNotification(
    token: string,
    notification: FCMNotification,
    data?: Record<string, string>,
) {
    const accessToken = await getAccessToken();

    const response = await fetch(`${url}/messages:send`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            message: { token: token, notification, data },
        }),
    });
    const body = await response.json();
    return { success: body.name !== null, error: body.error };
}

export async function sendFcmData(
    token: string,
    data?: Record<string, string>,
) {
    const accessToken = await getAccessToken();

    const response = await fetch(`${url}/messages:send`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            message: {
                token: token,
                data,
                "apns": {
                    "payload": {
                        "aps": {
                            "content-available": 1,
                        },
                    },
                },
                "android": {
                    "priority": "high",
                },
            },
        }),
    });
    const body = await response.json();
    return { success: body.name !== null, error: body.error };
}
