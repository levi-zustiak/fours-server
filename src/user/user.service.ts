import { Injectable } from '@nestjs/common';
import { hash } from 'bcryptjs';
import { PrismaService } from '../database/prisma.service';
import { User, Prisma } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async findByUsername(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | undefined> {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });
  }

  async create({ name, password }: Prisma.UserCreateInput): Promise<User> {
    const hashedPassword = await hash(
      password,
      this.configService.get<number>('auth.rounds'),
    );

    return this.prisma.user.create({
      data: {
        name,
        password: hashedPassword,
      },
    });
  }
}
