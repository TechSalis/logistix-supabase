import { verifyRequestAuthThen } from "@core/utils/handle_request.ts";
import { badRequest, internalServerError } from "@core/functions/http.ts";
import { acceptOrderPattern } from "../index.ts";
import { acceptOrder } from "@features/riders/services/riders_service.ts";
import { error as consoleError } from "@core/utils/logger.ts";
import validateOrderId from "@core/utils/validators/order_id_validator.ts";

export default verifyRequestAuthThen(async ({ params, userId, token }) => {
  const orderId = params.pathParams.orderId!;

  const validation = validateOrderId(orderId);
  if (!validation.valid) {
    consoleError(`${acceptOrderPattern} validation error`, userId, {
      validation,
    });
    return badRequest(`Invalid order ID: ${orderId}`);
  }

  try {
    const response = await acceptOrder(orderId, token);

    if (response.error) {
      consoleError(`${acceptOrderPattern} reponse`, userId, {
        response,
      });
      return Response.json(response.error, { status: response.status });
    }

    
    return Response.json(response.data, { status: response.status });
  } catch (err) {
    consoleError(`${acceptOrderPattern}`, userId, { error: err });
  }
  return internalServerError();
});
