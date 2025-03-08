import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module.js';
import { generateAdminToken } from '../src/utils/jwt.util.js'; // Updated path
import { AuthMiddleware } from '../src/middleware/auth.middleware.js';
import { clearDatabase, seedDatabase } from './utils/database.util.js';
describe('Chain Resource (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();

        // Apply the AuthMiddleware to ensure JWT verification works in tests
        app.use(new AuthMiddleware().use);

        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    beforeEach(async () => {
        await clearDatabase();
        await seedDatabase();
    });

    // Test for creating a chain
    it('should create a new chain', async () => {
        const token = generateAdminToken(); // Generate a token for admin

        const response = await request(app.getHttpServer())
            .post('/chains')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'New Chain' })
            .expect(201);

        expect(response.body).toHaveProperty('id');
    });

    it.only('should delete an existing chain', async () => {
        const token = generateAdminToken(); // Generate a token for admin

        const createResponse = await request(app.getHttpServer())
            .post('/chains')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Chain to Delete' })
            .expect(201);

        const chainIdToDelete = createResponse.body.id;
        console.log('chainIdToDelete', chainIdToDelete);
        await request(app.getHttpServer())
            .delete(`/chains/${chainIdToDelete}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(204);

        await request(app.getHttpServer())
            .get(`/chains/${chainIdToDelete}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(404);
    });
});
