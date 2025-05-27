import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Todo } from '../../todos/entities/todo.entity';

@Entity('trip')
export class Trip {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id!: number;

  @Column('varchar', { name: 'name', length: 255 })
  name!: string;

  @Column('enum', { name: 'type', enum: ['SIMPLE', 'MULTIPLE'] })
  type!: 'SIMPLE' | 'MULTIPLE';

  @Column('json', { name: 'destinations' })
  destinations!: string[];

  @Column('date', { name: 'start_date' })
  startDate!: Date;

  @Column('date', { name: 'end_date' })
  endDate!: Date;

  @Column('int', { name: 'travelers_count' })
  travelersCount!: number;

  @ManyToOne(() => User, (user) => user.trips)
  user!: User;

  @OneToMany(() => Todo, (todo) => todo.trip)
  todos!: Todo[];

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt!: Date;

  @DeleteDateColumn({ type: 'timestamp', name: 'deleted_at' })
  deletedAt!: Date;
}
