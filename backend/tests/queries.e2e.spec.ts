import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module.js';
import { clearDatabase, seedDatabase } from './utils/database.util.js';
import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

describe('Query Operations (e2e)', () => {
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

    describe('Item Queries', () => {
        it('should get all items with basic pagination', async () => {
            const response = await request(app.getHttpServer())
                .get('/items')
                .query({ page: 1, limit: 10 })
                .expect(200);

            expect(response.body).toHaveProperty('data');
            expect(response.body).toHaveProperty('meta');
            expect(Array.isArray(response.body.data)).toBe(true);
            expect(response.body.meta).toHaveProperty('total');
            expect(response.body.meta).toHaveProperty('page');
            expect(response.body.meta).toHaveProperty('limit');
        });

        it('should get items sorted by name', async () => {
            const response = await request(app.getHttpServer())
                .get('/items')
                .query({ sort: 'name', order: 'asc' })
                .expect(200);

            expect(response.body.data).toBeInstanceOf(Array);
            expect(response.body.data.length).toBeGreaterThan(0);

            // Check if array is sorted
            const names = response.body.data.map(item => item.name);
            const sortedNames = [...names].sort();
            expect(names).toEqual(sortedNames);
        });
    });

    describe('Price Queries', () => {
        it.skip('should get prices for items in a store with pagination', async () => {
            const chain = await prisma.chain.create({
                data: {
                    name: faker.company.name(),
                    stores: {
                        create: {
                            storeId: faker.string.alphanumeric(8).toUpperCase(),
                            name: faker.company.name(),
                            address: faker.location.streetAddress(),
                            city: faker.location.city(),
                            zipCode: faker.location.zipCode(),
                        }
                    }
                }
            });

            const store = await prisma.store.findFirst({
                where: { chainName: chain.name }
            });

            const response = await request(app.getHttpServer())
                .get(`/stores/${store.id}/prices`)
                .query({ page: 1, limit: 10 })
                .expect(200);

            expect(response.body).toHaveProperty('data');
            expect(response.body).toHaveProperty('meta');
            expect(Array.isArray(response.body.data)).toBe(true);
        });

        it.skip('should get prices filtered by price range', async () => {
            const chain = await prisma.chain.create({
                data: {
                    name: faker.company.name(),
                    stores: {
                        create: {
                            storeId: faker.string.alphanumeric(8).toUpperCase(),
                            name: faker.company.name(),
                            address: faker.location.streetAddress(),
                            city: faker.location.city(),
                            zipCode: faker.location.zipCode(),
                        }
                    }
                }
            });

            const store = await prisma.store.findFirst({
                where: { chainName: chain.name }
            });

            const minPrice = 5;
            const maxPrice = 15;

            const response = await request(app.getHttpServer())
                .get(`/stores/${store.id}/prices`)
                .query({ minPrice, maxPrice })
                .expect(200);

            expect(response.body.data).toBeInstanceOf(Array);
            expect(response.body.data.every(price =>
                price.price >= minPrice && price.price <= maxPrice
            )).toBe(true);
        });

        it.skip('should get prices sorted by timestamp', async () => {
            const chain = await prisma.chain.create({
                data: {
                    name: faker.company.name(),
                    stores: {
                        create: {
                            storeId: faker.string.alphanumeric(8).toUpperCase(),
                            name: faker.company.name(),
                            address: faker.location.streetAddress(),
                            city: faker.location.city(),
                            zipCode: faker.location.zipCode(),
                        }
                    }
                }
            });

            const store = await prisma.store.findFirst({
                where: { chainName: chain.name }
            });

            const response = await request(app.getHttpServer())
                .get(`/stores/${store.id}/prices`)
                .query({ sort: 'timestamp', order: 'desc' })
                .expect(200);

            expect(response.body.data).toBeInstanceOf(Array);
            expect(response.body.data.length).toBeGreaterThan(0);

            // Check if array is sorted by timestamp in descending order
            const timestamps = response.body.data.map(price => new Date(price.timestamp).getTime());
            const sortedTimestamps = [...timestamps].sort((a, b) => b - a);
            expect(timestamps).toEqual(sortedTimestamps);
        });
    });

    describe('Store Queries', () => {
        it('should get stores filtered by city', async () => {
            const city = faker.location.city();
            const chain = await prisma.chain.create({
                data: {
                    name: faker.company.name(),
                    stores: {
                        create: {
                            storeId: faker.string.alphanumeric(8).toUpperCase(),
                            name: faker.company.name(),
                            address: faker.location.streetAddress(),
                            city,
                            zipCode: faker.location.zipCode(),
                        }
                    }
                }
            });

            const response = await request(app.getHttpServer())
                .get('/stores')
                .query({ city })
                .expect(200);

            expect(response.body.data).toBeInstanceOf(Array);
            expect(response.body.data.length).toBeGreaterThan(0);
            expect(response.body.data.every(store => store.city === city)).toBe(true);
        });

        it('should get stores sorted by name', async () => {
            const response = await request(app.getHttpServer())
                .get('/stores')
                .query({ sort: 'name', order: 'asc' })
                .expect(200);

            expect(response.body.data).toBeInstanceOf(Array);
            expect(response.body.data.length).toBeGreaterThan(0);

            // Check if array is sorted
            const names = response.body.data.map(store => store.name);
            const sortedNames = [...names].sort();
            expect(names).toEqual(sortedNames);
        });
    });
}); 
