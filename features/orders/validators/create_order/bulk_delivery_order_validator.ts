import { isRecord } from "../../../../../core/functions/functions.ts";
import { ValidatorResponse } from "../../../../../core/utils/types.ts";

interface DeliveryOrderInput {
  pickup?: unknown;
  dropoff?: unknown;
  description?: unknown;
  deliveries?: unknown;
  entries?: unknown;
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
  if (
    !data.description || typeof data.description !== "string" ||
    data.description.trim().length === 0
  ) {
    errorMessage += " A description is required.";
  }
  if (data.entries) {
    if (!Array.isArray(data.entries)) {
      errorMessage += " Entries must be set properly.";
    }
    const entries = Array(data.entries);
    if (entries.length > Number(data.deliveries)) {
      errorMessage +=
        " Incorrect amount of entries. Cannot be more than deliveries.";
    }
    for (let i = 0; i < entries.length; i++) {
      const response = validateEntry(entries[i]);
      if (!response.valid) {
        errorMessage += response.error;
        break;
      }
    }
  }

  if (errorMessage.length > 0) return { valid: false, error: errorMessage };
  return { valid: true };
}

function validateEntry(entry: unknown): ValidatorResponse {
  let errorMessage = "";
  if (!isRecord(entry)) {
    errorMessage = " Entries must be set properly.";
  }
  if (errorMessage.length > 0) return { valid: false, error: errorMessage };
  return { valid: true };
}
