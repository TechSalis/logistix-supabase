// import { handleRequest } from "@core/utils/handle_request.ts";
// import { badRequest, internalServerError } from "@core/functions/http.ts";
// import { getOrders } from "@features/orders/services/order_service.ts";
// import { extractGetOrdersParams } from "@features/orders/validators/get_orders_query_validator.ts";

// //?page=:page&size=:size&order_types=:order_types
// export default handleRequest(async ({ token, params }) => {
//   try {
//     const { page, size, order_types } = extractGetOrdersParams(params);
//     if (page === undefined || size === undefined) {
//       return badRequest();
//     }

//     const response = await getOrders(token, size, page, order_types);
//     return Response.json(
//         response.error ? response.error : response.data ?? "Success",
//       {
//         status: response.status,
//       },
//     );
//   } catch (err) {
//     console.error(urlPathPattern, "error:", err);
//     return internalServerError();
//   }
// });
