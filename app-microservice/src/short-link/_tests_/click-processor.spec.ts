import { Test, TestingModule } from '@nestjs/testing';
import { ShortLinkService } from '../short-link.service';
import { ClickProcessorService } from '../click-processor.service';

describe('ClickProcessor', () => {
  let processor: ClickProcessorService;
  let shortLinkService: ShortLinkService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClickProcessorService,
        {
          provide: ShortLinkService,
          useValue: {
            updateCount: jest.fn().mockResolvedValue({}),
          },
        },
      ],
    }).compile();

    processor = module.get<ClickProcessorService>(ClickProcessorService);
    shortLinkService = module.get<ShortLinkService>(ShortLinkService);
  });

  it('should be defined', () => {
    expect(processor).toBeDefined();
  });

  describe('execute', () => {
    it('should call ShortLinkService.updateCount with correct id', async () => {
      const jobId = 1;
      await processor.execute({ data: { id: jobId } } as any);
      expect(shortLinkService.updateCount).toHaveBeenCalledWith(jobId);
    });
  });
});
