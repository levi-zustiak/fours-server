import { Module } from '@nestjs/common';
import { LobbyModule } from './lobby/lobby.module';

@Module({
  imports: [LobbyModule],
})
export class HttpModule {}
