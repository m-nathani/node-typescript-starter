import { BaseContext } from "koa";
import { verify } from 'jsonwebtoken';
import { config } from "../config";

export const auth = () => {
  return async (ctx: BaseContext, next: () => void) => {
    const token: string | null = ctx.header.authorization || ctx.request.headers.token || ctx.request.query.token;
    if (!token) {
      ctx.status = 401;
      ctx.state.message = 'Invalid token';
      throw 'Invalid token';
    }

    try {
      ctx.state.user = verify(token, config.jwtSecret);
    } catch (err) {
      ctx.status = 401;
      ctx.state.message = 'Invalid token: ' + err;
      throw 'Invalid token' + err;
    }

    await next();
  }
}