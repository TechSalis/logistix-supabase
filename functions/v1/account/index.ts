import { notFound } from "@core/functions/http.ts";
import { LazyRouter } from "@core/lib/lazy_router.ts";

const router = new LazyRouter("/account");

export const fcmToken = "/fcm";
router.on("POST", fcmToken, async (req, params) => {
  const saveFcm = await import("./routes/fcm_token.ts");
  return saveFcm.default.request(req, params);
});
router.on("DELETE", fcmToken, async (req, params) => {
  const deleteFcm = await import("./routes/fcm_token.ts");
  return deleteFcm.default.request(req, params);
});

export default {
  async fetch(req: Request): Promise<Response> {
    return await router.route(req) || notFound();
  },
};
