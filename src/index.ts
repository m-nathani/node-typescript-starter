import * as Koa from 'koa';
import * as koaBody from 'koa-body';
import * as helmet from 'koa-helmet';
import * as cors from '@koa/cors';
import * as winston from 'winston';
import 'reflect-metadata';
import { logger } from './logging';
import { config } from './config';
import { router } from './routes';
import { bootstrap } from './bootstap';
import response from './middleware/response';
import error from './middleware/error';

bootstrap().then(async connection => {

    const app = new Koa();

    // Provides important security headers to make your app more secure
    app.use(helmet());

    // Enable cors with default options
    app.use(cors());

    // Logger middleware -> use winston as logger (logging.ts with config)
    app.use(logger(winston));

    // Enable koa-body with custom options
    app.use(koaBody({ jsonLimit: '50mb', formLimit: '50mb', multipart: true, json: true }));

    // Handle error on any throws
    app.use(error());

    // this routes are protected by the JWT middleware, also include middleware to respond with "Method Not Allowed - 405".
    app.use(router.routes()).use(router.allowedMethods());

    // Enable response middleware
    app.use(response());

    app.listen(config.port);

    console.log(`Server running on port ${config.port}`);

}).catch(error => console.log('server error: ', error));