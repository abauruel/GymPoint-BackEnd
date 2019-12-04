import { Router } from 'express';

import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import Middleware from './app/middlewares/auth';

const route = new Router();

route.post('/session', SessionController.store);
route.use(Middleware);
route.post('/student', StudentController.store);
route.put('/student', StudentController.update);

export default route;
