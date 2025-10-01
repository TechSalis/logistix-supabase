import { OrderType } from "../../../../core/db/types.ts";
import { ValidatorResponse } from "../../../../core/utils/types.ts";

export default async function validateCreateOrderParams(
  json: Record<string, unknown>,
): Promise<ValidatorResponse> {
  const order_type: OrderType = json.order_type as OrderType;
  if (order_type === "food") {
    return (await import("./create_order/food_order_validator.ts")).default(
      json,
    );
  } else if (order_type === "delivery" || order_type === "errands") {
    return (await import("./create_order/delivery_order_validator.ts")).default(
      json,
    );
  } else {
    return {
      valid: false,
      error:
        `Invalid order type: ${order_type}. Must be delivery, food, errands or grocery`,
    };
  }
}
