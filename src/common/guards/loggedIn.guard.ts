import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LoggedInGuard extends AuthGuard('jwt') implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // Step 1: Validate the JWT and populate req.user
    try {
      await super.canActivate(context); // This calls AuthGuard('jwt')
    } catch (err) {
      console.error(err);
      return true;
    }

    // Step 2: Check if user is already logged in
    const user = request.user;
    if (user) {
      throw new UnauthorizedException('You are already logged in.');
    }

    // Step 3: Allow access if no user is logged in
    return true;
  }
}
