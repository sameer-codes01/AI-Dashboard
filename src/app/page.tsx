import Link from "next/link";
import { BarChart3, ShieldCheck, Zap, Globe, LayoutDashboard } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 font-sans transition-colors duration-300">
      <header className="px-8 lg:px-16 h-24 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 sticky top-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md z-50 transition-all">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-black tracking-tight">SaaS<span className="text-indigo-600">Core</span></span>
        </Link>
        <nav className="hidden md:flex gap-10">
          <a href="#features" className="text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Features</a>
          <a href="#" className="text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Enterprise</a>
          <a href="#" className="text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Pricing</a>
        </nav>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link href="/login" className="text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-4 py-2 transition-colors">Log In</Link>
          <Link href="/signup" className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-2.5 rounded-xl font-bold text-sm shadow-xl shadow-slate-200 dark:shadow-slate-900/20 hover:bg-slate-800 dark:hover:bg-slate-100 transition-all active:scale-95">Get Started</Link>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-24 px-8 lg:px-16 text-center max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 text-xs font-black uppercase tracking-widest mb-8 animate-bounce">
            <Zap className="w-3 h-3 fill-indigo-600 dark:fill-indigo-400" />
            Introducing V2.0 Dashboard
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] text-slate-900 dark:text-white mb-8">
            Next-Gen <span className="text-indigo-600 dark:text-indigo-400">Analytics</span> for Modern Teams
          </h1>
          <p className="mt-8 text-xl text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
            Beautifully designed dashboard with role-based access control, real-time data streaming, and advanced administrative tools.
          </p>
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup" className="w-full sm:w-auto bg-indigo-600 text-white px-10 py-5 rounded-2xl font-black text-lg shadow-2xl shadow-indigo-600/30 hover:bg-indigo-700 hover:-translate-y-1 transition-all">
              Start Free Trial
            </Link>
            <Link href="/login" className="w-full sm:w-auto bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-2 border-slate-100 dark:border-slate-800 px-10 py-5 rounded-2xl font-black text-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
              <LayoutDashboard className="w-5 h-5" />
              Live Demo
            </Link>
          </div>
        </section>

        <section id="features" className="py-24 bg-slate-50 dark:bg-slate-900/50 px-8 lg:px-16 border-y border-slate-100 dark:border-slate-800 transition-colors">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="space-y-4 p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 ring-1 ring-slate-100 dark:ring-slate-800 transition-all hover:-translate-y-2 duration-300">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">Role-Based Access</h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">Granular control over user permissions. Manage Admins and Standard Users with ease.</p>
              </div>
              <div className="space-y-4 p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 ring-1 ring-slate-100 dark:ring-slate-800 transition-all hover:-translate-y-2 duration-300 delay-100">
                <div className="w-14 h-14 rounded-2xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
                  <Zap className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">Neon DB Powered</h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">Lightning fast serverless PostgreSQL with branching support for safe deployments.</p>
              </div>
              <div className="space-y-4 p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 ring-1 ring-slate-100 dark:ring-slate-800 transition-all hover:-translate-y-2 duration-300 delay-200">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <Globe className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">Edge Ready</h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">Optimized for Vercel Edge functions for global low-latency performance.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 px-8 lg:px-16 border-t border-slate-100 dark:border-slate-800 text-center transition-colors">
        <p className="text-slate-400 font-bold text-sm tracking-widest uppercase">
          &copy; 2026 SaaS Core. Built with Next.js, Prisma & Neon.
        </p>
      </footer>
    </div>
  );
}
