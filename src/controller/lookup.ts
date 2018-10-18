import { BaseContext } from 'koa';
import { Lookup } from '../entity/lookup';
import { getManager, Repository, } from 'typeorm';

export default class LookUpController {
  public static async getLookups(ctx: BaseContext, next: () => void) {
    // get a user repository to perform operations with user
    const lookupRepository: Repository<Lookup> = getManager().getRepository(Lookup);
    // load all users
    const lookup: Lookup[] = await lookupRepository.find();
    // return OK status code and loaded users array
    ctx.status = 200;
    ctx.state.data = lookup;
    await next();
  }
}