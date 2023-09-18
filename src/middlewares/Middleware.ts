/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { StatusCodes } from '../helpers/StatusCodes';
import { Config } from '../config/Config';

export class Middleware {
  VerifyToken(req: Request, res: Response, next: () => void) {
    let TOKEN: string = req.headers.authorization || '';
    TOKEN = TOKEN.replace('Bearer ', '');
    jwt.verify(TOKEN, Config.config.JWT_SEED, (error: any, decoded: any) => {
      if (error || !decoded || (decoded && typeof decoded === 'string')) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          message: 'Invalid token',
        });
      }
      if (!decoded?.user) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          message: 'Invalid token',
        });
      }
      req.body.currentUser = decoded?.user ? decoded?.user : null;
      next();
    });
  }
}
