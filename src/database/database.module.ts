import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuditModule } from '@/audit/audit.module';

import { TestEntity } from 'src/test/entities/test.entity';
import { AuditLogEntity } from '@/audit/audit.log.entity';
import { join } from 'path';

@Module({
  imports: [
    AuditModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('db.host'),
        port: configService.get<number>('db.port'),
        username: configService.get('db.username'),
        password: configService.get('db.password'),
        database: configService.get('db.database'),
        synchronize: false,
        autoLoadEntities: true,
        entities: [
          TestEntity,
          AuditLogEntity,

          join(__dirname, '..', 'entities', '*.entity.{ts,js}'),
        ],
      }),
    }),
  ],
})
export class DatabaseModule {}
