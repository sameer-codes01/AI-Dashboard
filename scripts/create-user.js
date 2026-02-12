require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { hash } = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const email = 'admin@example.com';
    const password = 'password123';
    const hashedPassword = await hash(password, 10);

    try {
        const user = await prisma.user.upsert({
            where: { email },
            update: {},
            create: {
                email,
                name: 'Admin User',
                password: hashedPassword,
                role: 'ADMIN',
                isApproved: true,
            },
        });
        console.log(`User created/updated: ${user.email} with password: ${password}`);
    } catch (e) {
        console.error('Error creating user:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
