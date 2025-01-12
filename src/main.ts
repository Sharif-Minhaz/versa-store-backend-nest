import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerErrorInterceptor } from 'nestjs-pino';
import { logRegisteredRoutes } from 'nestjs-routes-viewer';
import { CatchEverythingFilter } from './utils/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api/v1', { exclude: ['health'] });
  app.useGlobalFilters(new CatchEverythingFilter(app.get(HttpAdapterHost)));
  app.useGlobalInterceptors(new LoggerErrorInterceptor());
  await app.listen(process.env.PORT ?? 9000);

  logRegisteredRoutes(app, { ignoreMethods: ['acl'] });
}
bootstrap();
