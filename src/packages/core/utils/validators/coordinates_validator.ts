import { ValidatorResponse } from "../types.ts";

export default function validateCoordinates(lat: unknown, lng: unknown): ValidatorResponse {
    let errorMessage = '';
    if (!lat) {
        errorMessage += 'Latitude is required.';
    }
    if (!lng) {
        errorMessage += ' Longitude is required.';
    }
    if ( typeof lng !== 'number' || lng < -180 || lng > 180) {
        errorMessage += 'Invalid Latitude. Must be a number';
    }
    if ( typeof lat !== 'number' || lat < -90 || lat > 90) {
        errorMessage += 'Invalid Longitude. Must be a number';
    }
    if (errorMessage.length > 0) return { valid: false, error: errorMessage };
    return { valid: true };
}