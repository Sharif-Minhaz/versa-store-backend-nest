import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHeathStatus() {
    return {
      status: 'UP',
      message: 'Api is up and running',
    };
  }
}
