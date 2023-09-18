import express, { Router, Request, Response } from 'express';
import usersRoutes from './User';
import postsRoutes from './Post';

import { Auth } from '../classes/Auth';
import { StatusCodes } from '../helpers/StatusCodes';

const app = express();
const router: Router = Router();
const auth: Auth = new Auth();

router.get('/', (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({
    message: 'Hello world from twitter!',
  });
});

router.post('/login', auth.login);

app.use(router);
app.use(usersRoutes);
app.use(postsRoutes);

export default app;
