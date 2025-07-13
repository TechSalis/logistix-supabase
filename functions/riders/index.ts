import { notFound } from "@core/functions/http.ts";
import { LazyRouter } from "@core/lib/lazy_router.ts";
import { urlPathPattern as findNearestRidersPattern } from './routes/find_nearest_riders.ts';

const router = new LazyRouter('/riders');

/// Consider sorting Alphabetically and utilizing a better-than-linear search algorithm

router.on('GET', findNearestRidersPattern, async (req, params) => {
    const createOrder = await import('./routes/find_nearest_riders.ts');
    return createOrder.default.request(req, params);
});

export default {
    async fetch(req: Request): Promise<Response> {
        return await router.route(req) || notFound();
    },
};
