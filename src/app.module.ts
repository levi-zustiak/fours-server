import { Module } from '@nestjs/common';
import { HttpModule } from './http/http.module';
import { SocketModule } from './socket/socket.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [HttpModule, SocketModule, EventEmitterModule.forRoot()],
})
export class AppModule {}
