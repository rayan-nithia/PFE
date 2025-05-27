import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  lastName?: string;
  firstName?: string;
  email?: string;
  password?: string;
}
