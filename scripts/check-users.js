require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Connecting to database...');
    try {
        const users = await prisma.user.findMany();
        console.log('Users found:', users.length);
        if (users.length === 0) {
            console.log('No users found in the database.');
        } else {
            users.forEach(u => {
                console.log(`- Email: ${u.email}, Role: ${u.role}, Approved: ${u.isApproved}, ID: ${u.id}`);
            });
        }
    } catch (e) {
        console.error('Error connecting to DB or fetching users:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
