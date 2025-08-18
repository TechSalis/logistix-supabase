import { badRequest, internalServerError } from "@core/functions/http.ts";
import { createOrder } from "@features/orders/services/order_service.ts";
import { CreateOrder } from "@features/orders/types.ts";
import validateCreateOrderParams from "@features/orders/validators/create_order_validator.ts";
import { verifyRequestAuthThen } from "@core/utils/handle_request.ts";
import { error } from "@core/utils/logger.ts";

export default verifyRequestAuthThen(async ({ req, userId, token }) => {
  try {
    var json: CreateOrder = await req.json();
  } catch (err) {
    error("create order json", userId, { error: err });
    console.error("CreateOrder .json() failed:", err);
    return badRequest();
  }

  const validation = await validateCreateOrderParams(json);
  if (validation.error) {
    error("create order validation error", userId, { error: validation.error });
    return badRequest(validation.error);
  }

  try {
    const response = await createOrder(userId, token, json);

    if (response.error) {
      error("create order response error", userId, { error: response.error });
    }

    return Response.json(
      response.error ? response.error : response.data ?? "Success",
      {
        status: response.status,
      },
    );
  } catch (err) {
    error("create order error", userId, { error: err });
  }
  return internalServerError();
});
