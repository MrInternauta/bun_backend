import express, { Router, Request, Response } from 'express';

const app = express();
const router: Router = Router();

const HOME = router.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    code: 200,
    message: 'Hello world from docker compose!',
  });
});

app.use(HOME);

export default app;
