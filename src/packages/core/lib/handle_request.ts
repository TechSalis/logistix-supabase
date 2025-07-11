import type { RouteParams } from "./lazy_router.ts";
import { internalServerError, unauthorized } from "../functions/http.ts";

export function handleRequest(
  handler: (data: {
    req: Request;
    params: RouteParams;
    userId: string;
    token: string;
  }) => Promise<Response>,
) {
  return {
    async request(req: Request, params: RouteParams): Promise<Response> {
      try {
        const token = req.headers.get("Authorization")!.slice(7);
        const userId = getUserIdFromJWT(token.replace("Bearer ", "").trim());

        if (!userId) return unauthorized();

        return await handler({ req, userId, token, params });
      } catch (err) {
        console.error("JWT extraction failed:", err);
        return internalServerError();
      }
    },
  };
}

function getUserIdFromJWT(token: string): string | null {
  const [, payload] = token.split(".");
  try {
    const decoded = JSON.parse(atob(payload));
    return decoded.sub;
  } catch (e) {
    console.error("Invalid token:", e);
    return null;
  }
}
