import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { UserType } from '@prisma/client';
import { PaginationQueryDto } from '../../../utils/types/pagination-query.dto';

export class UserListQueryDto extends PaginationQueryDto {
  @IsOptional()
  @Transform(({ value }) =>
    value !== undefined ? value === 'true' : undefined,
  )
  @IsBoolean()
  active?: boolean;

  @IsOptional()
  @IsEnum(UserType)
  user_type?: UserType;
}
