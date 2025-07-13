import { Method } from "../utils/types.ts";

export type RouteParams = {
  pathParams: { [key: string]: string };
  queryParams?: { [key: string]: string };
};

type AsyncHandler = (
  request: Request,
  params: RouteParams,
) => Promise<Response>;


export class LazyRouter {
  private pathPrefix: string;
  private routes: {
    method: Method;
    path: string;
    handler: AsyncHandler;
  }[] = [];

  constructor(pathPrefix: string) {
    this.pathPrefix = pathPrefix;
  }

  on(method: Method, path: string, handler: AsyncHandler) {
    this.routes.push({ method, path, handler });
  }

  async route(request: Request): Promise<Response | null> {
    const { method, url } = request;
    const { pathname, search } = new URL(url);

    for (const route of this.routes) {
      if (route.method === method) {
        const fullPath = `${this.pathPrefix}${route.path}`;
        const pathPattern = new RegExp(`^${fullPath}$`);
        const match = pathPattern.exec(pathname);

        if (match) {
             console.log(
            request.method,
            request.url,
            "->",
            route.method,
            route.path,
            "=",
            match,
          );
          const pathParams: { [key: string]: string } = {};
          for (const key in match.groups) {
            pathParams[key] = match.groups[key];
          }

          const queryParams: { [key: string]: string } | undefined = search
            ? Object.fromEntries(new URLSearchParams(search).entries())
            : undefined;

          return await route.handler(request, { pathParams, queryParams });
        }
      }
    }

    return null;
  }
}