import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response } from 'express';
import { StatusCodes } from '../helpers/StatusCodes';
import { Config } from '../config/Config';

export class Middleware {
  VerifyToken(req: Request, res: Response, next: () => void) {
    const TOKEN: string = req.get('token') || '';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jwt.verify(TOKEN, Config.config.JWT_SEED, (error: any, decoded: any) => {
      if (error || !decoded || (decoded && typeof decoded === 'string')) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          message: 'Invalid token',
        });
      }
      if (!this.instanceOfJwtPayload(decoded)) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          message: 'Invalid token',
        });
      }
      req.body.currentUser = decoded?.user ? decoded?.user : null;
      next();
    });
  }

  instanceOfJwtPayload(object: object): object is JwtPayload {
    return 'usuario' in object;
  }
}
