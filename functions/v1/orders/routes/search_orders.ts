import {
  badRequest,
  internalServerError,
  notFound,
} from "@core/functions/http.ts";
import { getOrderByRefNumber } from "@features/orders/services/order_service.ts";
import { verifyRequestAuthThen } from "@core/utils/handle_request.ts";
import { validateRefNumber } from "@core/utils/validators/order_validator.ts";
import { searchOrderPattern } from "../index.ts";
import { error } from "@core/utils/logger.ts";

export default verifyRequestAuthThen(async ({ userId, token, params }) => {
  try {
    let search = params.queryParams?.search;
    if (!search) {
      return badRequest(`"search" query param is required`);
    }

    let response;

    if (validateRefNumber(search).valid) {
    if (search.startsWith("#")) search = search.slice(1);
      response = await getOrderByRefNumber(search, token);
    }

    if (!response) {
      return badRequest(`Invalid search: ${search}`);
    }

    if (response.error) {
      error(`${searchOrderPattern} response error`, userId, {
        error: response.error,
      });
      return Response.json(response.error, {
        status: response.status,
      });
    }

    if (response.data.length == 0) {
      error(`${searchOrderPattern} error`, userId, {
        error: "Order not found",
      });
      return notFound("Order not found");
    }

    return Response.json(response.data, {
      status: response.status,
    });
  } catch (err) {
    error(`${searchOrderPattern} error`, userId, { error: err });
  }
  return internalServerError();
});
