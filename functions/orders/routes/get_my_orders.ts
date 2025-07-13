import { handleRequest } from "../../../src/core/lib/handle_request.ts";
import { badRequest, internalServerError } from "@core/functions/http.ts";
import { getOrders } from "@features/orders/services/order_service.ts";
import { extractGetOrdersParams } from "@features/orders/validators/get_orders_query_validator.ts";

export const urlPathPattern = "/my-orders";

//?page=:page&count=:count&order_types=:orderTypes
export default handleRequest(async ({ userId, token, params }) => {
  try {
    const { page, count, orderTypes } = extractGetOrdersParams(params);
    if (page === undefined || count === undefined) {
      return badRequest();
    }

    const response = await getOrders(token, count, page, orderTypes, userId);
    return new Response(
      JSON.stringify(
        response.error ? response.error : response.data ?? "Success",
      ),
      {
        status: response.status,
      },
    );
  } catch (err) {
    console.error(urlPathPattern, "error:", err);
    return internalServerError();
  }
});
