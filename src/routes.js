import { Router } from 'express';

import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import PlanController from './app/controllers/PlanController';
import RegistrationController from './app/controllers/RegistrationController';
import CheckinController from './app/controllers/CheckinController';
import HelpOrderController from './app/controllers/HelpOrderController';
import Middleware from './app/middlewares/auth';

const route = new Router();

route.post('/session', SessionController.store);

route.post('/students/:id/checkins', CheckinController.store);
route.get('/students/:id/checkins', CheckinController.index);

route.post('/students/:id/help-orders', HelpOrderController.store);
route.get('/students/:id/help-orders', HelpOrderController.show);

route.use(Middleware);
route.get('/students', StudentController.index);
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

route.get('/students/help-orders', HelpOrderController.index);
route.post('/help-orders/:id/answer', HelpOrderController.update);

export default route;
