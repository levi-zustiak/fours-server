import { Module } from '@nestjs/common';
import { SocketModule } from './socket/socket.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [SocketModule, EventEmitterModule.forRoot()],
})
export class AppModule {}
