import { NextApiResponse } from "next";
import regexparam from "regexparam";
import path from "path";
import {
  ErrorHandler,
  getMetadataStorage,
  Handler,
  HttpVerb,
  NextApiRequestWithParams,
  NextHandler,
  ObjectType,
  Middleware,
} from ".";

interface RouteAction<Req, Res> {
  path: RoutePath;
  method: HttpVerb;
  handler: Handler<Req, Res>;
  middlewares: Middleware<Req, Res>[];
}

function getBasePath() {
  const dirname = __dirname.split(path.sep);

  const idx = dirname.indexOf("api");

  if (idx === -1) {
    throw new Error(`Could not find "api/" folder`);
  }

  return "/" + dirname.slice(idx).join("/");
}

export function withController<
  Req extends NextApiRequestWithParams = NextApiRequestWithParams,
  Res extends NextApiResponse = NextApiResponse
>(target: ObjectType<any>) {
  const basePath = getBasePath();
  const controller = new target();
  const routesMap = new Map<HttpVerb, RouteAction<Req, Res>[]>();
  const metadataStore = getMetadataStorage();
  const actions = metadataStore.getActions(target);
  const allMiddlewares = metadataStore.getMiddlewares(target);
  const controllerMiddlewares = allMiddlewares
    .filter((m) => m.methodName == null)
    .map((m) => m.handler);

  for (const action of actions) {
    const pattern = action.pattern || "/";

    if (!pattern.toString().startsWith("/")) {
      throw new Error(`Route pattern must start with "/": ${pattern}`);
    }

    const routesMiddleware = allMiddlewares
      .filter((m) => m.methodName != null && m.methodName !== action.methodName)
      .map((m) => m.handler);

    // prettier-ignore
    const method = getValue<Handler<Req, Res>>(controller, action.methodName);
    const routes = routesMap.get(action.method);
    const routeAction = {
      // FIXME: Typescript is not detecting string|RegExp
      path:
        typeof pattern == "string"
          ? new RoutePath(pattern)
          : new RoutePath(pattern),
      method: action.method,
      handler: method,
      middlewares: routesMiddleware,
    };

    if (routes) {
      routes.push(routeAction);
    } else {
      routesMap.set(action.method, [routeAction]);
    }
  }

  return async function (req: Req, res: Res) {
    let url = req.url || "/";
    const routes = routesMap.get(req.method as HttpVerb) || [];

    if (!url.startsWith(basePath)) {
      return;
    }

    // Slice the base path
    url = url.slice(basePath.length);

    // prettier-ignore
    const errorHandler = metadataStore.getErrorHandler(target) as ErrorHandler<Req, Res> | undefined;
    const onError = errorHandler ?? defaultErrorHandler;
    let done = false;

    const next = (err?: any) => {
      done = true;

      if (err) {
        return onError(err, req, res, next);
      }
    };

    const runMiddlewares = async (middlewares: Middleware<Req, Res>[]) => {
      for (const middleware of middlewares) {
        await middleware(req, res, next);

        if (!done) {
          return false;
        }
      }

      return true;
    };

    if (!(await runMiddlewares(controllerMiddlewares))) {
      return res.end();
    }

    for (const route of routes) {
      const matches = route.path.match(url);

      if (route.method !== req.method || !matches) {
        continue;
      }

      // Attach params
      req.params = matches;

      if (!(await runMiddlewares(route.middlewares))) {
        return res.end();
      }

      try {
        return await handleRequest(route, req, res);
      } catch (err: any) {
        next(err);
      }
    }

    // Not found
    return res.status(404);
  };
}

async function handleRequest<
  Req extends NextApiRequestWithParams,
  Res extends NextApiResponse
>(route: RouteAction<Req, Res>, req: Req, res: Res) {
  const result = await route.handler(req, res);

  // A response was already written
  if (res.writableEnded) {
    return;
  }

  if (result === null) {
    return res.status(404).end();
  }

  if (result != null) {
    if (typeof result === "object" || Array.isArray(result)) {
      return res.json(result);
    }

    return res.send(result);
  }

  // Fallback
  return res.status(200);
}

function defaultErrorHandler<
  Req extends NextApiRequestWithParams,
  Res extends NextApiResponse
>(err: any, _: Req, res: Res, next: NextHandler) {
  console.error(err);

  res.status(500).json({
    message: err.message || "Internal Server Error",
  });

  next();
}

function getValue<T>(target: any, key: string): T {
  return target[key];
}

type RegexParamResult = {
  keys: Array<string> | boolean;
  pattern: RegExp;
};

class RoutePath {
  private matches: RegexParamResult;

  constructor(pattern: RegExp);
  constructor(pattern: string);
  constructor(pattern: string | RegExp) {
    if (typeof pattern === "string") {
      this.matches = regexparam(pattern);
    } else {
      this.matches = regexparam(pattern);
    }
  }

  public match(url: string): Record<string, string> | null {
    const result = this.matches.pattern.exec(url);

    if (result) {
      if (typeof this.matches.keys === "boolean") {
        return result.groups || null;
      } else {
        const keys = this.matches.keys;
        const params: Record<string, string> = {};

        for (let i = 0; i < keys.length; i++) {
          params[keys[i]] = result[i + 1];
        }

        return params;
      }
    }

    return null;
  }
}
