import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Trip } from '../../trips/entities/trip.entity';

@Entity('todo')
export class Todo {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id!: number;

  @Column('varchar', { name: 'title', length: 255 })
  title!: string;

  @Column('enum', {
    name: 'category',
    enum: ['RESTAURANT', 'ACCOMMODATION', 'ACTIVITY'],
  })
  category!: 'RESTAURANT' | 'ACCOMMODATION' | 'ACTIVITY';

  @Column('decimal', { name: 'price', precision: 10, scale: 2, nullable: true })
  price?: number;

  @Column('varchar', { name: 'booking_number', length: 255, nullable: true })
  bookingNumber?: string;

  @Column('text', { name: 'description', nullable: true })
  description?: string;

  @Column({ type: 'date' })
  date: Date;

  @ManyToOne(() => Trip, (trip) => trip.todos)
  trip!: Trip;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt!: Date;

  @DeleteDateColumn({ type: 'timestamp', name: 'deleted_at' })
  deletedAt!: Date;
}
