import { verifyRequestAuthThen } from "@core/utils/handle_request.ts";
import { badRequest, internalServerError } from "@core/functions/http.ts";
import { acceptOrderPattern } from "../index.ts";
import { sendFcmNotification } from "@features/account/services/fcm_service.ts";
import { getFCMToken } from "@features/account/services/account_service.ts";
import { acceptDelivery } from "@features/riders/services/riders_service.ts";
import { error as consoleError } from "@core/utils/logger.ts";
import validateOrderId from "@core/utils/validators/order_id_validator.ts";

export default verifyRequestAuthThen(async ({ params, userId, token }) => {
  try {
    const orderId = params.pathParams.orderId;

    const validation = validateOrderId(orderId);
    if (!validation.valid) {
      consoleError(`${acceptOrderPattern} validation error`, userId, {
        validation,
      });
      return badRequest(`Invalid order ID: ${orderId}`);
    }

    const response = await acceptDelivery(userId, orderId, token);

    if (response.error) {
      consoleError(`${acceptOrderPattern} reponse`, userId, {
        response,
      });
      return Response.json(response.error, { status: response.status });
    }

    const fcm = await getFCMToken(userId, token);

    if (fcm.token) {
      await sendFcmNotification(fcm.token, {
        title: "Order accepted!",
        body: "A rider is taking care of your order.",
      }).catch((err) => {
        consoleError(`${acceptOrderPattern} fcm`, userId, { error: err });
      });
    }

    return Response.json(response.data, { status: response.status });
  } catch (err) {
    consoleError(`${acceptOrderPattern}`, userId, { error: err });
  }
  return internalServerError();
});
