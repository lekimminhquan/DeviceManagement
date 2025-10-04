import { IsEmail, IsEnum, IsOptional, MinLength } from 'class-validator';
import { UserType } from '@prisma/client';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @MinLength(6)
  password?: string;

  @IsOptional()
  name?: string;

  @IsOptional()
  avatar?: string;

  @IsOptional()
  @IsEnum(UserType)
  user_type?: UserType;
}
