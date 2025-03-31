import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module.js';
import { generateAdminToken } from '../src/utils/jwt.util.js';
import { AuthMiddleware } from '../src/middleware/auth.middleware.js';
import { clearDatabase, seedDatabase } from './utils/database.util.js';
import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

describe('Items and Prices (e2e)', () => {
    let app: INestApplication;
    let prisma: PrismaClient;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.use(new AuthMiddleware().use);
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

    describe('Item Operations', () => {
        it('should get all items', async () => {
            const token = generateAdminToken();
            const response = await request(app.getHttpServer())
                .get('/items')
                .set('Authorization', `Bearer ${token}`)
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(0);
            expect(response.body[0]).toHaveProperty('id');
            expect(response.body[0]).toHaveProperty('itemCode');
            expect(response.body[0]).toHaveProperty('name');
        });

        it('should get a specific item by id', async () => {
            const token = generateAdminToken();
            const item = await prisma.item.create({
                data: {
                    itemCode: faker.string.alphanumeric(8).toUpperCase(),
                    name: faker.commerce.productName(),
                    unit: 'kg',
                    category: 'Fruits',
                    brand: faker.company.name(),
                }
            });

            const response = await request(app.getHttpServer())
                .get(`/items/${item.id}`)
                .set('Authorization', `Bearer ${token}`)
                .expect(200);

            expect(response.body).toHaveProperty('id', item.id);
            expect(response.body).toHaveProperty('itemCode', item.itemCode);
            expect(response.body).toHaveProperty('name', item.name);
        });

        it('should get items by category', async () => {
            const token = generateAdminToken();
            const category = 'Fruits';
            const response = await request(app.getHttpServer())
                .get(`/items/category/${category}`)
                .set('Authorization', `Bearer ${token}`)
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(0);
            expect(response.body[0]).toHaveProperty('category', category);
        });
    });

    describe('Price Operations', () => {
        it('should get prices for a specific item in a store', async () => {
            const token = generateAdminToken();
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

            const item = await prisma.item.create({
                data: {
                    itemCode: faker.string.alphanumeric(8).toUpperCase(),
                    name: faker.commerce.productName(),
                    unit: 'kg',
                    category: 'Fruits',
                    brand: faker.company.name(),
                }
            });

            const response = await request(app.getHttpServer())
                .get(`/stores/${store.id}/items/${item.id}/prices`)
                .set('Authorization', `Bearer ${token}`)
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body[0]).toHaveProperty('id');
            expect(response.body[0]).toHaveProperty('price');
            expect(response.body[0]).toHaveProperty('itemId', item.id);
            expect(response.body[0]).toHaveProperty('storeId', store.id);
        });

        it('should get latest prices for items in a store', async () => {
            const token = generateAdminToken();
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
                .get(`/stores/${store.id}/prices/latest`)
                .set('Authorization', `Bearer ${token}`)
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body[0]).toHaveProperty('id');
            expect(response.body[0]).toHaveProperty('price');
            expect(response.body[0]).toHaveProperty('storeId', store.id);
        });
    });

    describe('Authentication', () => {
        it('should not allow getting items without authentication', async () => {
            await request(app.getHttpServer())
                .get('/items')
                .expect(403);
        });

        it('should not allow getting prices without authentication', async () => {
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

            await request(app.getHttpServer())
                .get(`/stores/${store.id}/prices/latest`)
                .expect(403);
        });
    });
}); 
