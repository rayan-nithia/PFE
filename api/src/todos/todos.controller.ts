import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Put,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('trips/:tripId/todos')
@UseGuards(JwtAuthGuard)
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  create(
    @Param('tripId') tripId: string,
    @Body() createTodoDto: CreateTodoDto,
  ) {
    return this.todosService.create(createTodoDto, +tripId);
  }

  @Get()
  findAll(@Param('tripId') tripId: string) {
    return this.todosService.findAll(+tripId);
  }

  @Get(':id')
  findOne(@Param('tripId') tripId: string, @Param('id') id: string) {
    return this.todosService.findOne(+id, +tripId);
  }

  @Delete(':id')
  remove(@Param('tripId') tripId: string, @Param('id') id: string) {
    return this.todosService.remove(+id, +tripId);
  }

  @Put(':id')
  update(
    @Param('tripId') tripId: string,
    @Param('id') id: string,
    @Body() updateTodoDto: UpdateTodoDto,
  ) {
    return this.todosService.update(+id, +tripId, updateTodoDto);
  }
}