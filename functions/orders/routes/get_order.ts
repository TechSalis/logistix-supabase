import { badRequest, internalServerError } from "@core/functions/http.ts";
import { uuidRegex } from "@core/utils/validators/uuid_validator.ts";
import {
  getOrderById,
  getOrderByRefNumber,
} from "@features/orders/services/order_service.ts";
import { handleRequest } from "@core/utils/handle_request.ts";
import validateOrderId from "@core/utils/validators/order_id_validator.ts";
import { getOrderPattern } from "../index.ts";

export default handleRequest(async ({ token, params }) => {
  try {
    const orderId = params.pathParams.orderId!;

    const validation = validateOrderId(orderId);
    if (!validation.valid) {
      return badRequest(`Invalid order ID: ${orderId}`);
    }

    const response = uuidRegex.test(orderId)
      ? await getOrderById(orderId, token)
      : await getOrderByRefNumber(orderId, token);

    if (response.error) {
      return new Response(JSON.stringify(response.error), {
        status: response.status,
      });
    }

    if (response.data.length == 0) {
      return new Response("Order not found", { status: 404 });
    }

    return new Response(JSON.stringify(response.data[0]), {
      status: response.status,
    });
  } catch (err) {
    console.error(getOrderPattern, "error:", err);
    return internalServerError();
  }
});
