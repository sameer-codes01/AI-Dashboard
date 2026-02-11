const fs = require('fs');

console.log('🔍 Checking Environment Variables...');

const hasDatabaseUrl = !!process.env.DATABASE_URL;
const hasVercelUrl = !!process.env.POSTGRES_PRISMA_URL;

if (hasDatabaseUrl) {
    console.log('✅ DATABASE_URL is set.');
} else if (hasVercelUrl) {
    console.warn('⚠️  POSTGRES_PRISMA_URL found, but DATABASE_URL is missing!');
    console.warn('   Prisma needs DATABASE_URL.');
    console.warn('   👉 ACTION: Go to Vercel Settings -> Environment Variables.');
    console.warn('   👉 Create "DATABASE_URL" and paste the value of "POSTGRES_PRISMA_URL".');
    // We don't exit(1) here because maybe they strictly use the other one in a modified schema, 
    // but for this project we want to force it or at least scream loudly.
    console.error('❌ ERROR: Missing DATABASE_URL. The app will fail at runtime.');
    process.exit(1);
} else {
    console.error('❌ ERROR: DATABASE_URL is missing!');
    console.error('   The app cannot connect to the database.');
    console.error('   👉 ACTION: Create a Database in Vercel (Storage tab) or add a PostgreSQL connection string.');
    process.exit(1);
}

const hasAuthSecret = !!process.env.AUTH_SECRET;
if (!hasAuthSecret) {
    console.error('❌ ERROR: AUTH_SECRET is missing!');
    console.error('   Required for NextAuth.');
    console.error('   👉 ACTION: Add AUTH_SECRET to Vercel Environment Variables.');
    process.exit(1);
}

console.log('✅ Environment checks passed!');
