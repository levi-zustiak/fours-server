import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
  Response,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async signIn(@Request() req, @Response() res): Promise<void> {
    const { user, accessToken } = await this.authService.login(req.user);

    res
      .cookie('access_token', accessToken, {
        sameSite: 'lax',
        httpOnly: true,
      })
      .send(user)
      .redirect('/');
  }

  @Get('logout')
  async logout(@Request() req, @Response() res): Promise<void> {
    res.clearCookie('access_token').send();
  }

  @Post('signup')
  signUp(@Body() signUpDto: Record<string, any>) {
    return this.authService.signUp(signUpDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
