import { Module } from '@nestjs/common';
import { InvitesService } from './invites.service';
import { InvitesGateway } from './invites.gateway';

@Module({
  providers: [InvitesGateway, InvitesService]
})
export class InvitesModule {}
