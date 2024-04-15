import { Test, TestingModule } from '@nestjs/testing';
import { ShortLinkInMemoryRepository } from '../db/in-memory/short-link-in-memory.repository';
import { ShortLinkService } from '../short-link.service';

const queueMock = {
  add: jest.fn().mockResolvedValue({}), // Mockando o método add para retornar uma promessa resolvida
};
describe('ShortLinkService', () => {
  let service: ShortLinkService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
      ],
    }).compile();

    service = module.get<ShortLinkService>(ShortLinkService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create short link', async () => {
    const shortLink = await service.create({
      targetLink: 'https://www.google.com.br',
    });
    expect(shortLink).toBeDefined();
    expect(shortLink.targetLink).toEqual('https://www.google.com.br');
    expect(shortLink.shortenedLink).toBeDefined();
    expect(shortLink.id).toEqual(2);
    expect(shortLink.userId).toBeNull();
    expect(shortLink.count).toEqual(0);
    expect(shortLink.createdAt).toBeDefined();
    expect(shortLink.updatedAt).toBeNull();
    expect(shortLink.deletedAt).toBeNull();
  });

  it('should list short links', async () => {
    const shortLinks = await service.findAll(1);
    expect(shortLinks.length).toBe(1);
    expect(shortLinks[0].targetLink).toEqual('https://www.google.com.br');
    expect(shortLinks[0].shortenedLink).toBeDefined();
    expect(shortLinks[0].shortenedLink).toEqual('localhost:3000/1W2b34');
    expect(shortLinks[0].id).toEqual(1);
    expect(shortLinks[0].userId).toEqual(1);
    expect(shortLinks[0].count).toEqual(0);
    expect(shortLinks[0].createdAt).toBeDefined();
    expect(shortLinks[0].updatedAt).toBeNull();
    expect(shortLinks[0].deletedAt).toBeNull();
  });

  it('should fine onde by short link', async () => {
    const shortLink = await service.findByShortenedLink('1W2b34');
    expect(shortLink.targetLink).toEqual('https://www.google.com.br');
    expect(shortLink.shortenedLink).toBeDefined();
    expect(shortLink.shortenedLink).toEqual('localhost:3000/1W2b34');
    expect(shortLink.id).toEqual(1);
    expect(shortLink.userId).toEqual(1);
    expect(shortLink.count).toEqual(0);
    expect(shortLink.createdAt).toBeDefined();
    expect(shortLink.updatedAt).toBeNull();
    expect(shortLink.deletedAt).toBeNull();
  });

  it("should update short link's count", async () => {
    const shortLink = await service.updateCount(1);
    expect(shortLink.count).toEqual(1);
    expect(shortLink.updatedAt).toBeDefined();
  });

  it('should update target link by short link id and user id', async () => {
    const shortLink = await service.updateTargetLinkByUser(1, 1, {
      targetLink: 'https://www.facebook.com.br',
    });
    expect(shortLink.targetLink).toEqual('https://www.facebook.com.br');
    expect(shortLink.updatedAt).toBeDefined();
  });

  it('should remove short link by id and user id', async () => {
    const shortLink = await service.remove(1, 1);
    expect(shortLink).toEqual(undefined);
  });
});
