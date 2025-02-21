import { Module } from '@nestjs/common';
import { EntitySubscriber } from 'src/audit/entity.subscriber';
import { AuditLogEntity } from './audit.log.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([AuditLogEntity])],
  providers: [EntitySubscriber],
})
export class AuditModule {}
