import { notFound } from "@core/functions/http.ts";
import { LazyRouter } from "@core/lib/lazy_router.ts";

const router = new LazyRouter("/account");

export const saveFcmToken = "/save-fcm-token";
router.on("POST", saveFcmToken, async (req, params) => {
  const saveFcm = await import("./routes/save_fcm_token.ts");
  return saveFcm.default.request(req, params);
});

export default {
  async fetch(req: Request): Promise<Response> {
    return await router.route(req) || notFound();
  },
};
