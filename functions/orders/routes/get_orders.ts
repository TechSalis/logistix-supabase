import { handleRequest } from "../../../src/packages/core/lib/handle_request.ts";
import { badRequest, internalServerError } from "@core/functions/http.ts";
import { getOrders } from "@features/orders/services/order_service.ts";

export const urlPathPattern = "?page=:page&count=:count";

export default handleRequest(async ({ userId, token, params }) => {
  try {
    try {
      var page: number = Number(params?.query?.page ?? 0);
      var count: number = Number(params?.query?.count ?? 0);
    } catch (err) {
      console.error(urlPathPattern, "Request.json() failed:", err);
      return badRequest();
    }
    const response = await getOrders(token, userId, count, page);
    return new Response(JSON.stringify({ orders: response.data }), {
      status: response.status,
    });
  } catch (err) {
    console.error(urlPathPattern, "error:", err);
    return internalServerError();
  }
});
