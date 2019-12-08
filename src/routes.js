import { Router } from 'express';

import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import PlanController from './app/controllers/PlanController';
import RegistrationController from './app/controllers/RegistrationController';
import Middleware from './app/middlewares/auth';

const route = new Router();

route.post('/session', SessionController.store);
route.use(Middleware);
route.post('/student', StudentController.store);
route.put('/student/:id', StudentController.update);
route.get('/plans', PlanController.index);
route.post('/plan', PlanController.store);
route.put('/plan/:id', PlanController.update);
route.delete('/plan/:id', PlanController.delete);
route.get('/registrations', RegistrationController.index);
route.post('/registration', RegistrationController.store);
route.put('/registration/:id', RegistrationController.update);
route.delete('/registration/:id', RegistrationController.delete);

export default route;
