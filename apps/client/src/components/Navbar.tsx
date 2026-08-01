import React from 'react';
import { Sparkles, BookOpen, Layers, Activity } from 'lucide-react';

export const Navbar: React.FC = () => {
  return (
    <nav className="sticky top-0 z-50 glass-card border-b border-slate-800/80 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-accent-violet to-accent-cyan flex items-center justify-center shadow-lg shadow-brand-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              BestT
            </span>
            <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-500 border border-brand-500/20">
              v0.1.0 Foundation
            </span>
          </div>
        </div>

        <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-300">
          <a href="#features" className="hover:text-brand-500 transition-colors flex items-center gap-2">
            <Layers className="w-4 h-4" /> Core Features
          </a>
          <a href="#architecture" className="hover:text-brand-500 transition-colors flex items-center gap-2">
            <BookOpen className="w-4 h-4" /> Architecture
          </a>
          <a href="#health" className="hover:text-brand-500 transition-colors flex items-center gap-2">
            <Activity className="w-4 h-4" /> Backend Health
          </a>
        </div>

        <div className="flex items-center space-x-4">
          <span className="text-xs text-slate-400 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900/50">
            Sprint 1 Setup
          </span>
        </div>
      </div>
    </nav>
  );
};
