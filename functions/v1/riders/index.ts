import { notFound } from "@core/functions/http.ts";
import { LazyRouter } from "@core/lib/lazy_router.ts";

const router = new LazyRouter('/riders');

export const findNearestRidersPattern = "/nearest";
router.on('GET', findNearestRidersPattern, async (req, params) => {
    const handler = (await import('./routes/find_nearest_riders.ts')).default;
    return handler.request(req, params);
});

export const acceptOrderPattern = "/accept-order/:order_id";
router.on('POST', acceptOrderPattern, async (req, params) => {
    const handler = (await import('./routes/accept_order.ts')).default;
    return handler.request(req, params);
});

export const getRiderPattern = "/get/:user_id";
router.on('GET', getRiderPattern, async (req, params) => {
    const handler = (await import('./routes/get_rider.ts')).default;
    return handler.request(req, params);
});

export default {
    async fetch(req: Request): Promise<Response> {
        return await router.route(req) || notFound();
    },
};
