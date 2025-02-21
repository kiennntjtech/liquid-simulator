import { config } from 'dotenv';
config();

import { Module } from '@nestjs/common';
import { ConfigModule } from '../../config/config.module';
import { DatabaseModule } from '../../database/database.module';
import { ClsModule } from 'nestjs-cls';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    ClsModule.forRoot({
      global: true,
      middleware: { mount: true },
    }),
  ],
  providers: [],
  controllers: [],
  exports: [],
})
export class TestWithDbModule {}
