import type { UserType } from '@prisma/client';

export type UserListItemDto = {
  id: string;
  name: string | null;
  user_type: UserType | null;
  avatar: string | null;
  email: string;
  disabled: boolean;
  lastLoginAt: Date | null;
};
