import { IsEmail, IsNotEmpty } from 'class-validator';

export class SendWelcomeDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;
}


