import { NextApiRequest, NextApiResponse } from "next";

/**
 * Represents an object type that can be instantiate.
 */
export type ObjectType<T> = Function & { new (...args: any[]): T };

/**
 * Represents a route handler.
 */
export type Handler<Req, Res> = (req: Req, res: Res) => Promise<any> | any;

/**
 * A handler for call the next action.
 */
export type NextHandler = (err?: any) => void;

/**
 * A handler for the errors.
 */
export type ErrorHandler<Req, Res> = (
  err: any,
  req: Req,
  res: Res,
  next: NextHandler
) => Promise<any> | any;

/**
 * A handler for middlewares.
 */
export type Middleware<Req, Res> = (
  req: Req,
  res: Res,
  next: NextHandler
) => Promise<any> | any;

/**
 * Params object.
 */
export type Params = {
  [key: string]: string | undefined;
};

/**
 * Represents the request object with the params.
 */
export type NextApiRequestWithParams = NextApiRequest & {
  params: Params;
};

/**
 * Context for the current request.
 */
export interface HttpContext<
  TState extends Record<string, any> = Record<string, any>,
  Req = NextApiRequestWithParams,
  Res = NextApiResponse
> {
  /**
   * Shared state for this current request.
   */
  state: TState;

  /**
   * The request object.
   */
  request: Req;

  /**
   * The response object.
   */
  response: Res;
}
