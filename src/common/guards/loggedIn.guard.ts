import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class LoggedInGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    console.log('🚀 ~ LoggedInGuard ~ canActivate ~ user:', user);

    if (user) {
      // If user is already logged in, throw an error
      throw new UnauthorizedException('You are already logged in.');
    }

    // Allow access if no user is logged in
    return true;
  }
}
