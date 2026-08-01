import React from 'react';
import { Server, Cpu, Database, Package, Shield, FileCode2 } from 'lucide-react';

export const Features: React.FC = () => {
  const packages = [
    { name: '@bestt/types', desc: 'Shared TypeScript interfaces and API schemas', color: 'border-accent-cyan/30 text-accent-cyan' },
    { name: '@bestt/shared', desc: 'Shared domain constants, date formatting, and utilities', color: 'border-brand-500/30 text-brand-500' },
    { name: '@bestt/ai', desc: 'Modular RAG pipeline and AI agent services', color: 'border-accent-violet/30 text-accent-violet' },
    { name: '@bestt/prompts', desc: 'System prompt templates for tutoring & assessment', color: 'border-emerald-500/30 text-emerald-400' },
  ];

  return (
    <section id="features" className="py-16 px-6 max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-extrabold text-white mb-4">
          Production TypeScript Monorepo
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
          Built with clean separation of concerns, npm workspaces, strict TypeScript types, and modular package architecture.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="glass-card p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-lg bg-slate-800 text-brand-500">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Express Server Backend</h3>
              <span className="text-xs text-slate-400">Node.js + Express + Prisma ORM</span>
            </div>
          </div>
          <ul className="text-sm text-slate-300 space-y-2">
            <li className="flex items-center gap-2"><Shield className="w-4 h-4 text-emerald-400" /> Express REST API with health check</li>
            <li className="flex items-center gap-2"><Database className="w-4 h-4 text-accent-cyan" /> Prisma PostgreSQL database integration</li>
            <li className="flex items-center gap-2"><FileCode2 className="w-4 h-4 text-brand-500" /> Modular services and controllers</li>
          </ul>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-lg bg-slate-800 text-accent-violet">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Vite React Client</h3>
              <span className="text-xs text-slate-400">React + Vite + Tailwind CSS + TanStack Query</span>
            </div>
          </div>
          <ul className="text-sm text-slate-300 space-y-2">
            <li className="flex items-center gap-2"><Shield className="w-4 h-4 text-emerald-400" /> React 18 with Vite fast HMR</li>
            <li className="flex items-center gap-2"><Database className="w-4 h-4 text-accent-cyan" /> TanStack Query for server state management</li>
            <li className="flex items-center gap-2"><Package className="w-4 h-4 text-brand-500" /> Tailwind CSS glassmorphism UI theme</li>
          </ul>
        </div>
      </div>

      <div className="glass-card p-8 rounded-2xl border border-slate-800">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Package className="w-5 h-5 text-brand-500" /> Internal Monorepo Packages
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {packages.map((pkg) => (
            <div key={pkg.name} className={`p-4 rounded-xl border bg-slate-950/40 ${pkg.color}`}>
              <span className="font-mono text-sm font-bold block mb-1">{pkg.name}</span>
              <p className="text-xs text-slate-400">{pkg.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
