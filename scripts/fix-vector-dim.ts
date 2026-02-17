
const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: '.env' });

const prisma = new PrismaClient();

async function main() {
    console.log('Fixing vector dimensions...');
    try {
        // Force the column to be vector(3072)
        await prisma.$executeRawUnsafe(`
      ALTER TABLE "DocumentChunk" 
      ALTER COLUMN "embedding" TYPE vector(3072);
    `);
        console.log('✅ Successfully altered column to vector(3072).');
    } catch (e) {
        console.error('Error altering column:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
