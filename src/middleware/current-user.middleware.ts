import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { AuthRequest } from '../types/AuthRequest';
import { UserEntity } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private readonly usersService: UsersService) {}

  async use(req: AuthRequest, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      req.user = new UserEntity();
      next();
      return;
    }

    const token = req.headers.authorization.split(' ')[1];

    if (!token) {
      req.user = new UserEntity();
      next();
      return;
    }

    const jwtSecret = process.env.JWT_KEY_ACCESS;
    if (!jwtSecret) {
      throw new HttpException('No token provided', HttpStatus.BAD_REQUEST);
    }

    try {
      const decode = verify(token, jwtSecret) as { id: string };
      console.log(decode.id);
      const user = await this.usersService.findOne(Number(decode.id));

      req.user = user;
      next();
    } catch (err) {
      req.user = new UserEntity();
      next();
    }
  }
}
