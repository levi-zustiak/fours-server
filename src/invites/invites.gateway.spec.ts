import { Test, TestingModule } from '@nestjs/testing';
import { InvitesGateway } from './invites.gateway';
import { InvitesService } from './invites.service';

describe('InvitesGateway', () => {
  let gateway: InvitesGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InvitesGateway, InvitesService],
    }).compile();

    gateway = module.get<InvitesGateway>(InvitesGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
