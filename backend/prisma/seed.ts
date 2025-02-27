import { ObjectId } from 'mongodb';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // Example: Seeding Chains
    const chain = await prisma.chain.upsert({
        where: { id: new ObjectId().toString() },
        update: {},
        create: {
            id: new ObjectId().toString(),
            name: 'Example Chain',
            // Add other fields as necessary
        },
    });

    console.log(`✅ Seeded chain: ${chain.name}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    }); 
