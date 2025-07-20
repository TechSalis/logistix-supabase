import { verifyRequestAuthThen } from "@core/utils/handle_request.ts";
import { badRequest, internalServerError } from "@core/functions/http.ts";
import { getOrders } from "@features/orders/services/order_service.ts";
import { extractGetOrdersParams } from "@features/orders/validators/get_orders_query_validator.ts";
import { getMyOrdersPattern } from "../index.ts";
import { error } from "@core/utils/logger.ts";

//?page=:page&size=:size&order_types=:orderTypes
export default verifyRequestAuthThen(async ({ userId, token, params }) => {
  try {
    const { page, size, order_types } = extractGetOrdersParams(
      params,
    );
    if (page === undefined || size === undefined) {
      error(`${getMyOrdersPattern} error`, { error: "invalid page or size" });
      return badRequest();
    }

    const response = await getOrders(
      token,
      size,
      page,
      order_types,
      // order_statuses,
      userId,
    );
    return Response.json(
      response.error ? response.error : response.data ?? "Success",
      { status: response.status },
    );
  } catch (err) {
    error(`${getMyOrdersPattern}  error:`, { error: err });
    return internalServerError();
  }
});
