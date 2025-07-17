import { badRequest, internalServerError } from "@core/functions/http.ts";
import { createOrder } from "@features/orders/services/order_service.ts";
import { CreateOrder } from "@features/orders/types.ts";
import validateCreateOrderParams from "@features/orders/validators/create_order_validator.ts";
import { handleRequest } from "@core/utils/handle_request.ts";

export default handleRequest(async ({ req, userId, token }) => {
  let json: CreateOrder;
  try {
    json = await req.json() as CreateOrder;
  } catch (err) {
    console.error("CreateOrder .json() failed:", err);
    return badRequest();
  }

  const validation = await validateCreateOrderParams(json);
  if (validation.error) {
    return badRequest(validation.error);
  }

  try {
    const response = await createOrder(userId, token, json);
    return Response.json(
      response.error ? response.error : response.data ?? "Success",
      {
        status: response.status,
      },
    );
  } catch (err) {
    console.error("CreateOrder error:", err);
  }
  return internalServerError();
});
