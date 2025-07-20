import type { RouteParams } from "../lib/lazy_router.ts";
import { internalServerError, unauthorized } from "../functions/http.ts";
import { getUserIdFromJWT } from "../lib/jwt.ts";
import { error } from "./logger.ts";

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

        return await handler({ req, params, userId, token });
      } catch (err) {
        error("JWT extraction failed:", { error: err });
        return internalServerError();
      }
    },
  };
}
