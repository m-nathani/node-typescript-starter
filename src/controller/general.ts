import { BaseContext } from 'koa';
import { User } from '../entity/user';
import { sign } from 'jsonwebtoken';
import { getManager, Repository, } from 'typeorm';
import { config } from '../config';
import * as bcrypt from 'bcrypt';
import { saltRounds } from '../constant';

export default class GeneralController {

    public static async helloWorld(ctx: BaseContext, next: () => void) {
        ctx.status = 200;
        ctx.state.message = 'Hello World!';
        await next();
    }

    public static async login(ctx: BaseContext, next: () => void) {
        const userRepository: Repository<User> = getManager().getRepository(User);
        let userTobeLoggedin: User = await getManager().getRepository(User)
            .createQueryBuilder('user')
            .addSelect(['user.password', 'user.nic'])
            .where('user.nic = :nic', { nic: ctx.request.body.nic })
            .getOne();

        if (!userTobeLoggedin) {
            // return BAD REQUEST status code on invalid credentials
            ctx.status = 400;
            ctx.state.message = 'The specified username is invalid';
        } else if (!bcrypt.compareSync(ctx.request.body.password, userTobeLoggedin.password)) {
            // return BAD REQUEST status code on invalid credentials
            ctx.status = 400;
            ctx.state.message = 'The specified password is invalid';
        } else {
            // return SUCCESS status code on valid credentials
            userTobeLoggedin = await userRepository.findOne({ nic: userTobeLoggedin.nic });
            const token = sign({ ...userTobeLoggedin }, config.jwtSecret, { expiresIn: '24h' });
            ctx.status = 200;
            ctx.state.data = {
                user: userTobeLoggedin,
                token
            };
        }
        await next();
    }

    public static async forgetPassword(ctx: BaseContext, next: () => void) {
        await next();
    }

    public static async resetPassword(ctx: BaseContext, next: () => void) {
        const userRepository: Repository<User> = getManager().getRepository(User);
        const userToResetLogin: User = await getManager().getRepository(User).findOne({ nic: ctx.state.user.nic });

        if (!userToResetLogin) {
            // return BAD REQUEST status code on invalid credentials
            ctx.status = 400;
            ctx.state.message = 'The specified logged-in user does not exsist';
        } else {
            // return SUCCESS status code on valid credentials
            userToResetLogin.password = bcrypt.hashSync(ctx.request.body.password, bcrypt.genSaltSync(saltRounds));
            const user = await userRepository.save(userToResetLogin);
            ctx.status = 200;
            ctx.state.data = user;
        }
        await next();
    }
}