import { Body, Controller, Post } from '@nestjs/common';
import { CreateDto } from './dto/CreateDto';
import { JoinDto } from './dto/JoinDto';
import { Lobby } from './entities/lobby.entity';
import { LobbyService } from './lobby.service';

@Controller('lobby')
export class LobbyController {
  constructor(private readonly lobbyService: LobbyService) {}

  @Post('create')
  create(@Body() body: CreateDto): Lobby {
    return this.lobbyService.create(body);
  }

  @Post('join')
  join(@Body() body: JoinDto): Lobby {
    return this.lobbyService.join(body);
  }
}
