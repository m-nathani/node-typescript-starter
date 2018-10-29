import { BaseContext } from 'koa';
import { getManager, Repository, Not, Equal } from 'typeorm';
import { validate, ValidationError } from 'class-validator';
import { User } from '../entity/user';
import * as bcrypt from 'bcrypt';
import { saltRounds } from '../constant';

export default class UserController {

    public static async getUsers(ctx: BaseContext, next: () => void) {
        // get a user repository to perform operations with user
        const userRepository: Repository<User> = getManager().getRepository(User);
        // load all users
        const users: User[] = await userRepository.find();
        // return OK status code and loaded users array
        ctx.status = 200;
        ctx.state.data = users;
        await next();
    }

    public static async getUser(ctx: BaseContext, next: () => void) {

        // get a user repository to perform operations with user
        const userRepository: Repository<User> = getManager().getRepository(User);
        // load user by id
        const user: User = await userRepository.findOne({ nic: ctx.params.nic || '0' });
        if (user) {
            // return OK status code and loaded user object
            ctx.status = 200;
            ctx.state.data = user;
        } else {
            // return a BAD REQUEST status code and error message
            ctx.status = 400;
            ctx.state.message = 'The user you are trying to retrieve doesn\'t exist in the db';
        }
        await next();
    }

    public static async createUser(ctx: BaseContext, next: () => void) {

        // get a user repository to perform operations with user
        const userRepository: Repository<User> = getManager().getRepository(User);

        // build up entity user to be saved
        const userToBeSaved: User = new User();
        userToBeSaved.nic = ctx.request.body.nic;
        userToBeSaved.firstName = ctx.request.body.firstName;
        userToBeSaved.lastName = ctx.request.body.lastName;
        userToBeSaved.email = ctx.request.body.email;
        userToBeSaved.password = ctx.request.body.password;
        userToBeSaved.gender = ctx.request.body.gender;
        userToBeSaved.userType = +ctx.request.body.userType;

        // validate user entity
        const errors: ValidationError[] = await validate(userToBeSaved); // errors is an array of validation errors

        if (errors.length > 0) {
            // return BAD REQUEST status code and errors array
            ctx.status = 400;
            ctx.state.message = errors;
        } else if (await userRepository.findOne({ email: userToBeSaved.email })) {
            // return BAD REQUEST status code and email already exists error
            ctx.status = 400;
            ctx.state.message = 'The specified e-mail address already exists';
        } else {
            // save the user contained in the POST body
            userToBeSaved.password = bcrypt.hashSync(userToBeSaved.password, bcrypt.genSaltSync(saltRounds));
            const user = await userRepository.save(userToBeSaved);
            // return CREATED status code and updated user
            ctx.status = 200;
            ctx.state.data = user;
        }
        await next();
    }

    public static async updateUser(ctx: BaseContext, next: () => void) {

        // get a user repository to perform operations with user
        const userRepository: Repository<User> = getManager().getRepository(User);

        // update the user by specified id
        // build up entity user to be updated
        const userToBeUpdated: User = new User();
        userToBeUpdated.id = +ctx.params.id || 0; // will always have a number, this will avoid errors
        userToBeUpdated.nic = ctx.request.body.nic;
        userToBeUpdated.firstName = ctx.request.body.firstName;
        userToBeUpdated.lastName = ctx.request.body.lastName;
        userToBeUpdated.email = ctx.request.body.email;
        userToBeUpdated.gender = ctx.request.body.gender;
        userToBeUpdated.userType = +ctx.request.body.userType;

        // validate user entity
        const errors: ValidationError[] = await validate(userToBeUpdated); // errors is an array of validation errors

        if (errors.length > 0) {
            // return BAD REQUEST status code and errors array
            ctx.status = 400;
            ctx.state.message = errors;
        } else if (!await userRepository.findOne(userToBeUpdated.id)) {
            // check if a user with the specified id exists
            // return a BAD REQUEST status code and error message
            ctx.status = 400;
            ctx.state.message = 'The user you are trying to update doesn\'t exist in the db';
        } else if (await userRepository.findOne({ id: Not(Equal(userToBeUpdated.id)), email: userToBeUpdated.email })) {
            // return BAD REQUEST status code and email already exists error
            ctx.status = 400;
            ctx.state.message = 'The specified e-mail/nic address already exists';
        } else {
            // save the user contained in the PUT body
            const user = await userRepository.save(userToBeUpdated);
            // return CREATED status code and updated user
            ctx.status = 200;
            ctx.state.data = user;
        }
        await next();
    }

    public static async deleteUser(ctx: BaseContext, next: () => void) {
        // get a user repository to perform operations with user
        const userRepository = getManager().getRepository(User);
        // find the user by specified id
        const userToRemove: User = await userRepository.findOne(+ctx.params.id || 0);
        if (!userToRemove) {
            // return a BAD REQUEST status code and error message
            ctx.status = 400;
            ctx.state.message = 'The user you are trying to delete doesn\'t exist in the db';
        } else if (+ctx.state.user.id !== userToRemove.id) {
            // check user's token id and user id are the same
            // if not, return a FORBIDDEN status code and error message
            ctx.status = 403;
            ctx.state.message = 'A user can only be deleted by himself';
        } else {
            // the user is there so can be removed
            await userRepository.remove(userToRemove);
            // return a NO CONTENT status code
            ctx.status = 204;
            ctx.state.data = { 1: 'removed' };
        }
        await next();
    }
}
