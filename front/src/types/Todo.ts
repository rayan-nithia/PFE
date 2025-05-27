export type TodoCategory = 'RESTAURANT' | 'ACCOMMODATION' | 'ACTIVITY';

export interface Todo {
  id: number;
  title: string;
  category: TodoCategory;
  price?: number;
  bookingNumber?: string;
  description?: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
} 