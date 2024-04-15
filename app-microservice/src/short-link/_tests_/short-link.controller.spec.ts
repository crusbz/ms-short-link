import { Test, TestingModule } from '@nestjs/testing';
import { ShortLinkController } from '../short-link.controller';
import { ShortLinkService } from '../short-link.service';
import { ShortLinkInMemoryRepository } from '../db/in-memory/short-link-in-memory.repository';

const queueMock = {
  add: jest.fn().mockResolvedValue({}), // Mockando o método add para retornar uma promessa resolvida
};

const clientModuleAuth = {
  get: jest.fn().mockResolvedValue({}),
};

describe('ShortLinkController', () => {
  let controller: ShortLinkController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShortLinkController],
      providers: [
        ShortLinkService,
        {
          provide: 'ShortLinkRepositoryProtocol',
          useValue: new ShortLinkInMemoryRepository(),
        },
        {
          provide: 'BullQueue_clicks', // Nome da instância do Bull Queue
          useValue: queueMock, // Passando o mock do Bull Queue como um provedor
        },
        {
          provide: 'AUTH_CLIENT',
          useValue: clientModuleAuth,
        },
      ],
    }).compile();

    controller = module.get<ShortLinkController>(ShortLinkController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create short link not auth', async () => {
    const shortLink = await controller.create({
      targetLink: 'https://www.google.com.br',
    });
    expect(shortLink).toBeDefined();
  });

  it('should create short link with auth', async () => {
    const shortLink = await controller.create({
      targetLink: 'https://www.google.com.br',
      userId: 1,
    });
    expect(shortLink).toBeDefined();
    expect(shortLink.userId).toEqual(1);
  });

  it('should list all short links by user id', async () => {
    const shortLinks = await controller.findAll({ userId: 1 });
    expect(shortLinks.shortenedLinks.length).toBe(1);
    expect(shortLinks.shortenedLinks[0].targetLink).toEqual(
      'https://www.google.com.br',
    );
    expect(shortLinks.shortenedLinks[0].shortenedLink).toBeDefined();
    expect(shortLinks.shortenedLinks[0].shortenedLink).toEqual(
      'localhost:3000/1W2b34',
    );
    expect(shortLinks.shortenedLinks[0].id).toEqual(1);
    expect(shortLinks.shortenedLinks[0].userId).toEqual(1);
    expect(shortLinks.shortenedLinks[0].count).toEqual(0);
    expect(shortLinks.shortenedLinks[0].createdAt).toBeDefined();
    expect(shortLinks.shortenedLinks[0].updatedAt).toBeNull();
    expect(shortLinks.shortenedLinks[0].deletedAt).toBeNull();
  });

  it('should update target link by user id', async () => {
    const shortLink = await controller.update(
      '1',
      { targetLink: 'https://www.monster.com.br' },
      { userId: 1 },
    );
    expect(shortLink.id).toBe(1);
    expect(shortLink.userId).toBe(1);
    expect(shortLink.targetLink).toEqual('https://www.monster.com.br');
  });

  it('should remove short link by id and user id', async () => {
    const shortLink = await controller.remove('1', { userId: 1 });
    expect(shortLink).toEqual({ message: 'ShortLink deleted successfully' });
  });
});
