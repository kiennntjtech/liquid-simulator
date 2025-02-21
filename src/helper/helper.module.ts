import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { HelperService } from './helper.service';
import { HttpModule } from '@nestjs/axios';

@Global()
@Module({
  imports: [ConfigModule, HttpModule],
})
export class HelperModule {
  static register(): DynamicModule {
    return {
      module: HelperModule,
      providers: [HelperService],
      exports: [HelperService],
    };
  }
}
