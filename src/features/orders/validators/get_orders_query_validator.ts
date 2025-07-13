import { RouteParams } from "../../../core/lib/lazy_router.ts";

export function extractGetOrdersParams(params: RouteParams): {
    page: number | undefined;
    count: number | undefined;
    orderTypes: Array<string> | undefined;
} {
    try {
        const page = Number(params?.queryParams?.page ?? 0);
        const count = Number(params?.queryParams?.count ?? 10);
        const orderTypes =
            params.queryParams?.order_types &&
                params.queryParams!.order_types.length > 0
                ? params.queryParams!.order_types!.split(",")
                : undefined;

        return { page, count, orderTypes };
    } catch (_) {
        return { page: undefined, count: undefined, orderTypes: undefined };
    }
}
