import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

export async function clearDatabase() {
    const prisma = new PrismaClient();
    try {
        // Delete in correct order to handle foreign key constraints
        await prisma.itemPrice.deleteMany({});
        await prisma.item.deleteMany({});
        await prisma.store.deleteMany({});
        await prisma.chain.deleteMany({});
    } finally {
        await prisma.$disconnect();
    }
}

export async function seedDatabase() {
    const prisma = new PrismaClient();
    try {
        // Create a test chain
        const chain = await prisma.chain.create({
            data: {
                name: faker.company.name(),
                stores: {
                    create: [
                        {
                            storeId: faker.string.alphanumeric(8).toUpperCase(),
                            name: faker.company.name(),
                            address: faker.location.streetAddress(),
                            city: faker.location.city(),
                            zipCode: faker.location.zipCode(),
                            prices: {
                                create: [
                                    {
                                        itemCode: faker.string.alphanumeric(8).toUpperCase(),
                                        price: faker.number.float({ min: 1, max: 100, fractionDigits: 2 }),
                                        currency: 'USD',
                                        item: {
                                            create: {
                                                itemCode: faker.string.alphanumeric(8).toUpperCase(),
                                                name: faker.commerce.productName(),
                                                unit: faker.helpers.arrayElement(['kg', 'piece', 'liter', 'g']),
                                                category: faker.helpers.arrayElement(['Fruits', 'Vegetables', 'Dairy', 'Meat', 'Beverages']),
                                                brand: faker.company.name(),
                                            }
                                        }
                                    },
                                    {
                                        itemCode: faker.string.alphanumeric(8).toUpperCase(),
                                        price: faker.number.float({ min: 1, max: 100, fractionDigits: 2 }),
                                        currency: 'USD',
                                        item: {
                                            create: {
                                                itemCode: faker.string.alphanumeric(8).toUpperCase(),
                                                name: faker.commerce.productName(),
                                                unit: faker.helpers.arrayElement(['kg', 'piece', 'liter', 'g']),
                                                category: faker.helpers.arrayElement(['Fruits', 'Vegetables', 'Dairy', 'Meat', 'Beverages']),
                                                brand: faker.company.name(),
                                            }
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            storeId: faker.string.alphanumeric(8).toUpperCase(),
                            name: faker.company.name(),
                            address: faker.location.streetAddress(),
                            city: faker.location.city(),
                            zipCode: faker.location.zipCode(),
                            prices: {
                                create: [
                                    {
                                        itemCode: faker.string.alphanumeric(8).toUpperCase(),
                                        price: faker.number.float({ min: 1, max: 100, fractionDigits: 2 }),
                                        currency: 'USD',
                                        item: {
                                            create: {
                                                itemCode: faker.string.alphanumeric(8).toUpperCase(),
                                                name: faker.commerce.productName(),
                                                unit: faker.helpers.arrayElement(['kg', 'piece', 'liter', 'g']),
                                                category: faker.helpers.arrayElement(['Fruits', 'Vegetables', 'Dairy', 'Meat', 'Beverages']),
                                                brand: faker.company.name(),
                                            }
                                        }
                                    }
                                ]
                            }
                        }
                    ]
                }
            }
        });

        return chain;
    } finally {
        await prisma.$disconnect();
    }
} 
