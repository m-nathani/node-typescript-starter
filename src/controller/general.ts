import { BaseContext } from 'koa';
import { User } from '../entity/user';
import { sign } from 'jsonwebtoken';
import { getManager, Repository, } from 'typeorm';
import { config } from '../config';

export default class GeneralController {

    public static async helloWorld(ctx: BaseContext, next: () => void) {
        ctx.status = 200;
        ctx.state.message = 'Hello World!'
        await next();
    }

    public static async login(ctx: BaseContext, next: () => void) {
        const userRepository: Repository<User> = getManager().getRepository(User);
        let userTobeLoggedin: User = new User();
        userTobeLoggedin.nic = +ctx.request.body.nic;
        userTobeLoggedin.password = ctx.request.body.password;

        if (!await userRepository.findOne({ nic: userTobeLoggedin.nic, password: userTobeLoggedin.password })) {
            // return BAD REQUEST status code on invalid credentials
            ctx.status = 400;
            ctx.state.message = 'The specified credentials are invalid';
        } else {
            userTobeLoggedin = await userRepository.findOne({ nic: userTobeLoggedin.nic });
            var token = sign({ ...userTobeLoggedin }, config.jwtSecret, { expiresIn: '24h' });
            ctx.status = 200;
            ctx.state.data = {
                token
            }
        }
        await next();
    }

    public static async forgetPassword(ctx: BaseContext, next: () => void) {
        await next();
    }

    public static async resetPassword(ctx: BaseContext, next: () => void) {
        await next();
    }
}