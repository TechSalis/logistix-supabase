import { badRequest, internalServerError } from "@core/functions/http.ts";
import { getOrder } from "@features/orders/services/order_service.ts";
import { handleRequest } from "@core/lib/handle_request.ts";

export const urlPathPattern = '/:id';

export default handleRequest(async ({ userId, params }) => {
  try {
    try {
      // eslint-disable-next-line no-var
      var orderId = params.path.id as string;
    } catch (err) {
      console.error(urlPathPattern, 'Request.json() failed:', err);
      return badRequest();
    }

    const response = await getOrder(userId, orderId);
    return new Response(JSON.stringify(response.data), { status: response.status });
  } catch (err) {
    console.error(urlPathPattern, "error:", err);
    return internalServerError();
  }
});
