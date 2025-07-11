import { handleRequest } from "@core/lib/handle_request.ts";
import { badRequest } from "@core/functions/http.ts";
import validateCoordinates from "@core/utils/validators/coordinates_validator.ts";

export const urlPathPattern = '/location';

export default handleRequest(async ({ req }) => {
    try {
        var { lat, lng } = await req.json() as Record<string, unknown>;
    } catch (err) {
        console.error(urlPathPattern, 'Request.json() failed:', err);
        return badRequest();
    }

    const validation = validateCoordinates(lat, lng);
    if (!validation.valid) {
        return badRequest(validation.error);
    }

    const payload = { lat: lat as number, lng: lng as number, updated_at: Date.now() };

    // await env.RIDER_KV.put(riderlocationKeyPrefix + userId, JSON.stringify(payload), { expirationTtl: 600 });
    return new Response(JSON.stringify({ success: true }));
});
