const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

dotenv.config();

const prisma = new PrismaClient();

async function main() {
    const email = "admin@neon.com";
    const password = "NeonPassword123!";
    const name = "Admin User";

    console.log(`Checking for existing user with email: ${email}...`);

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            console.log("User already exists. Updating password and approval status...");
            const hashedPassword = await bcrypt.hash(password, 12);
            await prisma.user.update({
                where: { email },
                data: {
                    password: hashedPassword,
                    isApproved: true,
                    role: "ADMIN",
                },
            });
            console.log("✅ User updated successfully.");
        } else {
            console.log("Creating new admin user...");
            const hashedPassword = await bcrypt.hash(password, 12);
            await prisma.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                    role: "ADMIN",
                    isApproved: true,
                },
            });
            console.log("✅ User created successfully.");
        }

        console.log("\n-----------------------------------");
        console.log("Credentials:");
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);
        console.log("-----------------------------------");
    } catch (error) {
        console.error("❌ Error creating/updating user:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
