import {
  badRequest,
  internalServerError,
  jsonResponseMessage,
} from "@core/functions/http.ts";
import { getOrderById } from "@features/orders/services/order_service.ts";
import { verifyRequestAuthThen } from "@core/utils/handle_request.ts";
import validateOrderId from "@core/utils/validators/order_id_validator.ts";
import { getOrderPattern } from "../index.ts";
import { error } from "@core/utils/logger.ts";

export default verifyRequestAuthThen(async ({ userId, token, params }) => {
  try {
    const orderId = params.pathParams.orderId;

    const validation = validateOrderId(orderId);
    if (!validation.valid) {
      error(`${getOrderPattern} validation error`, userId, {
        error: validation.error,
      });
      return badRequest(`Invalid order ID: ${orderId}`);
    }

    const response = await getOrderById(orderId, token);

    if (response.error) {
      error(`${getOrderPattern} response error`, userId, {
        error: response.error,
      });
      return Response.json(response.error, {
        status: response.status,
      });
    }

    if (response.data.length == 0) {
      error(`${getOrderPattern} error`, userId, { error: "Order not found" });
      return jsonResponseMessage("Order not found", 404);
    }

    return Response.json(response.data[0], {
      status: response.status,
    });
  } catch (err) {
    error(`${getOrderPattern} error`, userId, { error: err });
  }
  return internalServerError();
});
