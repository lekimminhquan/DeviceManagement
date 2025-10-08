import { IsNotEmpty } from 'class-validator';

export class LogoutDto {
  @IsNotEmpty()
  refresh_token!: string;
}
