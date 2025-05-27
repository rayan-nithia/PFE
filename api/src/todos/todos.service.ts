import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './entities/todo.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { Trip } from '../trips/entities/trip.entity';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo)
    private todosRepository: Repository<Todo>,
    @InjectRepository(Trip)
    private tripsRepository: Repository<Trip>,
  ) {}

  async create(createTodoDto: CreateTodoDto, tripId: number): Promise<Todo> {
    const trip = await this.tripsRepository.findOneBy({ id: tripId });
    if (!trip) {
      throw new NotFoundException(`Voyage avec l'ID ${tripId} non trouvé`);
    }

    const todo = Object.assign(new Todo(), {
      ...createTodoDto,
      date: new Date(createTodoDto.date).toISOString().slice(0, 10),
      trip,
    });
    return this.todosRepository.save(todo);
  }

  async findAll(tripId: number): Promise<Todo[]> {
    return this.todosRepository.find({
      where: { trip: { id: tripId } },
    });
  }

  async findOne(id: number, tripId: number): Promise<Todo> {
    const todo = await this.todosRepository.findOne({
      where: { id, trip: { id: tripId } },
    });

    if (!todo) {
      throw new NotFoundException(`ToDo avec l'ID ${id} non trouvé`);
    }

    return todo;
  }

  async remove(id: number, tripId: number): Promise<void> {
    const todo = await this.findOne(id, tripId);
    await this.todosRepository.remove(todo);
  }

  async update(id: number, tripId: number, updateTodoDto: UpdateTodoDto): Promise<Todo> {
    const todo = await this.findOne(id, tripId);
    
    if (updateTodoDto.date) {
      const date = new Date(updateTodoDto.date);
      updateTodoDto.date = date;
    }

    // Ne mettre à jour que les champs qui sont fournis
    const updatedFields: Partial<Todo> = {};
    
    if (updateTodoDto.title !== undefined) updatedFields.title = updateTodoDto.title;
    if (updateTodoDto.category !== undefined) updatedFields.category = updateTodoDto.category;
    if (updateTodoDto.price !== undefined) updatedFields.price = updateTodoDto.price;
    if (updateTodoDto.description !== undefined) updatedFields.description = updateTodoDto.description;
    if (updateTodoDto.date !== undefined) updatedFields.date = updateTodoDto.date;
    if (updateTodoDto.bookingNumber !== undefined) updatedFields.bookingNumber = updateTodoDto.bookingNumber;

    Object.assign(todo, updatedFields);
    return this.todosRepository.save(todo);
  }
}
