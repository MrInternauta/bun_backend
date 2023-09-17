import { Config } from '../config/Config';
import { StatusCodes } from '../helpers/StatusCodes';
import { Database } from './Database';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export class Auth {
  async login(req: Request, res: Response) {
    try {
      const credentials: { email: string; password: string } = req.body;
      if (!credentials?.email || !credentials?.password) {
        throw new Error('Invalid credentials');
      }
      const user = await Database.prismaDB.user.findUnique({
        where: {
          email: credentials.email,
        },
      });

      if (!user || !user?.hashedPassword) {
        throw new Error('Invalid credentials');
      }

      const isCorrectPassword = await Bun.password.verify(credentials.password, user.hashedPassword, 'bcrypt');

      if (!isCorrectPassword) {
        throw new Error('Invalid credentials');
      }

      const TOKEN = jwt.sign({ user }, Config.config.JWT_SEED.toString(), {
        expiresIn: Config.config.EXPIRE_TOKEN,
        algorithm: 'HS256',
      });

      return res.status(StatusCodes.OK).json(TOKEN);
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Wrong request!',
      });
    }
  }
}
