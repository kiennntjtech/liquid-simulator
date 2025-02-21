import {
  EventSubscriber,
  EntitySubscriberInterface,
  InsertEvent,
  DataSource,
  UpdateEvent,
  RemoveEvent,
  Repository,
} from 'typeorm';
import { Injectable } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { AuditableEntity } from './auditable.entity';
import { use } from 'passport';
import { AuditLogEntity, AuditingAction } from './audit.log.entity';
import { audit } from 'rxjs';
import { AuditTrailEntity } from './audittrail.entity';

@EventSubscriber()
@Injectable()
export class EntitySubscriber
  implements EntitySubscriberInterface<AuditableEntity>
{
  constructor(
    private readonly clsService: ClsService,
    @InjectDataSource() readonly dataSource: DataSource,
    @InjectRepository(AuditLogEntity)
    readonly auditLogRepository: Repository<AuditLogEntity>,
  ) {
    dataSource.subscribers.push(this);
  }

  beforeInsert(event: InsertEvent<AuditableEntity>) {
    if (event.entity instanceof AuditableEntity) {
      const user = this.clsService.get('user');
      if (user) {
        event.entity.createdBy = user.id;
        event.entity.lastUpdatedBy = user.id;

        if (event.entity instanceof AuditTrailEntity) {
          const auditLog = {
            entityName: event.entity.constructor.name,
            byUser: user.id,
            action: AuditingAction.Create,
            newData: JSON.stringify(event.entity),
          };
          this.auditLogRepository.save(auditLog);
        }
      }
    }
  }

  async beforeUpdate(event: UpdateEvent<AuditableEntity>) {
    if (event.entity instanceof AuditableEntity) {
      const user = this.clsService.get('user');
      if (user) {
        event.entity.lastUpdatedBy = user.id;

        if (event.entity instanceof AuditTrailEntity) {
          //get old record before updating
          const entityRepository = this.dataSource.getRepository(
            event.entity.constructor.name,
          );
          const oldEntity = await entityRepository.findOneBy({
            id: event.entity.id,
          });
          const auditLog = {
            entityName: event.entity.constructor.name,
            byUser: user.id,
            action: AuditingAction.Update,
            newData: JSON.stringify(event.entity),
            oldData: JSON.stringify(oldEntity),
          };
          this.auditLogRepository.save(auditLog);
        }
      }
    }
  }

  async beforeRemove(event: RemoveEvent<AuditableEntity>) {
    if (event.entity instanceof AuditTrailEntity) {
      const user = this.clsService.get('user');

      //get old record before deleting
      const entityRepository = this.dataSource.getRepository(
        event.entity.constructor.name,
      );
      const oldEntity = await entityRepository.findOneBy({
        id: event.entity.id,
      });
      const auditLog = {
        entityName: event.entity.constructor.name,
        byUser: user.id,
        action: AuditingAction.Delete,
        oldData: JSON.stringify(oldEntity),
      };
      this.auditLogRepository.save(auditLog);
    }
  }
}
