import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  register() {
    return {
      message: 'User registered successfully',
      success: true,
      user: null,
    };
  }
}
