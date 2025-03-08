import { PrismaClient } from '@prisma/client';

export async function clearDatabase() {
    const prisma = new PrismaClient();
    try {
        // await prisma.itemPrice.deleteMany({});
        // await prisma.item.deleteMany({});
        // await prisma.store.deleteMany({});
        await prisma.chain.deleteMany({});
    } finally {
        await prisma.$disconnect();
    }
}

export async function seedDatabase() {
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
