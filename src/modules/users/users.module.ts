import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { EmailsModule } from '../emails/emails.module.js';
import { UsersService } from './users.service.js';
import { UsersController } from './users.controller.js';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET ?? 'change-me',
        signOptions: { expiresIn: '12h' },
      }),
    }),
    EmailsModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
