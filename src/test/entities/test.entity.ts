import { AuditableEntity } from '@/audit/auditable.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TestEntity extends AuditableEntity {
  @Column()
  name: string;
}
