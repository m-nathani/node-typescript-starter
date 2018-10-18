import { BaseContext } from 'koa';
import * as compose from 'koa-compose';

const handler = async (ctx: BaseContext, next: () => void) => {
  try {
    await next();
  } catch (err) {
    ctx.body = {
      meta: {
        status: ctx.status,
        message: ctx.state.message,
        error: err
      },
      data: ctx.state.data || {}
    };
  }
};

export default () => compose([
  handler,
]);
