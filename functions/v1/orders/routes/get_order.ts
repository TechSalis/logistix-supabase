import {
  badRequest,
  internalServerError,
  jsonResponseMessage,
} from "@core/functions/http.ts";
import { uuidRegex } from "@core/utils/validators/uuid_validator.ts";
import {
  getOrderById,
  getOrderByRefNumber,
} from "@features/orders/services/order_service.ts";
import { handleRequest } from "@core/utils/handle_request.ts";
import validateOrderId from "@core/utils/validators/order_id_validator.ts";
import { getOrderPattern } from "../index.ts";
import { error } from "@core/utils/logger.ts";

export default handleRequest(async ({ token, params }) => {
  try {
    const orderId = params.pathParams.orderId!;

    const validation = validateOrderId(orderId);
    if (!validation.valid) {
      error(`${getOrderPattern} validation error`, { error: validation.error });
      return badRequest(`Invalid order ID: ${orderId}`);
    }

    const response = uuidRegex.test(orderId)
      ? await getOrderById(orderId, token)
      : await getOrderByRefNumber(orderId, token);

    if (response.error) {
      error(`${getOrderPattern} response error`, { error: response.error });
      return Response.json(response.error, {
        status: response.status,
      });
    }

    if (response.data.length == 0) {
      error(`${getOrderPattern} error`, { error: "Order not found" });
      return jsonResponseMessage("Order not found", 404);
    }

    return Response.json(response.data[0], {
      status: response.status,
    });
  } catch (err) {
    error(`${getOrderPattern} error`, { error: err });
  }
  return internalServerError();
});
