import { verifyRequestAuthThen } from "@core/utils/handle_request.ts";
import { badRequest, internalServerError } from "@core/functions/http.ts";
import { acceptOrderPattern } from "../index.ts";
import { sendFcmNotificationToUser } from "@features/account/services/notification_service.ts";
import { acceptOrder } from "@features/orders/services/order_service.ts";
import { error } from "@core/utils/logger.ts";
import validateOrderId from "@core/utils/validators/order_id_validator.ts";
import { FCMEvent, FCMSource } from "@features/account/utils/fcm.ts";
import { OrderStatus } from "@core/db/types.ts";

export default verifyRequestAuthThen(async ({ params, userId, token }) => {
  try {
    const order_id = params.pathParams.order_id;

    const validation = validateOrderId(order_id);
    if (!validation.valid) {
      error(`${acceptOrderPattern} validation error`, userId, {
        validation,
      });
      return badRequest(`Invalid order ID: ${order_id}`);
    }

    const accepted = await acceptOrder(userId, order_id, token);

    if (accepted.error) {
      error(`${acceptOrderPattern} response`, userId, {
        accepted,
      });
      return Response.json(accepted.error, { status: accepted.status });
    }

    await sendFcmNotificationToUser(
      accepted.data.user_id,
      {
        notification: {
          title: "Order accepted!",
          body: "A rider is taking care of your order.",
        },
        data: {
          event: FCMEvent.orderUpdate,
          source: FCMSource.system,
          status: OrderStatus.accepted,
          rider_id: userId,
          order_id,
        },
      },
      token,
    )
      .catch((err) => {
        error(`${acceptOrderPattern} fcm`, userId, { error: err });
      });

    return Response.json(accepted.data, { status: accepted.status });
  } catch (err) {
    error(`${acceptOrderPattern}`, userId, { error: err });
  }
  return internalServerError();
});
