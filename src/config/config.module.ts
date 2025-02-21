import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

import appConfig from './app.config';
import authConfig from './auth.config';
import cacheConfig from './cache.config';
import databaseConfig from './database.config';
import mailConfig from './mail.config';
import storageConfig from './storage.config';
import sticpayConfig from './sticpay.config';
import platformConfig from './platform.config';

// const validationSchema = Joi.object({
//   // App
//   TZ: Joi.string().default('UTC'),
//   PORT: Joi.number().default(3100),
//   SECRET_KEY: Joi.string().required(),
//   NODE_ENV: Joi.string()
//     .valid('development', 'production')
//     .default('development'),

//   // URLs
//   PUBLIC_URL: Joi.string().default('http://localhost:3000'),
//   PUBLIC_SERVER_URL: Joi.string().default('http://localhost:3100'),

//   // Database
//   DB_HOST: Joi.string().required(),
//   DB_PORT: Joi.number().default(5432),
//   DB_NAME: Joi.string().required(),
//   DB_USER: Joi.string().required(),
//   DB_PASSWORD: Joi.string().required(),

//   // Auth
//   JWT_SECRET: Joi.string().required(),
//   JWT_EXPIRY_TIME: Joi.number().required(),

//   // Mail
//   MAIL_FROM_NAME: Joi.string().allow(''),
//   MAIL_FROM_EMAIL: Joi.string().allow(''),
//   MAIL_HOST: Joi.string().allow(''),
//   MAIL_PORT: Joi.string().allow(''),
//   MAIL_USERNAME: Joi.string().allow(''),
//   MAIL_PASSWORD: Joi.string().allow(''),

//   // Storage
//   STORAGE_BUCKET: Joi.string().allow(''),
//   STORAGE_REGION: Joi.string().allow(''),
//   STORAGE_ENDPOINT: Joi.string().allow(''),
//   STORAGE_URL_PREFIX: Joi.string().allow(''),
//   STORAGE_ACCESS_KEY: Joi.string().allow(''),
//   STORAGE_SECRET_KEY: Joi.string().allow(''),
// });

@Module({
  imports: [
    NestConfigModule.forRoot({
      envFilePath: ['.env'],
      load: [
        appConfig,
        authConfig,
        cacheConfig,
        databaseConfig,
        mailConfig,
        storageConfig,
        sticpayConfig,
        platformConfig,
      ],
      isGlobal: true,
      //validationSchema: validationSchema,
    }),
  ],
})
export class ConfigModule {}
