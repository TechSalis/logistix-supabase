import { badRequest, internalServerError } from "@core/functions/http.ts";
import { createOrder } from "@features/orders/services/order_service.ts";
import { CreateOrder } from "@features/orders/types.ts";
import validateCreateOrderParams from "@features/orders/validators/create_order_validator.ts";
import { handleRequest } from "@core/utils/handle_request.ts";
import { error } from "@core/utils/logger.ts";

export default handleRequest(async ({ req, userId, token }) => {
  let json: CreateOrder;
  try {
    json = await req.json() as CreateOrder;
  } catch (err) {
    error("create order json extraction", { error: err });
    console.error("CreateOrder .json() failed:", err);
    return badRequest();
  }

  const validation = await validateCreateOrderParams(json);
  if (validation.error) {
    error("create order validation error", { error: validation.error });
    return badRequest(validation.error);
  }

  try {
    const response = await createOrder(userId, token, json);
    
    if (response.error) {
      error("create order response error", { error: response.error });
    }

    return Response.json(
      response.error ? response.error : response.data ?? "Success",
      {
        status: response.status,
      },
    );
  } catch (err) {
    error("create order error", { error: err });
  }
  return internalServerError();
});
