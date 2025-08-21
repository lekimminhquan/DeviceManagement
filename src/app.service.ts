import { Injectable } from '@nestjs/common';
import { PrismaService } from './modules/prisma.service';

@Injectable()
export class AppService {
  constructor(private readonly prismaService: PrismaService) {}

  getHello(): string {
    return 'Hello World!';
  }

  async getAllUsers() {
    return this.prismaService.user.findMany();
  }
}
