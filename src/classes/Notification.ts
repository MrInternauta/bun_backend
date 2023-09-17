import { StatusCodes } from '../helpers/StatusCodes';
import { Database } from './Database';
import { Request, Response } from 'express';

export class Notifications {
  async get(req: Request, res: Response) {
    try {
      const { userId } = req.query;

      if (!userId || typeof userId !== 'string') {
        throw new Error('Invalid user Id');
      }

      const notifications = await Database?.prismaDB?.notification.findMany({
        where: {
          userId: userId,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      await Database?.prismaDB?.user.update({
        where: {
          id: userId,
        },
        data: {
          hasNotification: false,
        },
      });
      return res.status(StatusCodes.OK).json(notifications);
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Wrong request!',
      });
    }
  }
}
