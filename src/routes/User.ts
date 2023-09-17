import { Router } from 'express';
import { Middleware } from '../middlewares/Middleware';
import { User } from '../classes/User';
import { Notifications } from '../classes/Notification';
const router: Router = Router();
const middleware = new Middleware();
const UserClass = new User();
const notification = new Notifications();

router.post('/users', UserClass.create);
router.get('/users', middleware.VerifyToken, UserClass.get);
router.get('/users/:userId', middleware.VerifyToken, UserClass.getOne);

router.put('/users/:userId', middleware.VerifyToken, UserClass.update);

router.post('/users/follow', middleware.VerifyToken, UserClass.follow);
router.delete('/users/follow', middleware.VerifyToken, UserClass.unFollow);

router.get('/users/notification', middleware.VerifyToken, notification.get);

export default router;
