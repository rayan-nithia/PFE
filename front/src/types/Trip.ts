import { Todo } from './Todo';

export type TripType = 'SIMPLE' | 'MULTIPLE';

export interface Trip {
  id: number;
  name: string;
  type: TripType;
  destinations: string[];
  startDate: Date;
  endDate: Date;
  travelersCount: number;
  todos: Todo[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
} 