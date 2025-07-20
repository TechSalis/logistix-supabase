import { LazyRouter } from "@core/lib/lazy_router.ts";
import { notFound } from "@core/functions/http.ts";

const router = new LazyRouter("/orders");

router.on("POST", "", async (req, params) => {
  const createOrder = await import("./routes/create.ts");
  return createOrder.default.request(req, params);
});

// router.on("GET", "", async (req, params) => {
//   const getOrders = await import("./routes/get_orders.ts");
//   return getOrders.default.request(req, params);
// });

export const getMyOrdersPattern = "/my-orders";
router.on("GET", getMyOrdersPattern, async (req, params) => {
  const handler = (await import("./routes/get_my_orders.ts")).default;
  return handler.request(req, params);
});

export const getOrderPattern = "/get/:orderId";
router.on("GET", getOrderPattern, async (req, params) => {
  const handler = (await import("./routes/get_order.ts")).default;
  return handler.request(req, params);
});

export const cancelOrderPattern = "/cancel/:orderId";
router.on("POST", cancelOrderPattern, async (req, params) => {
  const handler = (await import("./routes/cancel.ts")).default;
  return handler.request(req, params);
});

export default {
  async fetch(req: Request): Promise<Response> {
    return await router.route(req) || notFound();
  },
};
