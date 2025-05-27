import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { EntityManager } from 'typeorm';
import { User } from './entities/user.entity';
import { hash } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly entityManager: EntityManager) {}

  async create(createUserDto: CreateUserDto) {
    const user = new User(createUserDto);
    return this.entityManager.save(User, {
      ...user,
      password: await hash(user.password, 10),
    });
  }

  async findAll(): Promise<User[]> {
    return this.entityManager.find(User);
  }

  async findOne(id: number): Promise<User | null> {
    return this.entityManager.findOneBy(User, { id });
  }

  async getUser(email: string): Promise<User | null> {
    const user = await this.entityManager.findOneBy(User, { email });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.entityManager.update(User, { id }, updateUserDto);
  }

  remove(id: number) {
    return this.entityManager.delete(User, { id });
  }
}
