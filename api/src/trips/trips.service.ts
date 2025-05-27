import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trip } from './entities/trip.entity';
import { CreateTripDto } from './dto/create-trip.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class TripsService {
  constructor(
    @InjectRepository(Trip)
    private tripsRepository: Repository<Trip>,
  ) {}

  async create(createTripDto: CreateTripDto, user: User): Promise<Trip> {
    const trip = Object.assign(new Trip(), {
      ...createTripDto,
      startDate: new Date(createTripDto.startDate).toISOString().slice(0, 10),
      endDate: new Date(createTripDto.endDate).toISOString().slice(0, 10),
      user,
    });
    return this.tripsRepository.save(trip);
  }

  async findAll(userId: number): Promise<Trip[]> {
    return this.tripsRepository.find({
      where: { user: { id: userId } },
      relations: ['todos'],
    });
  }

  async findOne(id: number, userId: number): Promise<Trip> {
    const trip = await this.tripsRepository.findOne({
      where: { id, user: { id: userId } },
      relations: ['todos'],
    });

    if (!trip) {
      throw new NotFoundException(`Voyage avec l'ID ${id} non trouvé`);
    }

    return trip;
  }

  async remove(id: number, userId: number): Promise<void> {
    const trip = await this.findOne(id, userId);
    
    // Supprimer d'abord les todos associés
    if (trip.todos && trip.todos.length > 0) {
      await Promise.all(trip.todos.map(todo => this.tripsRepository.manager.remove(todo)));
    }
    
    // Puis supprimer le trip
    await this.tripsRepository.remove(trip);
  }
}
