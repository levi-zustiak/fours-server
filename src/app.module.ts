import { Module } from '@nestjs/common';
import { HttpModule } from './http/http.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [HttpModule, EventEmitterModule.forRoot()],
})
export class AppModule {}
