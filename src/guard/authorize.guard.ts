import { SetMetadata } from '@nestjs/common';
import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const AuthorizeRole = (...role: string[]) =>
  SetMetadata('allowedrole', role);

@Injectable()
export class AuthorizeGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const allowedRole = this.reflector.get<string[]>(
      'allowedrole',
      context.getHandler(),
    );

    if (!allowedRole || allowedRole.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const userRole = request?.user?.role;

    if (!userRole) {
      throw new HttpException('Access denied', HttpStatus.UNAUTHORIZED);
    }

    const userRoles = Array.isArray(userRole) ? userRole : [userRole];

    const hasPermission = userRoles.some((role: string) =>
      allowedRole.includes(role),
    );

    if (hasPermission) {
      return true;
    }

    throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
  }
}
