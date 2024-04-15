import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { MessagePattern } from '@nestjs/microservices';
import { OutputLogin } from './dto/output-login';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

type RequestUser = {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: string;
  updatedAt: Date | null;
  deletedAt: Date | null;
};

@ApiTags('Auth')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiResponse({
    status: 200,
    description: 'Returns an access token',
    type: OutputLogin,
  })
  @UseGuards(LocalAuthGuard)
  @Post('auth')
  async login(@Req() req: { user: RequestUser }) {
    return this.authService.login(req.user);
  }

  @MessagePattern({ role: 'auth', cmd: 'check' })
  async loggedIn(data: { jwt: string }) {
    const res = this.authService.validateToken(data.jwt);
    return res;
  }
}
