import { Test, TestingModule } from '@nestjs/testing';
import { SupermarketsController } from './supermarkets.controller';
import { SupermarketsService } from './supermarkets.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSupermarketDto } from './dto/create-supermarket.dto';

describe('SupermarketsController', () => {
  let controller: SupermarketsController;
  let service: SupermarketsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SupermarketsController],
      providers: [
        SupermarketsService,
        {
          provide: PrismaService,
          useValue: {
            supermarket: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
            operatingHours: {
              createMany: jest.fn(),
              deleteMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    controller = module.get<SupermarketsController>(SupermarketsController);
    service = module.get<SupermarketsService>(SupermarketsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a supermarket', async () => {
      const dto: CreateSupermarketDto = {
        name: 'Test Supermarket',
        chain: 'Test Chain',
        address: 'Test Address',
        city: 'Test City',
        coordinates: {
          latitude: 32.0853,
          longitude: 34.7818,
        },
      };

      const expectedResult = {
        id: 'test-id',
        ...dto,
        latitude: dto.coordinates.latitude,
        longitude: dto.coordinates.longitude,
        createdAt: new Date(),
        updatedAt: new Date(),
        operatingHours: [],
      };

      jest.spyOn(service, 'create').mockResolvedValue(expectedResult as any);

      expect(await controller.create(dto)).toBe(expectedResult);
    });
  });
}); 
