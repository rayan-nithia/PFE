import { IsArray, IsDate, IsEnum, IsInt, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTripDto {
  @IsString()
  name!: string;

  @IsEnum(['SIMPLE', 'MULTIPLE'])
  type!: 'SIMPLE' | 'MULTIPLE';

  @IsArray()
  @IsString({ each: true })
  destinations!: string[];

  @Type(() => Date)
  @IsDate()
  startDate!: Date;

  @Type(() => Date)
  @IsDate()
  endDate!: Date;

  @IsInt()
  @Min(1)
  travelersCount!: number;
} 