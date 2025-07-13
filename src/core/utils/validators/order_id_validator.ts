import { ValidatorResponse } from "../types.ts";
import { eightDigitNumberRegex, uuidRegex } from "./uuid_validator.ts";

export default function validateOrderId(orderId: string): ValidatorResponse {
    let errorMessage = "";
    if (!uuidRegex.test(orderId) && !eightDigitNumberRegex.test(orderId)) {
        errorMessage += `Invalid order ID: ${orderId}`;
    }

    if (errorMessage.length > 0) return { valid: false, error: errorMessage };
    return { valid: true };
}
