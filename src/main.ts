import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerErrorInterceptor } from 'nestjs-pino';
import { CatchEverythingFilter } from './utils/all-exceptions.filter';
// import { INestApplication } from '@nestjs/common';
import { logRegisteredRoutes } from 'nestjs-routes-viewer';

// type HttpMethod =
//   | 'get'
//   | 'post'
//   | 'put'
//   | 'delete'
//   | 'patch'
//   | 'options'
//   | 'head'
//   | 'acl'
//   | 'trace'
//   | 'connect';

// interface RouteInfo {
//   method: string;
//   path: string;
//   guards: string[];
// }

// export function logRegisteredRoutes(
//   app: INestApplication<any>,
//   {
//     ignoreMethods,
//     showGuards = false,
//   }: { ignoreMethods?: HttpMethod[]; showGuards?: boolean },
// ) {
//   const methodsToIgnore = ignoreMethods || [];
//   const server = app.getHttpServer();
//   const router = server._events?.request?._router;

//   if (!router || !router.stack) {
//     console.error(
//       'Router is not available. Ensure the application uses Express.',
//     );
//     return;
//   }

//   const routes: RouteInfo[] = router.stack
//     .filter(
//       (layer: any) =>
//         layer.route &&
//         !methodsToIgnore.includes(
//           Object.keys(
//             layer.route?.methods || {},
//           )[0].toLowerCase() as HttpMethod,
//         ),
//     )
//     .map((layer: any) => {
//       const route = layer.route;
//       const handler = route?.stack[0]?.handle;

//       // Get guards
//       const guards = Reflect.getMetadata('__guards__', handler) || [];
//       const guardNames = guards
//         .map((guard: any) => guard.name || 'Unknown')
//         .filter((name: string) => name !== 'Unknown');

//       return {
//         method: Object.keys(route.methods)[0].toUpperCase(),
//         path: route.path,
//         guards: guardNames,
//       };
//     });

//   const formattedRoutes = routes.map((route) => {
//     const formattedRoute: any = {
//       method: route.method,
//       path: route.path,
//     };
//     if (showGuards) {
//       formattedRoute.guards = route.guards.join(', ') || 'None';
//     }
//     return formattedRoute;
//   });

//   console.log('Registered Routes:');
//   console.table(formattedRoutes);
// }

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api/v1', { exclude: ['health'] });
  app.useGlobalFilters(new CatchEverythingFilter(app.get(HttpAdapterHost)));
  app.useGlobalInterceptors(new LoggerErrorInterceptor());
  await app.listen(process.env.PORT ?? 9000);
  logRegisteredRoutes(app, { ignoreMethods: ['acl'] });
}

bootstrap();
