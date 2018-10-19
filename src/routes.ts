import * as Router from 'koa-router';
import * as controller from './controller';
import { auth } from './middleware/auth';

const router = new Router();

// GENERAL ROUTES
router.get('/', controller.general.helloWorld);
router.post('/login', controller.general.login);
router.post('/forget/password', auth(), controller.general.forgetPassword);
router.put('/reset/password', auth(), controller.general.resetPassword);


// USER ROUTES
router.get('/users', auth(), controller.user.getUsers);
router.get('/users/:nic', auth(), controller.user.getUser);
router.post('/users', auth(), controller.user.createUser);
router.put('/users/:id', auth(), controller.user.updateUser);
router.delete('/users/:id', auth(), controller.user.deleteUser);

// LOOKUP ROUTES
router.get('/lookups', auth(), controller.lookup.getLookups);
router.get('/seed-lookups', controller.lookup.seedLookups);

export { router };