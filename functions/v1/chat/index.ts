import { notFound } from "@core/functions/http.ts";
import { LazyRouter } from "@core/lib/lazy_router.ts";

const router = new LazyRouter("/chat");

export const chat = "";
router.on("POST", chat, async (req, params) => {
  const addMessage = await import("./routes/add_message.ts");
  return addMessage.default.request(req, params);
});

export default {
  async fetch(req: Request): Promise<Response> {
    return await router.route(req) || notFound();
  },
};
