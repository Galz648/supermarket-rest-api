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
