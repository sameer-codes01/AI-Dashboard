# Vercel Setup Guide: Deploying AI Dashboard

Follow these steps to deploy your project to Vercel and connect your database and AI services.

## Step 1: Push to GitHub
1.  Ensure all your changes are pushed to your repository: `https://github.com/sameer-codes01/AI-Dashboard.git`.

## Step 2: Import Project to Vercel
1.  Go to your **[Vercel Dashboard](https://vercel.com/new)**.
2.  Click **Import** next to your `AI-Dashboard` repository.

## Step 3: Configure Environment Variables
In the **Environment Variables** section during setup (or in **Settings** -> **Environment Variables** after import), add the following:

| Key | Value | Description |
| :--- | :--- | :--- |
| `DATABASE_URL` | `postgresql://...` | Your Neon DB connection string. |
| `AUTH_SECRET` | `fc9480c5763567d16377e8a939109439` | A secure random string for authentication. |
| `AUTH_TRUST_HOST` | `true` | Required for NextAuth on Vercel. |
| `GEMINI_API_KEY` | `AIza...` | Your Google Gemini API Key. |
| `GROQ_API_KEY` | `gsk_...` | Your Groq API Key (for Document QA). |

## Step 4: Deploy
1.  Click **Deploy**.
2.  Wait for the build and deployment to complete.

## Step 5: Database Migration
Since you are using Prisma with a live database (Neon), you need to ensure the schema is applied.
1.  Vercel usually runs `prisma generate` during build if it's in your `postinstall` script.
2.  If the database is empty, you may need to run `npx prisma db push` from your local machine once, pointing to your live `DATABASE_URL`.

## Step 6: Create a New Account
1.  Go to your live site URL (e.g., `https://ai-dashboard-xxx.vercel.app`).
2.  Click **Sign Up** and create a fresh account to verify everything is working.

**Congratulations! Your AI Dashboard is now live!**
