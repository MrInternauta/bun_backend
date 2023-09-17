import { StatusCodes } from '../helpers/StatusCodes';
import { Database } from './Database';
import { Request, Response } from 'express';

export class User {
  constructor() {}

  async get(req: Request, res: Response) {
    try {
      const { take, skip } = req.query;
      const users = await Database?.prismaDB?.user.findMany({
        orderBy: { createdAt: 'desc' },
        skip: take && typeof take == 'number' ? take : 10,
        take: skip && typeof skip == 'number' ? skip : 0,
      });
      return res.status(StatusCodes.OK).json(users);
    } catch (error) {
      //console.log(error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Wrong request!',
      });
    }
  }

  async getOne(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      if (!userId || typeof userId !== 'string') {
        throw new Error('Invalid user Id');
      }

      const user = await Database?.prismaDB?.user.findUnique({
        where: {
          id: userId,
        },
      });
      const followersCount = await Database?.prismaDB?.user.count({
        where: {
          followingId: {
            has: userId,
          },
        },
      });

      return res.status(StatusCodes.OK).json({ ...user, followersCount });
    } catch (error) {
      //console.log(error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Wrong request!',
      });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { email, userName, name, password } = req.body;
      const hashedPassword = await Bun.password.hash(password, 'bcrypt');
      const user = await Database?.prismaDB?.user.create({
        data: {
          email,
          name,
          userName,
          hashedPassword,
        },
      });
      return res.status(StatusCodes.OK).json(user);
    } catch (error) {
      //console.log(error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Wrong request!',
      });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      const { name, userName, bio, profileImage, coverImage } = req.body;
      if (!name || !userName) {
        throw new Error('Missing fields');
      }
      const updatesUser = await Database?.prismaDB?.user.update({
        where: { id: userId },
        data: {
          name,
          userName,
          bio,
          profileImage,
          coverImage,
        },
      });
      return res.status(StatusCodes.OK).json(updatesUser);
    } catch (error) {
      // console.log(error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Wrong request!',
      });
    }
  }

  async follow(req: Request, res: Response) {
    // NOTIFICATION PART START
    try {
      const userId = req.body?.userId;

      const { currentUser } = req.body;

      if (!userId || typeof userId !== 'string') {
        throw new Error('Invalid ID');
      }
      const user = await Database?.prismaDB?.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (!user) {
        throw new Error('Invalid ID');
      }

      const updatedFollowingIds = [...(user.followingId || [])];

      updatedFollowingIds.push(userId);

      await Database?.prismaDB?.notification.create({
        data: {
          body: 'Someone followed you!',
          userId: userId,
        },
      });

      await Database?.prismaDB?.user.update({
        where: {
          id: userId,
        },
        data: {
          hasNotification: true,
        },
      });
      const updatedUser = await Database?.prismaDB?.user.update({
        where: {
          id: currentUser.id,
        },
        data: {
          followingId: updatedFollowingIds,
        },
      });

      return res.status(StatusCodes.OK).json(updatedUser);
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Wrong request!',
      });
    }
  }

  async unFollow(req: Request, res: Response) {
    try {
      const userId = req.query?.userId;

      const { currentUser } = req.body;

      if (!userId || typeof userId !== 'string') {
        throw new Error('Invalid ID');
      }

      const user = await Database?.prismaDB?.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (!user) {
        throw new Error('Invalid ID');
      }

      let updatedFollowingIds = [...(user.followingId || [])];

      updatedFollowingIds = updatedFollowingIds.filter(followingId => followingId !== userId);

      const updatedUser = await Database?.prismaDB?.user.update({
        where: {
          id: currentUser.id,
        },
        data: {
          followingId: updatedFollowingIds,
        },
      });

      return res.status(StatusCodes.OK).json(updatedUser);
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Wrong request!',
      });
    }
  }
}
