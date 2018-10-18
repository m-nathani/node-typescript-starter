import { BaseContext } from 'koa';
import * as compose from 'koa-compose';
import { IResponse } from '../interface';

const handler = async (ctx: BaseContext, next: () => void) => {
  ctx.body = {} as IResponse;
  ctx.body = {
    meta: {
      status: ctx.status,
      message: ctx.state.message || 'success'
    },
    data: ctx.state.data || {}
  };
  if (ctx.state.pagination) {
    ctx.body.meta.limit = ctx.state.pagination.limit;
    ctx.body.meta.offset = ctx.state.pagination.offset;
    ctx.body.meta.totalCount = ctx.state.pagination.totalCount;
  }
  await next();
};

export default () => compose([
  handler,
]);
