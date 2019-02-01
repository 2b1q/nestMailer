import { Test, TestingModule } from '@nestjs/testing';
import { NewmailService } from './newmail.service';

describe('NewmailService', () => {
  let service: NewmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NewmailService],
    }).compile();

    service = module.get<NewmailService>(NewmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
