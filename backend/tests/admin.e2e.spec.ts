import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module.js';
import { generateAdminToken } from '../src/utils/jwt.util.js'; // Updated path
import { AuthMiddleware } from '../src/middleware/auth.middleware.js';

describe('Chain Resource (e2e)', () => {
    let app: INestApplication;
    let chainId: string;

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

    // Test for creating a chain
    it('should create a new chain', async () => {
        const token = generateAdminToken(); // Generate a token for admin

        const response = await request(app.getHttpServer())
            .post('/chains')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'New Chain' })
            .expect(201);

        expect(response.body).toHaveProperty('id');
        chainId = response.body.id;
    });

    // // Test for modifying a chain
    // it('should modify an existing chain', async () => {
    //     const response = await request(app.getHttpServer())
    //         .put(`/api/chains/${chainId}`)
    //         .send({ name: 'Updated Chain', description: 'Updated description' })
    //         .expect(200);

    //     expect(response.body.name).toBe('Updated Chain');
    // });

    // // Test for deleting a chain
    // it('should delete an existing chain', async () => {
    //     // Create a chain to delete
    //     const createResponse = await request(app.getHttpServer())
    //         .post('/api/chains')
    //         .send({ name: 'Chain to Delete', description: 'Description' })
    //         .expect(201);

    //     const chainIdToDelete = createResponse.body.id;

    //     // Delete the chain
    //     await request(app.getHttpServer())
    //         .delete(`/api/chains/${chainIdToDelete}`)
    //         .expect(204);

    //     // Verify the chain is deleted
    //     await request(app.getHttpServer())
    //         .get(`/api/chains/${chainIdToDelete}`)
    //         .expect(404);
    // });
});
