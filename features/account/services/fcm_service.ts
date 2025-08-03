import { createJwt } from "../../../../core/lib/jwt.ts";
import { FCMData, FCMNotification } from "../utils/fcm.ts";
import { getFCMToken } from "./account_service.ts";

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

const url = Deno.env.get("FCM_API_URL");

export async function validateFcmToken(fcm_token: string): Promise<boolean> {
    const accessToken = await getAccessToken();

    const response = await fetch(`${url}/messages:send`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: { token: fcm_token }, validate_only: false }),
    });
    return response.ok;
}

export async function sendFcmNotification(
    fcm_token: string,
    message: { notification: FCMNotification; data?: FCMData },
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
                token: fcm_token,
                ...message,
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

export async function sendFcmNotificationToUser(
    user_id: string,
    message: { notification: FCMNotification; data?: FCMData },
    token: string,
) {
    const fcm = await getFCMToken(user_id, token);
    if (fcm.error) return fcm;
    return sendFcmNotification(fcm.token, message);
}

// export async function sendFcmData(
//     token: string,
//     data: FCMData,
// ) {
//     const accessToken = await getAccessToken();

//     const response = await fetch(`${url}/messages:send`, {
//         method: "POST",
//         headers: {
//             Authorization: `Bearer ${accessToken}`,
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//             message: {
//                 token: token,
//                 data,
//                 "apns": {
//                     "payload": {
//                         "aps": {
//                             "content-available": 1,
//                         },
//                     },
//                 },
//                 "android": {
//                     "priority": "high",
//                 },
//             },
//         }),
//     });
//     const body = await response.json();
//     return { success: body.name !== null, error: body.error };
// }
