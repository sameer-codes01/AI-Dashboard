# SaaS Core Dashboard

![Dashboard Preview](public/dashboard-preview.png)

A modern, high-performance SaaS Dashboard built with **Next.js 15**, **React 19**, and **Tailwind CSS**. Features a premium Glassmorphism design with full **Dark Mode** support, AI capabilities, and comprehensive role-based access control.

## 🚀 Features

- **🎨 Verified Glassmorphism UI**: Beautiful, translucent design with vibrant neon accents and smooth animations.
- **🌑 Dark Mode Support**: Fully integrated dark theme with a toggle switch, persisting user preference.
- **🤖 AI Summarizer**: Intelligent YouTube video summarizer powered by Google Gemini AI.
- **🔐 Secure Authentication**: Robust auth system using NextAuth v5 with role-based access (User/Admin).
- **📊 Interactive Charts**: Dynamic data visualization using Recharts.
- **👥 Admin Panel**: User management, status toggling, and system settings.
- **💳 Plan Management**: Billing page with pricing tiers (Free, Pro, Enterprise).
- **⚡ Tech Stack**: Next.js 15, Neon DB (PostgreSQL), Prisma ORM, Tailwind CSS v4.

## 🛠️ Getting Started

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/sameer-codes01/Neon_Dashboard.git
    cd Neon_Dashboard
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Set up Environment Variables**:
    Create a `.env` file in the root and add your credentials:
    ```env
    DATABASE_URL="postgresql://..."
    AUTH_SECRET="..."
    GOOGLE_API_KEY="..."
    ```

4.  **Run the development server**:
    ```bash
    npm run dev
    ```

5.  Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📂 Project Structure

- `/src/app`: App Router, pages, and layouts.
- `/src/components`: Reusable UI components (Navbar, Sidebar, Cards, Charts).
- `/src/lib`: Utility functions, database actions, and AI logic.
- `/src/data`: Mock data for development.
- `/public`: Static assets.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
