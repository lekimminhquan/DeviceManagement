import { IsEmail, IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { UserType } from '@prisma/client';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  name?: string;

  @IsOptional()
  avatar?: string;

  @IsOptional()
  @IsEnum(UserType)
  user_type?: UserType;

  @IsOptional()
  @IsBoolean()
  disabled?: boolean;
}
