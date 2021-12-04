import { getMetadataStorage, ObjectType, ValueOrPromise } from "..";

export const DEFAULT_CONTROLLER_CONFIG: RouteControllerConfig = Object.freeze({
  statusCodeOnNull: 404,
  statusCodeOnUndefined: 404,
  state: {},
});

/**
 * Configuration for an ``@RouteController`` decorator.
 */
export interface RouteControllerConfig<T = any> {
  /**
   * Status code to return when `null` is returned from the controller method, default is `404`.
   */
  statusCodeOnNull: number;

  /**
   * Status code to return when `undefined` is returned from the controller method, default is `404`.
   */
  statusCodeOnUndefined: number;

  /**
   * Initial state of the `HttpContext` for this controller.
   */
  state: ValueOrPromise<T>;
}

/**
 * Register a route controller.
 */
export function RouteController(config?: Partial<RouteControllerConfig>) {
  return function (constructor: ObjectType<any>) {
    getMetadataStorage().addController({
      target: constructor,
      config: {
        ...DEFAULT_CONTROLLER_CONFIG,
        ...config,
      },
    });
  };
}
