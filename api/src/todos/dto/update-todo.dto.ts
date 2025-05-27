import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateTodoDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsEnum(['RESTAURANT', 'ACCOMMODATION', 'ACTIVITY'])
  category?: 'RESTAURANT' | 'ACCOMMODATION' | 'ACTIVITY';

  @IsOptional()
  price?: number;

  @IsOptional()
  @IsString()
  bookingNumber?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  date?: Date;
} 