import { IsBoolean } from 'class-validator';

export class DisableUserDto {
  @IsBoolean()
  disabled!: boolean;
}
