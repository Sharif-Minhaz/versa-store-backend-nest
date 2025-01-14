import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class IsVendorGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      // If user is already logged in, throw an error
      throw new UnauthorizedException('User is not logged in.');
    }

    // Check if the user is an vendor
    if (user.user_type === 'vendor') {
      // If the user is not an vendor, throw an error
      return true;
    }

    // Allow access if no user is logged in
    throw new UnauthorizedException('User is not an vendor.');
  }
}
