import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { SocketModule } from './socket/socket.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import * as redis from 'cache-manager-redis-store';
import { AppController } from './app.controller';

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
  ],
  controllers: [AppController],
})
export class AppModule {}
