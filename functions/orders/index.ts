import { urlPathPattern as cancelOrderPattern } from "./routes/cancel.ts";
import { urlPathPattern as getOrderPattern } from "./routes/get_order.ts";
import { urlPathPattern as getAllOrdersPattern } from "./routes/get_orders.ts";
import { urlPathPattern as getMyOrdersPattern } from "./routes/get_my_orders.ts";
import { urlPathPattern as createOrderPattern } from "./routes/create.ts";
import { LazyRouter } from "@core/lib/lazy_router.ts";
import { notFound } from "@core/functions/http.ts";

const router = new LazyRouter("/orders");

/// Consider sorting Alphabetically and utilizing a better-than-linear search algorithm

router.on("POST", createOrderPattern, async (req, params) => {
  const createOrder = await import("./routes/create.ts");
  return createOrder.default.request(req, params);
});
router.on("GET", getAllOrdersPattern, async (req, params) => {
  const getOrders = await import("./routes/get_orders.ts");
  return getOrders.default.request(req, params);
});
router.on("GET", getMyOrdersPattern, async (req, params) => {
  const getOrders = await import("./routes/get_my_orders.ts");
  return getOrders.default.request(req, params);
});
router.on("GET", getOrderPattern, async (req, params) => {
  const getOrder = await import("./routes/get_order.ts");
  return getOrder.default.request(req, params);
});
router.on("POST", cancelOrderPattern, async (req, params) => {
  const cancelOrder = await import("./routes/cancel.ts");
  return cancelOrder.default.request(req, params);
});

export default {
  async fetch(req: Request): Promise<Response> {
    return await router.route(req) || notFound();
  },
};
