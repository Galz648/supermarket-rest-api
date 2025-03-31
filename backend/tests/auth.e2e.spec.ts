import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module.js';
import { clearDatabase, seedDatabase } from './utils/database.util.js';
import { PrismaClient } from '@prisma/client';

describe('Authorization (e2e)', () => {
    let app: INestApplication;
    let prisma: PrismaClient;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
        prisma = new PrismaClient();
    });

    afterAll(async () => {
        await app.close();
        await prisma.$disconnect();
    });

    beforeEach(async () => {
        await clearDatabase();
        await seedDatabase();
    });

    describe('Public Endpoints', () => {
        it('should allow access to get all items', async () => {
            await request(app.getHttpServer())
                .get('/items')
                .expect(200);
        });

        it('should allow access to search items', async () => {
            await request(app.getHttpServer())
                .get('/items/search')
                .query({ query: 'test' })
                .expect(200);
        });

        it('should allow access to get all stores', async () => {
            await request(app.getHttpServer())
                .get('/stores')
                .expect(200);
        });

        it('should allow access to get stores by city', async () => {
            // Get a city from our seeded data
            const store = await prisma.store.findFirst();
            const city = store.city;

            await request(app.getHttpServer())
                .get(`/stores/city/${city}`)
                .expect(200);
        });

        it('should allow access to get all chains', async () => {
            await request(app.getHttpServer())
                .get('/stores/chains')
                .expect(200);
        });
    });
}); 
