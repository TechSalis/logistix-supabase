import { encodeBase64Url as b64 } from "https://deno.land/std@0.224.0/encoding/base64url.ts";
import { crypto } from "https://deno.land/std@0.224.0/crypto/mod.ts";

const toBase64Url = (obj: unknown) => b64(JSON.stringify(obj));
const encodedHeader = toBase64Url({ alg: "RS256", typ: "JWT" });
const encoder = new TextEncoder();

export async function createJwt(
    payload: unknown,
    pem: string,
): Promise<string> {
    const encodedPayload = toBase64Url(payload);
    const data = `${encodedHeader}.${encodedPayload}`;

    // Sign JWT
    const key = await crypto.subtle.importKey(
        "pkcs8",
        pemToArrayBuffer(pem),
        { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
        false,
        ["sign"],
    );
    const signature = await crypto.subtle.sign(
        "RSASSA-PKCS1-v1_5",
        key,
        encoder.encode(data),
    );

    return `${data}.${b64(new Uint8Array(signature))}`;
}

// Utility: convert PEM to ArrayBuffer
function pemToArrayBuffer(pem: string): ArrayBuffer {
    const b64 = pem
        .replace(/-----BEGIN PRIVATE KEY-----/, "")
        .replace(/-----END PRIVATE KEY-----/, "")
        .replace(/\n/g, "")
        .trim();
    const binary = atob(b64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
}

export function getUserIdFromJWT(token: string): string | null {
  const [, payload] = token.split(".");
  try {
    const decoded = JSON.parse(atob(payload));
    return decoded.sub;
  } catch (e) {
    console.error("Invalid token:", e);
    return null;
  }
}