import { notFound } from "@core/functions/http.ts";
import { LazyRouter } from "@core/lib/lazy_router.ts";

Deno.serve(async (req) => {
  return await router.route(req) || notFound();
});

const router = new LazyRouter("/auth");

// export const authAnonymousLogin = "/anonymous/login";
// router.on("POST", authAnonymousLogin, async (req) => {
//   const handler = await import("./routes/log_in_anonymous.ts");
//   return handler.execute(req);
// });

// export const authAnonymousUpgrade = "/anonymous/upgrade";
// router.on("POST", authAnonymousUpgrade, async (req) => {
//   const handler = await import("./routes/upgrade_anonymous_user.ts");
//   return handler.execute(req);
// });

export const authLoginPattern = "/login";
router.on("POST", authLoginPattern, async (req) => {
  const handler = await import("./routes/log_in_email.ts");
  return handler.execute(req);
});

export const authLogoutPattern = "/logout";
router.on("POST", authLoginPattern, async (req, params) => {
  const handler = (await import("./routes/log_out.ts")).default;
  return handler.request(req, params);
});

export const authSignupPattern = "/signup";
router.on("POST", authSignupPattern, async (req) => {
  const handler = await import("./routes/sign_up_email.ts");
  return handler.execute(req);
});

export const authUserPattern = "/user";
router.on("GET", authLoginPattern, async (req, params) => {
  const handler = (await import("./routes/get_user_data.ts")).default;
  return handler.request(req, params);
});
