import { Test, TestingModule } from '@nestjs/testing';
import { NewmailController } from './newmail.controller';

describe('Newmail Controller', () => {
  let controller: NewmailController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NewmailController],
    }).compile();

    controller = module.get<NewmailController>(NewmailController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
