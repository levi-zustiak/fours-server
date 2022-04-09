import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InvitesModule } from './invites/invites.module';

@Module({
  imports: [InvitesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
