import { RouteParams } from "../../../core/lib/lazy_router.ts";
import { PageData } from "../../../core/utils/types.ts";

export function extractGetOrdersParams(params: RouteParams):
    & (
        | PageData
        | {
            page: undefined;
            size: undefined;
        }
    )
    & {
        order_types: Array<string> | undefined;
        // order_statuses: Array<string> | undefined;
    } {
    try {
        const page = Number(params?.queryParams?.page ?? 0);
        const size = Number(params?.queryParams?.size ?? 10);

        const order_types = params.queryParams?.order_types &&
                params.queryParams!.order_types.length > 0
            ? params.queryParams!.order_types!.split(",")
            : undefined;

        // const order_statuses = params.queryParams?.order_statuses &&
        //         params.queryParams!.order_statuses.length > 0
        //     ? params.queryParams!.order_statuses!.split(",")
        //     : undefined;

        return { page, size, order_types };
    } catch (_) {
        return { page: undefined, size: undefined, order_types: undefined };
    }
}
