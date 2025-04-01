import { clearDatabase, seedDatabase } from '../tests/utils/database.util.js';

async function main() {
    console.log('🌱 Seeding database...');

    await clearDatabase();
    const chain = await seedDatabase();

    console.log(`✅ Seeded chain: ${chain.name}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    }); 
