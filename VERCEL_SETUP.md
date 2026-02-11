# Vercel Setup Guide: Fixing the Database Connection

The error `Environment variable not found: DATABASE_URL` means Vercel does not know where your database is. You cannot use your local SQLite file (`dev.db`) on Vercel.

**Follow these steps exactly to fix it.**

## Step 1: Create a Database on Vercel

1.  Go to your **[Vercel Dashboard](https://vercel.com/dashboard)**.
2.  Select your project (`ai-dashboard` or similar).
3.  Click the **Storage** tab at the top.
4.  Click **Create Database** -> Use **Vercel Postgres** (or Neon).
5.  Accept the terms and click **Create**.
6.  Once created, click **"Connect Project"** and select your project.
7.  **IMPORTANT:** Verify that Vercel automatically added the Environment Variables:
    *   Go to **Settings** -> **Environment Variables**.
    *   Look for `POSTGRES_PRISMA_URL` or `POSTGRES_URL`.

## Step 2: Set the `DATABASE_URL` Variable

Prisma specifically looks for a variable named `DATABASE_URL`.

1.  In **Settings** -> **Environment Variables**, check if `DATABASE_URL` exists.
2.  **If it exists**: You are good.
3.  **If it does NOT exist**:
    *   Find the value for `POSTGRES_PRISMA_URL` (it starts with `postgres://...`).
    *   Copy that entire value.
    *   Create a *new* variable:
        *   **Key**: `DATABASE_URL`
        *   **Value**: (Paste the `POSTGRES_PRISMA_URL` value you copied).
    *   Click **Save**.

## Step 3: Add Other Required Variables

While you are there, ensure these are also set:

1.  **`AUTH_SECRET`**:
    *   **Value**: `fc9480c5763567d16377e8a939109439` (or any long random string).
2.  **`AUTH_TRUST_HOST`**:
    *   **Value**: `true`
3.  **`GEMINI_API_KEY`**:
    *   **Value**: (Your Gemini API Key starting with `AIza...`).

## Step 4: Redeploy (Essential!)

Changing variables does **not** update the live site instantly.

1.  Go to the **Deployments** tab.
2.  Find the most recent deployment (the top one).
3.  Click the **three dots (...)** on the right -> **Redeploy**.
4.  Wait for the build to finish.

## Step 5: Create a New Account

1.  Go to your live site URL.
2.  Click **Sign Up** (Do not try to login with your local account).
3.  Create a fresh account.

**You should now be able to log in!**
