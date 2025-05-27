import { IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  lastName: string;

  @IsString()
  firstName: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
