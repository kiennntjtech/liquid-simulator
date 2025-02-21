import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum AuditingAction {
  Create = 'Insert',
  Update = 'Update',
  Delete = 'Delete',
}

@Entity()
export class AuditLogEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  entityName: string;

  @Column()
  action: AuditingAction;

  @Column()
  byUser: string;

  @Column({ nullable: true })
  oldData: string;

  @Column({ nullable: true })
  newData: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
