import { badRequest, internalServerError } from "@core/functions/http.ts";
import { handleRequest } from "@core/lib/handle_request.ts";
import validateOrderId from "@core/utils/validators/order_id_validator.ts";
import {
  cancelOrderById,
  cancelOrderByRefNumber,
} from "@features/orders/services/order_service.ts";
import { uuidRegex } from "@core/utils/validators/uuid_validator.ts";

export const urlPathPattern = "/cancel/:orderId";
export default handleRequest(async ({ token, params }) => {
  try {
    const orderId = params.pathParams.orderId!;

    const validation = validateOrderId(orderId);
    if (!validation.valid) {
      return badRequest(`Invalid order ID: ${orderId}`);
    }

    const response = uuidRegex.test(orderId)
      ? await cancelOrderById(orderId, token)
      : await cancelOrderByRefNumber(orderId, token);

    if (response.error) {
      return new Response(JSON.stringify(response.error), {
        status: response.status,
      });
    }

    return new Response(JSON.stringify(response.data), {
      status: response.status,
    });
  } catch (err) {
    console.error(urlPathPattern, "error:", err);
    return internalServerError();
  }
});
