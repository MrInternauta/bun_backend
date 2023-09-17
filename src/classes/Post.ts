import { StatusCodes } from '../helpers/StatusCodes';
import { Database } from './Database';
import { Request, Response } from 'express';
export class Post {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any

  async create(req: Request, res: Response) {
    try {
      const { currentUser } = req.body;
      const { body } = req.body;
      const post = await Database?.prismaDB.post.create({
        data: { body, userId: currentUser?.id },
      });
      res.status(StatusCodes.OK).json(post);
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Wrong request!',
      });
    }
  }

  async get(req: Request, res: Response) {
    const { take, skip } = req.query;
    try {
      const posts = await Database?.prismaDB?.post.findMany({
        orderBy: { createdAt: 'desc' },
        skip: skip && typeof skip == 'number' ? skip : 0,
        take: take && typeof take == 'number' ? take : 10,
        include: {
          user: true,
          comments: true,
        },
      });
      return res.status(StatusCodes.OK).json(posts);
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Wrong request!',
      });
    }
  }

  async getByUser(req: Request, res: Response) {
    try {
      const { take, skip } = req.query;
      const { userId } = req.params;
      if (!userId || typeof userId !== 'string') {
        throw new Error('Invalid ID');
      }

      const posts = await Database?.prismaDB?.post.findMany({
        orderBy: { createdAt: 'desc' },
        skip: skip && typeof skip == 'number' ? skip : 0,
        take: take && typeof take == 'number' ? take : 10,
        where: { userId },
        include: {
          user: true,
          comments: true,
        },
      });
      return res.status(StatusCodes.OK).json(posts);
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Wrong request!',
      });
    }
  }

  async getOne(req: Request, res: Response) {
    try {
      const { postId } = req.params;
      if (!postId || typeof postId !== 'string') {
        throw new Error('Invalid post Id');
      }

      const post = await Database?.prismaDB?.post.findUnique({
        where: {
          id: postId,
        },
        include: {
          user: true,
          comments: {
            include: {
              user: true,
            },
            orderBy: {
              createdAt: 'desc',
            },
          },
        },
      });
      return res.status(StatusCodes.OK).json(post);
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Wrong request!',
      });
    }
  }

  async comment(req: Request, res: Response) {
    try {
      const { currentUser } = req.body;
      const { body } = req.body;
      const { postId } = req.params;

      if (!postId || typeof postId !== 'string') {
        throw new Error('Invalid ID');
      }

      const comment = await Database?.prismaDB?.comment.create({
        data: {
          body,
          userId: currentUser.id,
          postId,
        },
      });

      // NOTIFICATION PART START
      const post = await Database?.prismaDB?.post.findUnique({
        where: {
          id: postId,
        },
      });

      if (post?.userId) {
        await Database?.prismaDB?.notification.create({
          data: {
            body: 'Someone replied on your tweet!',
            userId: post.userId,
          },
        });

        await Database?.prismaDB?.user.update({
          where: {
            id: post.userId,
          },
          data: {
            hasNotification: true,
          },
        });
      }

      // NOTIFICATION PART END

      return res.status(StatusCodes.OK).json(comment);
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Wrong request!',
      });
    }
  }

  async like(req: Request, res: Response) {
    try {
      const postId = req.params?.postId;
      const { currentUser } = req.body;
      if (!postId || typeof postId !== 'string') {
        throw new Error('Invalid ID');
      }

      const post = await Database?.prismaDB?.post.findUnique({
        where: {
          id: postId,
        },
      });

      if (!post) {
        throw new Error('Invalid ID');
      }
      const updatedLikedIds = [...(post.likedIds || [])];
      updatedLikedIds.push(currentUser.id);

      if (post?.userId) {
        await Database?.prismaDB?.notification.create({
          data: {
            body: 'Someone liked your tweet!',
            userId: post.userId,
          },
        });

        await Database?.prismaDB?.user.update({
          where: {
            id: post.userId,
          },
          data: {
            hasNotification: true,
          },
        });
      }
      const updatedPost = await Database?.prismaDB?.post.update({
        where: {
          id: postId,
        },
        data: {
          likedIds: updatedLikedIds,
        },
      });

      return res.status(StatusCodes.OK).json(updatedPost);
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Wrong request!',
      });
    }
  }

  async unLike(req: Request, res: Response) {
    try {
      const postId = req.params?.postId;
      const { currentUser } = req.body;
      if (!postId || typeof postId !== 'string') {
        throw new Error('Invalid ID');
      }

      const post = await Database?.prismaDB?.post.findUnique({
        where: {
          id: postId,
        },
      });

      if (!post) {
        throw new Error('Invalid ID');
      }
      let updatedLikedIds = [...(post.likedIds || [])];
      updatedLikedIds = updatedLikedIds.filter(likedId => likedId !== currentUser?.id);
      const updatedPost = await Database?.prismaDB?.post.update({
        where: {
          id: postId,
        },
        data: {
          likedIds: updatedLikedIds,
        },
      });

      return res.status(StatusCodes.OK).json(updatedPost);
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Wrong request!',
      });
    }
  }
}
