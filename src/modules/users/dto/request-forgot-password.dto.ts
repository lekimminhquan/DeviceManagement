import { IsEmail, IsNotEmpty } from 'class-validator';

export class RequestForgotPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;
}


