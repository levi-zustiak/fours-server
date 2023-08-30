import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(
    name: string,
    password: string,
  ): Promise<{ id: number; name: string } | UnauthorizedException> {
    const user = await this.userService.findByUsername({ name });

    const validCredentials = await compare(password, user?.password);

    return validCredentials
      ? {
          id: user.id,
          name: user.name,
        }
      : null;
  }

  async login(user) {
    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      username: user.name,
    });

    return {
      user,
      accessToken,
    };
  }

  async signUp(data): Promise<void> {
    await this.userService.create(data);
  }
}
