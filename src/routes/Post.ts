import { Router } from 'express';
import { Middleware } from '../middlewares/Middleware';
import { Post } from '../classes/Post';
const router: Router = Router();
const middleware = new Middleware();
const Posts = new Post();

router.post('/posts', middleware.VerifyToken, Posts.create);
router.get('/posts', middleware.VerifyToken, Posts.get);
router.get('/posts/:userId/user', middleware.VerifyToken, Posts.getByUser);
router.get('/posts/:postId', middleware.VerifyToken, Posts.getOne);

router.post('/posts/:postId/comment', middleware.VerifyToken, Posts.comment);

router.post('/posts/:postId/like', middleware.VerifyToken, Posts.like);
router.delete('/posts/:postId/like', middleware.VerifyToken, Posts.unLike);

export default router;
