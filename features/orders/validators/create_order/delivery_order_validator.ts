import { isRecord } from "../../../../../core/functions/functions.ts";
import { ValidatorResponse } from "../../../../../core/utils/types.ts";

interface DeliveryOrderInput {
  pickup?: unknown;
  dropoff?: unknown;
  description?: unknown;
  images?: unknown;
}

export default function validateOrderInput(
  data: DeliveryOrderInput,
): ValidatorResponse {
  let errorMessage = "";

  if (
    !data.pickup || !isRecord(data.pickup)
  ) {
    errorMessage += "Pickup location is required.";
  }
  if (!data.dropoff || !isRecord(data.dropoff)) {
    errorMessage += " Dropoff location is required.";
  }
  if (
    !data.description || typeof data.description !== "string" ||
    data.description.trim().length === 0
  ) {
    errorMessage += " A description is required.";
  } else if (data.description.length > 255) {
    errorMessage += " This description is too long.";
  }
  if (data.images) {
    if (!Array.isArray(data.images)) {
      errorMessage += " Images must be set properly.";
    }
    if (Array(data.images).length > 4) {
      errorMessage += " A maximum of 4 images is allowed.";
    }
  }

  if (errorMessage.length > 0) return { valid: false, error: errorMessage };
  return { valid: true };
}
