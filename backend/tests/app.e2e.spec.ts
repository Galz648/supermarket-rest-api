import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module.js';
import { PrismaClient } from '@prisma/client';

async function seedDatabase() {
  const prisma = new PrismaClient();
  await prisma.chain.create({
    data: {
      name: 'Test Chain',
      stores: {
        create: [
          {
            name: 'Test Store 1',
            location: 'Location 1',
            prices: {
              create: [
                {
                  item: {
                    create: {
                      name: 'Test Item 1',
                      unit: 'kg',
                      category: 'Fruits',
                      brand: 'Brand A',
                    },
                  },
                  price: 10.0,
                  currency: 'USD',
                },
              ],
            },
          },
        ],
      },
    },
  });
  await prisma.$disconnect();
}

async function clearDatabase() {
  const prisma = new PrismaClient();
  try {
    // Delete all records from the collections
    await prisma.itemPrice.deleteMany({});
    await prisma.item.deleteMany({});
    await prisma.store.deleteMany({});
    await prisma.chain.deleteMany({});
  } finally {
    await prisma.$disconnect();
  }
}

describe('Supermarket Chains (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  beforeEach(async () => {
    await clearDatabase();
    await seedDatabase();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/chains (GET) should return 200 and a non-empty list', async () => {
    const response = await request(app.getHttpServer())
      .get('/chains')
      .expect(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('/chains/:chainId/stores (GET) should return at least one store for each chain', async () => {
    const chainsResponse = await request(app.getHttpServer())
      .get('/chains')
      .expect(200);

    const chains = chainsResponse.body;
    expect(chains).toBeInstanceOf(Array);
    expect(chains.length).toBeGreaterThan(0);

    for (const chain of chains) {
      const storesResponse = await request(app.getHttpServer())
        .get(`/chains/${chain.id}/stores`)
        .expect(200);

      const stores = storesResponse.body;
      expect(stores).toBeInstanceOf(Array);
      expect(stores.length).toBeGreaterThan(0);
    }
  });

});
