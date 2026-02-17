
const { PrismaClient } = require('@prisma/client');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: '.env' });

const prisma = new PrismaClient();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function main() {
    console.log('Starting RAG verification...');

    // 1. Create a Test Workspace
    let user = await prisma.user.findFirst();
    if (!user) {
        console.log('No user found. Creating test user...');
        user = await prisma.user.create({
            data: {
                email: 'test@example.com',
                name: 'Test User',
                role: 'USER',
                isApproved: true
            }
        });
    }

    const workspace = await prisma.workspace.create({
        data: {
            name: 'Test Setup Workspace',
            userId: user.id
        }
    });
    console.log('Created workspace:', workspace.id);

    try {
        // 2. Add a Document
        const document = await prisma.document.create({
            data: {
                name: 'test_manual.txt',
                content: 'The secret code for the verification is "BLUE-OMEGA-99". Use this code to pass level 5.',
                userId: user.id,
                workspaceId: workspace.id
            }
        });

        // 3. Generate Embedding
        console.log('Generating embedding...');
        const model = genAI.getGenerativeModel({ model: "models/gemini-embedding-001" });
        const result = await model.embedContent(document.content);
        const embedding = result.embedding.values;

        // 4. Storing Chunk
        const vectorString = `[${embedding.join(',')}]`;
        await prisma.$executeRawUnsafe(`
        INSERT INTO "DocumentChunk" ("id", "content", "embedding", "documentId", "createdAt")
        VALUES (gen_random_uuid(), $1, $2::vector, $3, NOW());
    `, document.content, vectorString, document.id);
        console.log('Stored chunk with embedding.');

        // 5. Query
        console.log('Querying for "secret code"...');
        const queryEmbeddingResult = await model.embedContent("What is the secret code?");
        const queryEmbedding = queryEmbeddingResult.embedding.values;
        const queryVectorString = `[${queryEmbedding.join(',')}]`;

        const similar = await prisma.$queryRawUnsafe(`
      SELECT 
        "DocumentChunk".content,
        1 - ("DocumentChunk".embedding <=> $1::vector) as similarity
      FROM "DocumentChunk"
      JOIN "Document" ON "DocumentChunk"."documentId" = "Document".id
      WHERE "Document"."workspaceId" = $2
      ORDER BY similarity DESC
      LIMIT 1;
    `, queryVectorString, workspace.id);

        console.log('Search Result:', similar);

        if (similar.length > 0 && similar[0].content.includes("BLUE-OMEGA-99")) {
            console.log('✅ VERIFICATION PASSED: Retrieved correct secret code.');
        } else {
            console.error('❌ VERIFICATION FAILED: Did not retrieve relevant content.');
        }

    } catch (e) {
        console.error('Error during verification:', e);
    } finally {
        // Cleanup
        await prisma.workspace.delete({ where: { id: workspace.id } });
        console.log('Cleaned up test workspace.');
        await prisma.$disconnect();
    }
}

main();
