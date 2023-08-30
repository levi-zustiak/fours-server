import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { SocketModule } from './socket/socket.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import * as redis from 'cache-manager-redis-store';
import { AppController } from './app.controller';
import { AuthModule } from './http/auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import authConfig from './config/auth.config';

@Module({
  imports: [
    SocketModule,
    EventEmitterModule.forRoot(),
    CacheModule.register({
      isGlobal: true,
      useFactory: async () => ({
        store: redis as any,
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
      }),
    }),
    AuthModule,
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [authConfig],
    }),
  ],
  controllers: [AppController],
})
export class AppModule {}
