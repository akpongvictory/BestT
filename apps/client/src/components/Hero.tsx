import React from 'react';
import { Brain, ArrowRight, Upload, HelpCircle, GraduationCap } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden pt-20 pb-16 px-6 bg-grid-pattern">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-72 h-72 bg-accent-cyan/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-slate-700/50 mb-8">
          <Brain className="w-4 h-4 text-accent-violet" />
          <span className="text-xs font-semibold text-slate-200">
            Next-Gen AI Personalized Learning Companion
          </span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
          Transform Your Notes Into An{' '}
          <span className="bg-gradient-to-r from-brand-500 via-accent-violet to-accent-cyan bg-clip-text text-transparent">
            Interactive AI Tutor
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed">
          Upload learning materials, ask grounded questions, generate instant assessment quizzes, and master complex subjects faster than ever.
        </p>

        <div className="flex flex-wrap justify-center items-center gap-4">
          <a
            href="#health"
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-brand-600 to-accent-violet text-white font-semibold shadow-lg shadow-brand-500/25 hover:opacity-95 transition-all flex items-center gap-2"
          >
            Check System Health <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="#features"
            className="px-8 py-3.5 rounded-xl glass-card text-slate-300 font-semibold border border-slate-700/60 hover:bg-slate-800/60 transition-all"
          >
            Explore Platform Architecture
          </a>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="glass-card p-6 rounded-2xl glass-card-hover">
            <div className="w-10 h-10 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-500 mb-4">
              <Upload className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Upload Materials</h3>
            <p className="text-sm text-slate-400">
              Easily upload PDF lecture slides, syllabus notes, and textbook chapters for processing.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl glass-card-hover">
            <div className="w-10 h-10 rounded-lg bg-accent-violet/10 border border-accent-violet/20 flex items-center justify-center text-accent-violet mb-4">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Grounded AI Tutor</h3>
            <p className="text-sm text-slate-400">
              Retrieval-Augmented Generation (RAG) ensures answers are accurate and tied to your course material.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl glass-card-hover">
            <div className="w-10 h-10 rounded-lg bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center text-accent-cyan mb-4">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Quiz & Progress</h3>
            <p className="text-sm text-slate-400">
              Automated quiz generation and progress tracking highlight your weak areas for active recall.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
