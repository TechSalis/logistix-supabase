import { urlPathPattern as authSignupPattern } from "./routes/sign_up_email.ts";
import { urlPathPattern as authLoginPattern } from "./routes/log_in_email.ts";
import { urlPathPattern as authAnonymousLogin } from "./routes/log_in_anonymous.ts";
import { urlPathPattern as authAnonymousUpgrade } from "./routes/upgrade_anonymous_user.ts";
import { notFound } from "@core/functions/http.ts";
import { LazyRouter } from "@core/lib/lazy_router.ts";

Deno.serve(async (req) => {
  return await router.route(req) || notFound();
});

const router = new LazyRouter("/auth");

router.on("POST", authAnonymousLogin, async (req) => {
  const signUp = await import("./routes/log_in_anonymous.ts");
  return signUp.execute(req);
});
router.on("POST", authAnonymousUpgrade, async (req) => {
  const signUp = await import("./routes/upgrade_anonymous_user.ts");
  return signUp.execute(req);
});
router.on("POST", authLoginPattern, async (req) => {
  const login = await import("./routes/log_in_email.ts");
  return login.execute(req);
});
router.on("POST", authSignupPattern, async (req) => {
  const signUp = await import("./routes/sign_up_email.ts");
  return signUp.execute(req);
});
