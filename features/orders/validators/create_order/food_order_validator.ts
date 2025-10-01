import { isRecord } from "../../../../../core/functions/functions.ts";
import { ValidatorResponse } from "../../../../../core/utils/types.ts";

type FoodOrderInput = {
  pickup?: unknown;
  dropoff?: unknown;
  description?: unknown;
}

export default function validateOrderInput(data: FoodOrderInput): ValidatorResponse {
  let errorMessage = '';

  if (!data.dropoff || !isRecord(data.dropoff)) {
    errorMessage += ' Dropoff location is required.';
  }
  if (!data.description || typeof data.description !== 'string' || data.description.trim().length === 0) {
    errorMessage += ' A description is required.';
  }
  else if (data.description.length > 255) {
    errorMessage += ' This description is too long.';
  }

  if (errorMessage.length > 0) return { valid: false, error: errorMessage };
  return { valid: true };
}