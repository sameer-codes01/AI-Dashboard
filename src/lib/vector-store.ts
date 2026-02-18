
import { GoogleGenerativeAI } from "@google/generative-ai";
import prisma from "./prisma";
import { DocumentChunk } from "@prisma/client";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "models/gemini-embedding-001" });

export async function generateEmbedding(text: string): Promise<number[]> {
  const result = await model.embedContent(text);
  return result.embedding.values;
}


// Because pgvector is an extension, we need raw SQL to query it properly with Prisma until fully supported typed API is stable.
// We accepted `Unsupported("vector(768)")` in schema.
export async function findSimilarChunks(embedding: number[], workspaceId: string): Promise<(DocumentChunk & { similarity: number, documentName: string })[]> {
  // Convert embedding array to string format for pgvector: '[1,2,3]'
  const vectorString = `[${embedding.join(',')}]`;

  // Query using raw SQL
  // We join Document to filter by workspaceId
  const chunks = await prisma.$queryRaw`
      SELECT 
        "DocumentChunk".id, 
        "DocumentChunk".content, 
        "DocumentChunk"."documentId",
        "Document".name as "documentName",
        1 - ("DocumentChunk".embedding <=> ${vectorString}::vector) as similarity
      FROM "DocumentChunk"
      JOIN "Document" ON "DocumentChunk"."documentId" = "Document".id
      WHERE "Document"."workspaceId" = ${workspaceId}
      ORDER BY similarity DESC
      LIMIT 5;
    `;

  console.log("Vector Store: Raw chunks sample:", (chunks as any)[0]);
  return chunks as (DocumentChunk & { similarity: number, documentName: string })[];
}
