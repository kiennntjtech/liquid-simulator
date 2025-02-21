import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class AuditableEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'created_by', nullable: true })
  createdBy: number;

  @Column({ name: 'last_updated_by', nullable: true })
  lastUpdatedBy: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'last_updated_at' })
  lastUpdatedAt: Date;
}
