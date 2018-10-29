import { BaseContext } from 'koa';
import { Lookup } from '../entity/lookup';
import { getManager, Repository, getConnection, } from 'typeorm';

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

  public static async seedLookups(ctx: BaseContext, next: () => void) {
    ctx.status = 200;
    ctx.state.data = await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Lookup)
      .values([
        { id: 0, name: 'utility bill payment on time', point: 5 },
        { id: 1, name: 'tax filing on time', point: 10 },
        { id: 2, name: 'breaking traffic rule', point: -10 },
        { id: 3, name: 'street crime convicted', point: -20 },
        { id: 4, name: 'criminal activities theft/fraud convicted', point: -30 },
        { id: 5, name: 'social/welfare contribution', point: 20 },
        { id: 6, name: 'defaulter of govt/financial institution', point: -20 },
        { id: 7, name: 'employer/exporter/owner of business', point: 50 },
        { id: 8, name: 'Phd/teacher/researcher/doctor/engineer/other field experts', point: 20 },
        { id: 9, name: 'white collar criminal convicted', point: -50 },
        { id: 10, name: 'law abiding citizen points annually', point: 40 },
        { id: 11, name: 'utility bill payment on time', point: 5 },
        { id: 12, name: 'tax filing on time', point: 10 },
        { id: 13, name: 'breaking traffic rule', point: -10 },
        { id: 14, name: 'street crime convicted', point: -20 },
        { id: 15, name: 'criminal activities theft/fraud convicted', point: -30 },
        { id: 16, name: 'social worker/welfare contribution', point: 20 },
        { id: 17, name: 'defaulter of govt/financial institution', point: -20 },
        { id: 18, name: 'employer/exporter/owner of business', point: 50 },
        { id: 19, name: 'Phd/teacher/researcher/doctor/engineer/other field experts', point: 20 },
        { id: 20, name: 'white collar criminal convicted', point: -50 },
        { id: 21, name: 'law abiding citizen points annually', point: 40 },
        { id: 22, name: 'new born child', point: 50 },
        { id: 23, name: 'literacy point matric', point: 50 },
        { id: 24, name: 'literacy point intermediate', point: 70 },
        { id: 25, name: 'literacy point undergraduate', point: 100 },
        { id: 26, name: 'defence/arm forces person', point: 50 },
        { id: 27, name: 'white collar crime/corruption/other unlawful misconducts convicted', point: -50 }
      ]).execute();

    await next();
  }
}

