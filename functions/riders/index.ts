import { notFound } from "@core/functions/http.ts";
import { LazyRouter } from "@core/lib/lazy_router.ts";
import { urlPathPattern as findNearestRiderPattern } from './routes/find_nearest_rider.ts';

const router = new LazyRouter('/riders');

/// Consider sorting Alphabetically and utilizing a better-than-linear search algorithm

router.on('GET', findNearestRiderPattern, async (req, params) => {
    const createOrder = await import('./routes/find_nearest_rider.ts');
    return createOrder.default.request(req, params);
});

export default {
    async fetch(req: Request): Promise<Response> {
        return await router.route(req) || notFound();
    },
};
