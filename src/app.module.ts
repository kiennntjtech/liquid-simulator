import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';
import { HealthModule } from './health/health.module';
import { TestModule } from './test/test.module';
import { ClsModule } from 'nestjs-cls';
import { AuthorizationModule } from './authorization/authorization.module';
import { ResponseTransformInterceptor } from './interceptor/response.interceptor';
import { HelperModule } from './helper/helper.module';
import { ToolModule } from './tool/tool.module';
import { LiquidSimulatorModule } from './liquid-simulator/liquid-simulator.module';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    ScheduleModule.forRoot(),
    AppModule,

    AuthorizationModule,
    LiquidSimulatorModule,
    HealthModule,
    ClsModule.forRoot({
      global: true,
      middleware: { mount: true },
    }),
    TestModule,

    HelperModule.register(),

    ToolModule,

    EventEmitterModule.forRoot(),
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseTransformInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
  controllers: [AppController],
})
export class AppModule {}
