import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class CatchEverythingFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let detailMessage = '';

    if (typeof exception === 'object' && exception !== null) {
      const exceptionAny = exception as any;
      if (exceptionAny.driverError?.detail) {
        detailMessage = exceptionAny.driverError.detail;
      } else if (exceptionAny.message) {
        detailMessage = exceptionAny.message; // fallback to a generic message
      }
    }

    const responseBody = {
      success: false,
      message: detailMessage,
      errors:
        exception instanceof BadRequestException
          ? exception.getResponse()
          : undefined,
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
