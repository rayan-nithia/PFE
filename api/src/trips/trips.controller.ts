import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { TripsService } from './trips.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../users/entities/user.entity';

@Controller('trips')
@UseGuards(JwtAuthGuard)
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Post()
  create(@Body() createTripDto: CreateTripDto, @Req() req: { user: User }) {
    return this.tripsService.create(createTripDto, req.user);
  }

  @Get()
  findAll(@Req() req: { user: User }) {
    return this.tripsService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: { user: User }) {
    return this.tripsService.findOne(+id, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: { user: User }) {
    return this.tripsService.remove(+id, req.user.id);
  }
}
