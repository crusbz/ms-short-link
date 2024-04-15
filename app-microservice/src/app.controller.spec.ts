import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { ShortLinkInMemoryRepository } from './short-link/db/in-memory/short-link-in-memory.repository';
import { ShortLinkService } from './short-link/short-link.service';
import { ShortLink } from './short-link/entities/short-link.entity';
import { ClickProducerService } from './short-link/click-producer.service';

const queueMock = {
  add: jest.fn().mockResolvedValue({}), // Mockando o método add para retornar uma promessa resolvida
};

const clientModuleAuth = {
  get: jest.fn().mockResolvedValue({}),
};

const clickProducer = {
  sendClick: jest.fn().mockResolvedValue({}), // Mockando o método add para retornar uma promessa resolvida
};

describe('AppController', () => {
  let controller: AppController;
  let service: ShortLinkService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        ShortLinkService,
        {
          provide: 'ShortLinkRepositoryProtocol',
          useValue: new ShortLinkInMemoryRepository(),
        },
        { provide: ClickProducerService, useValue: clickProducer },
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

    controller = module.get<AppController>(AppController);
    service = module.get<ShortLinkService>(ShortLinkService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should redirect to target link', async () => {
    const shortenedLink = 'exampleShortenedLink';
    const targetLink = 'https://example.com';

    const responseMock = {
      redirect: jest.fn(),
    } as any;

    const shortLink = new ShortLink();
    shortLink.setShortLink({
      id: 1,
      targetLink: targetLink,
      shortenedLink: shortenedLink,
      userId: 1,
      count: 0,
      createdAt: new Date(),
      updatedAt: null,
      deletedAt: null,
    });

    jest.spyOn(service, 'findByShortenedLink').mockResolvedValue(shortLink);

    await controller.findOne(shortenedLink, responseMock);

    expect(responseMock.redirect).toHaveBeenCalledWith(targetLink);
  });
});
