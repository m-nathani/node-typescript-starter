import { BaseContext } from 'koa';
import { User } from '../../entity/user';
import { IResponse, IPagination } from '../../interface';

declare module 'koa' {

  interface BaseContext {
    reqId?: string;
    responseTime?: number;
    body: IResponse;
    state: IState | any;
    request: Request;
  }

  interface Request {
    auth?: any;
  }
  interface IState {
    user?: User;
    pagination?: IPagination;
    data?: any;
    message?: string;
  }
}
