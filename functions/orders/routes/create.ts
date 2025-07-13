import { badRequest, internalServerError } from "@core/functions/http.ts";
import { createOrder } from "@features/orders/services/order_service.ts";
import { CreateOrder } from "@features/orders/types.ts";
import validateCreateOrderParams from "@features/orders/validators/create_order_validator.ts";
import { handleRequest } from "@core/lib/handle_request.ts";

export const urlPathPattern = "";
export default handleRequest(async ({ req, userId, token }) => {
  let json: CreateOrder;
  try {
    json = await req.json() as CreateOrder;
  } catch (err) {
    console.error(urlPathPattern, ".json() failed:", err);
    return badRequest();
  }

  const validation = await validateCreateOrderParams(json);
  if (!validation.valid) {
    return badRequest(validation.error);
  }

  try {
    const response = await createOrder(userId, token, json);
    return new Response(
      JSON.stringify(
        response.error ? response.error : response.data ?? "Success",
      ),
      {
        status: response.status,
      },
    );
  } catch (err) {
    console.error(urlPathPattern, "error:", err);
    return internalServerError();
  }
});
