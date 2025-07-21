import { notFound } from "@core/functions/http.ts";
import { LazyRouter } from "@core/lib/lazy_router.ts";

const router = new LazyRouter('/riders');

/**
lat=? lng=?
*/
export const findNearestRidersPattern = "/nearest";
router.on('GET', findNearestRidersPattern, async (req, params) => {
    const handler = (await import('./routes/find_nearest_riders.ts')).default;
    return handler.request(req, params);
});

export default {
    async fetch(req: Request): Promise<Response> {
        return await router.route(req) || notFound();
    },
};
