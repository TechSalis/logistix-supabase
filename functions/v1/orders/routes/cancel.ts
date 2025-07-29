import { badRequest, internalServerError } from "@core/functions/http.ts";
import { verifyRequestAuthThen } from "@core/utils/handle_request.ts";
import validateOrderId from "@core/utils/validators/order_id_validator.ts";
import { cancelOrderById } from "@features/orders/services/order_service.ts";
import { cancelOrderPattern } from "../index.ts";
import { error } from "@core/utils/logger.ts";

export default verifyRequestAuthThen(async ({ userId, token, params }) => {
  try {
    const orderId = params.pathParams.orderId;

    const validation = validateOrderId(orderId);
    if (!validation.valid) {
      error(`${cancelOrderPattern} validation error`, userId, {
        error: validation.error,
      });
      return badRequest(`Invalid order ID: ${orderId}`);
    }

    const response = await cancelOrderById(orderId, token);

    if (response.error) {
      error(`${cancelOrderPattern} response error`, userId, {
        error: response.error,
      });
      return Response.json(response.error, {
        status: response.status,
      });
    }

    return Response.json(response.data, { status: response.status });
  } catch (err) {
    error(`${cancelOrderPattern} error`, userId, { error: err });
    return internalServerError();
  }
});
