import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from './modules/prisma/prisma.module.js';
import { UsersModule } from './modules/users/users.module.js';
import { EmailsModule } from './modules/emails/emails.module.js';
import { AuthMiddleware } from './modules/users/middleware/auth.middleware.js';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { MSTModule } from './modules/common/MST/taxcode.module.js';
import { LandingpageModule } from './modules/landingpage/landingpage.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET ?? 'change-me',
        signOptions: { expiresIn: '12h' },
      }),
    }),
    PrismaModule,
    EmailsModule,
    UsersModule,
    MSTModule,
    LandingpageModule,
  ],
  providers: [AuthMiddleware],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: 'users/login', method: RequestMethod.POST },
        { path: 'users/register', method: RequestMethod.POST },
        { path: 'users/request-forgot-password', method: RequestMethod.POST },
        { path: 'users/reset-password', method: RequestMethod.POST },
        { path: 'users/refresh-token', method: RequestMethod.POST },
        { path: 'users/welcome', method: RequestMethod.POST },
        { path: 'landingpage', method: RequestMethod.GET },
        { path: 'landingpage/(.*)', method: RequestMethod.GET },
        { path: 'landingpage/update/(.*)', method: RequestMethod.POST },
      )
      .forRoutes('*');
  }
}
