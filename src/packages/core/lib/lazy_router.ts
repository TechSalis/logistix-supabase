export type RouteParams = {
  path: Record<string, string | undefined>;
  query?: Record<string, string | undefined>;
};

type AsyncHandler = (
  request: Request,
  params: RouteParams,
) => Promise<Response>;

type RouteEntry = {
  method: string;
  path: string;
  handler: AsyncHandler;
};

export class LazyRouter {
  private routePrefix?: string;
  constructor(routePrefix?: string) {
    this.routePrefix = routePrefix;
  }

  private routes: RouteEntry[] = [];

  on(method: string, path: string, handler: AsyncHandler) {
    this.routes.push({
      method: method.toUpperCase(),
      path: path,
      handler: handler,
    });
  }

  async route(request: Request): Promise<Response | undefined> {
    for (const route of this.routes) {
      if (route.method === request.method.toUpperCase()) {
        const [path, search] = route.path.split("?");

        const pathPattern = new URLPattern({
          pathname: this.routePrefix + path,
        });
        const match = pathPattern.exec(request.url);

        if (match) {
          console.log(
            request.method,
            request.url,
            "->",
            route.method,
            route.path,
            "=",
            match.pathname,
          );

          const pathParams = match.pathname.groups;

          let queryParams: Record<string, string | undefined> | undefined;
          if (search) {
            const searchPattern = new URLPattern({ search });
            const match = searchPattern.exec(request.url);

            console.log("Search params:", match?.search);
            queryParams = match?.search.groups;
          }
          const params: RouteParams = {
            path: pathParams,
            query: queryParams,
          };

          return await route.handler(request, params);
        }
      }
    }
  }
}
