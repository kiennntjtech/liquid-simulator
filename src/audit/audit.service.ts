// import { Connection, EntitySubscriberInterface, getMetadataArgsStorage, Repository, UpdateEvent } from 'typeorm';
// import { Injectable } from '@nestjs/common';
// import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
// import { updatedDiff } from 'deep-object-diff';
// import { AuditTrailEntity } from '../entities/AuditTrailEntity';
// import { AuditTrailValueEntity } from '../entities/AuditTrailValueEntity';
// import { AuditHistoryToAuditTrailEntity } from '../entities/AuditHistoryToAuditTrailEntity';
// import { AuditHistoryEntity } from '../entities/AuditHistoryEntity';

// @Injectable()
// export class AuditService implements EntitySubscriberInterface {
//   constructor(
//     @InjectConnection()
//     private readonly connection: Connection,
//     @InjectRepository(AuditHistoryEntity)
//     private readonly _ahRepo: Repository<AuditHistoryEntity>,
//     @InjectRepository(AuditHistoryToAuditTrailEntity)
//     private readonly _ahatRepo: Repository<AuditHistoryToAuditTrailEntity>,
//     @InjectRepository(AuditTrailEntity)
//     private readonly _atRepo: Repository<AuditTrailEntity>,
//     @InjectRepository(AuditTrailValueEntity)
//     private readonly _atvRepo: Repository<AuditTrailValueEntity>,
//   ) {
//     console.log('Audit Service Constructed');
//     connection.subscribers.push(this);
//   }

//   public async afterUpdate(event: UpdateEvent<any>) {
//     if (this._shouldIgnore(event)) {
//       return;
//     }
//     const entityName = event.databaseEntity.constructor.name;
//     const dbEntity: any = await this.connection
//       .getRepository(entityName)
//       .preload(event.databaseEntity);

//     const new_object = updatedDiff(dbEntity, event.entity);
//     const old_object = updatedDiff(event.entity, dbEntity);

//     const ah = this._ahRepo.create({newSnapshot: new_object, oldSnapshot: old_object});
//     const auditHistory = await this._ahRepo.save(ah);

//     this._saveAuditBreakdown(entityName, old_object, new_object, auditHistory);
//   }

//   private _shouldIgnore = (event: { databaseEntity: any }) => {
//     return event.databaseEntity.constructor.name.includes('Audit');
//   }

//   private _saveAuditBreakdown(entity_name: string, old_object: any, new_object: any, auditHistory: AuditHistoryEntity) {
//     const obj = new_object;
//     const keys = Object.keys(obj);
//     keys.forEach((key) => {
//       if (this._findTableMetadata(key)) {
//         this._saveAuditBreakdown(key, old_object[key], new_object[key], auditHistory);
//       } else {
//         this._logTableChange(entity_name, key, old_object[key], new_object[key], auditHistory);
//       }
//     });
//   }

//   private async _logTableChange(tableKeyInObject: string,
//                                 column_name: string,
//                                 old_value: any,
//                                 new_value: any,
//                                 auditHistory: AuditHistoryEntity,
//   ) {
//     await this.connection.transaction(async (em) => {
//       const trailObj = this._atRepo.create({tableName: this._getTableName(tableKeyInObject)});
//       const trail = await em.save(trailObj);
//       const historyWithTrail = this._ahatRepo.create({AuditHistory: auditHistory, AuditTrail: trail});
//       const valueObj = this._atvRepo.create({AuditTrail: trail, column_name, old_value, new_value});
//       await em.save(valueObj);
//       await em.save(historyWithTrail);
//     });
//   }

//   private _findTableMetadata(entityLikeName: string) {
//     // @ts-ignore
//     return getMetadataArgsStorage().tables.find(x => x.target.name === entityLikeName || x.target.name === `${entityLikeName}Entity`);
//   }

//   private _getTableName(entityLikeName: string) {
//     const metadata = this._findTableMetadata(entityLikeName);
//     if (metadata) {
//       return metadata.name;
//     }
//     return null;
//   }
// }
