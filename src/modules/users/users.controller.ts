import {
  Body,
  Controller,
  Get,
  Query,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { RequestForgotPasswordDto } from './dto/request-forgot-password.dto';
import { SendWelcomeDto } from './dto/send-welcome.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { LogoutDto } from './dto/logout.dto';
import { CurrentUser } from './decorators/current-user.decorator';
import type { User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { ListPaginatedResponse } from '../../utils/types/list-api';
import type { UserListItemDto } from './dto/user-list-item.dto';
import { UserListQueryDto } from './dto/user-list-query.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DisableUserDto } from './dto/disable-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('request-forgot-password')
  @HttpCode(HttpStatus.OK)
  async requestForgotPassword(@Body() body: RequestForgotPasswordDto) {
    await this.usersService.requestForgotPassword(body.email);
    return { message: 'If the email exists, a reset link has been sent.' };
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() body: ResetPasswordDto) {
    await this.usersService.resetPassword(body.token, body.newPassword);
    return {
      message: 'Đổi mật khẩu thành công. Vui lòng đăng nhập lại.',
    };
  }

  @Post('welcome')
  @HttpCode(HttpStatus.OK)
  async sendWelcome(@Body() body: SendWelcomeDto) {
    await this.usersService.sendWelcome(body.email);
    return { message: 'Đã gửi mail test (nếu cấu hình SMTP đúng).' };
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() body: RegisterDto) {
    const user = await this.usersService.register(body.email, body.password);
    return {
      message: 'Đăng ký thành công',
      user: { id: user.id, email: user.email, name: user.name },
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: LoginDto) {
    const result = await this.usersService.login(body.email, body.password);
    return {
      message: 'Đăng nhập thành công',
      access_token: result.access_token,
      refresh_token: result.refresh_token,
    };
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body() body: RefreshTokenDto) {
    const result = await this.usersService.refreshToken(body.refresh_token);
    return {
      message: 'Refresh token thành công',
      access_token: result.access_token,
      refresh_token: result.refresh_token,
    };
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  async getMe(@CurrentUser() user: User) {
    return {
      message: 'Lấy thông tin user thành công',
      user,
    };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Body() body: LogoutDto) {
    await this.usersService.logout(body.refresh_token);
    return {
      message: 'Đăng xuất thành công',
    };
  }

  // CRUD APIs
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() body: CreateUserDto) {
    const user = await this.usersService.createUser(body);
    return { message: 'Tạo user thành công', user };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async list(
    @Query() query: UserListQueryDto,
  ): Promise<ListPaginatedResponse<UserListItemDto>> {
    const data = await this.usersService.listUsers({
      q: query.q,
      page: query.page,
      page_size: query.page_size,
      active: query.active,
      user_type: query.user_type,
    });
    return { message: 'Lấy danh sách user thành công', data };
  }

  @Get('stats')
  @HttpCode(HttpStatus.OK)
  async getStats() {
    const stats = await this.usersService.getUserStats();
    return { message: 'Lấy thống kê user thành công', data: stats };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async detail(@Param('id') id: string) {
    const user = await this.usersService.getUserDetail(id);
    return { message: 'Lấy chi tiết user thành công', user };
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: string, @Body() body: UpdateUserDto) {
    const user = await this.usersService.updateUser(id, body);
    return { message: 'Cập nhật user thành công', user };
  }

  @Patch(':id/disabled')
  @HttpCode(HttpStatus.OK)
  async setDisabled(@Param('id') id: string, @Body() body: DisableUserDto) {
    const user = await this.usersService.setUserDisabled(id, body.disabled);
    return { message: 'Cập nhật trạng thái user thành công', user };
  }
}
