import { ValidatorResponse } from "../types.ts";

export default function validateCoordinates(
    lat: unknown,
    lng: unknown,
): ValidatorResponse {
    let errorMessage = "";
    if (!lat) {
        errorMessage += "Latitude is required.";
    }
    if (!lng) {
        errorMessage += " Longitude is required.";
    }

    try {
        const lngFloat = Number.parseFloat(lng as string);
        if (lngFloat < -180 || lngFloat > 180) {
            errorMessage += " Invalid Longitude.";
        }
    } catch (_) {
        errorMessage += " Invalid Longitude.";
    }
    try {
        const latFloat = Number.parseFloat(lat as string);
        if (latFloat < -180 || latFloat > 180) {
            errorMessage += " Invalid Latitude.";
        }
    } catch (_) {
        errorMessage += " Invalid Latitude.";
    }
    
    if (errorMessage.length > 0) return { valid: false, error: errorMessage };
    return { valid: true };
}
