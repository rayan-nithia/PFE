import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Trip } from '../../trips/entities/trip.entity';

@Index('email', ['email'], { unique: true })
@Entity('user')
export class User {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id!: number;

  @Column('varchar', { name: 'first_name', length: 255 })
  firstName!: string;

  @Column('varchar', { name: 'last_name', length: 255 })
  lastName!: string;

  @Column('varchar', { name: 'email', unique: true, length: 255 })
  email!: string;

  @Column('varchar', { name: 'password', length: 255 })
  password!: string;

  @OneToMany(() => Trip, (trip) => trip.user)
  trips!: Trip[];

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt!: Date;

  @DeleteDateColumn({ type: 'timestamp', name: 'deleted_at' })
  deletedAt!: Date;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
