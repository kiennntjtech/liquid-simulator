import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { WsAdapter } from '@nestjs/platform-ws';

import { AppModule } from './app.module';

const bootstrap = async () => {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  Logger.log(
    `Node is master ${configService.get('app.is_master')} ${configService.get(
      'NODE_APP_INSTANCE',
    )}`,
  );

  app.useWebSocketAdapter(new WsAdapter(app));
  // const appUrl = configService.get('app.url');

  // Middleware
  app.enableCors({ origin: '*', credentials: true });
  app.enableShutdownHooks();

  // Pipes
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // Register swagger
  const config = new DocumentBuilder()
    .setTitle('Liquid simulator API')
    .setDescription('Liquid simulator API')
    .setVersion('1.0')
    .addTag('Liquid simulator API')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  // Server Port
  const port = configService.get<number>('app.port');
  await app.listen(port);

  Logger.log(`🚀 Server is up and running at ${port}!`);
};

bootstrap();
