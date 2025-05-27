import { IsDate, IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTodoDto {
  @IsString()
  title!: string;

  @IsEnum(['RESTAURANT', 'ACCOMMODATION', 'ACTIVITY'])
  category!: 'RESTAURANT' | 'ACCOMMODATION' | 'ACTIVITY';

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsString()
  bookingNumber?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @Type(() => Date)
  @IsDate()
  date!: Date;
} 