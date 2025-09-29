import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service.js';
import { EmailsService } from '../emails/emails.service.js';
import { UserType } from '@prisma/client';
import * as crypto from 'crypto';
import { RESET_PASSWORD_TOKEN_EXPIRES_IN, ACCESS_TOKEN_EXPIRES_IN, REFRESH_TOKEN_EXPIRES_DAYS } from './constants/token';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly emailsService: EmailsService,
  ) { }

  async requestForgotPassword(email: string): Promise<void> {
    const user = await this.prisma.user.findFirst({ where: { email } });
    if (!user) throw new BadRequestException('User not found');

    // Always generate token, but only send if user exists to avoid email enumeration
    const token = await this.jwtService.signAsync(
      { email },
      { expiresIn: RESET_PASSWORD_TOKEN_EXPIRES_IN },
    );

    const baseUrl = process.env.BASE_FE_URL ?? 'http://localhost:3000';
    const resetLink = `${baseUrl}/reset-password?token=${encodeURIComponent(token)}`;

    await this.emailsService.sendMail({
      to: user ? email : (process.env.MAIL_DEV_REDIRECT ?? email),
      subject: 'Reset your password',
      text: `Click the link to reset your password (valid 12h): ${resetLink}`,
      html: `<p>Click the link to reset your password (valid 12h):</p><p><a href="${resetLink}">${resetLink}</a></p>`,
    });
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const decoded = this.jwtService.decode(token) as { email?: string } | null;
    const emailFromToken = decoded?.email;
    if (!emailFromToken) throw new BadRequestException('Email not found');

    const user = await this.prisma.user.findFirst({ where: { email: emailFromToken } });
    if (!user?.id) return;

    const bcrypt = await import('bcryptjs');
    const hashed = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { password: hashed },
    });
  }


  async sendWelcome(email: string): Promise<void> {
    await this.emailsService.sendMail({
      to: email,
      subject: 'Welcome to Device Management',
      text: 'This is a test email to verify SMTP configuration.',
      html: '<p>This is a <strong>test email</strong> to verify SMTP configuration.</p>',
    });
  }

  async register(email: string, password: string) {
    // Check if user already exists
    const existingUser = await this.prisma.user.findFirst({ where: { email } });
    if (existingUser) {
      throw new BadRequestException('Tài khoản email đã tồn tại');
    }

    // Hash password
    const bcrypt = await import('bcryptjs');
    const hashedPassword = await bcrypt.hash(password, 10);

    // Extract name from email (part before @)
    const name = email.split('@')[0];

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        user_type: UserType.client,
      },
    });

    return user;
  }

  async login(email: string, password: string) {
    // Find user by email
    const user = await this.prisma.user.findFirst({ where: { email } });
    if (!user || !user.password) {
      throw new UnauthorizedException('Sai email hoặc password');
    }

    // Verify password
    const bcrypt = await import('bcryptjs');
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Sai email hoặc password');
    }

    // Generate access token
    const access_token = await this.jwtService.signAsync(
      { userId: user.id, email: user.email },
      { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
    );

    // Generate refresh token
    const refreshTokenValue = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRES_DAYS);

    // Save refresh token to database
    await this.prisma.refreshToken.create({
      data: {
        token: refreshTokenValue,
        userId: user.id,
        expiresAt,
      },
    });

    return {
      access_token,
      refresh_token: refreshTokenValue
    };
  }

  async refreshToken(refreshToken: string) {
    // Find refresh token in database
    const tokenRecord = await this.prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true }
    });

    if (!tokenRecord) {
      throw new UnauthorizedException('Refresh token không hợp lệ');
    }

    // Check if token is expired
    if (tokenRecord.expiresAt < new Date()) {
      // Delete expired token
      await this.prisma.refreshToken.delete({
        where: { id: tokenRecord.id }
      });
      throw new UnauthorizedException('Refresh token đã hết hạn');
    }

    // Delete old refresh token
    await this.prisma.refreshToken.delete({
      where: { id: tokenRecord.id }
    });

    // Generate new access token
    const access_token = await this.jwtService.signAsync(
      { userId: tokenRecord.user.id, email: tokenRecord.user.email },
      { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
    );

    // Generate new refresh token
    const newRefreshTokenValue = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRES_DAYS);

    // Save new refresh token to database
    await this.prisma.refreshToken.create({
      data: {
        token: newRefreshTokenValue,
        userId: tokenRecord.user.id,
        expiresAt,
      },
    });

    return {
      access_token,
      refresh_token: newRefreshTokenValue
    };
  }

}
