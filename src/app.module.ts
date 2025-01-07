import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoryModule } from './category/category.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import dbConfig from './config/db.config';
import dbConfigProduction from './config/db.config.production';
import { LoggerModule } from 'nestjs-pino';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import cloudinaryConfig from './config/cloudinary.config';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: [
        {
          name: 'Full request logging information',
          level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
          transport:
            process.env.NODE_ENV !== 'production'
              ? { target: 'pino-pretty', options: { colorize: true } }
              : undefined,
        },
        process.stdout,
      ],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      envFilePath: '.env',
      load: [dbConfig, dbConfigProduction, cloudinaryConfig],
    }),
    CategoryModule,
    TypeOrmModule.forRootAsync({
      useFactory:
        process.env.NODE_ENV === 'production' ? dbConfigProduction : dbConfig,
    }),
    CloudinaryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
