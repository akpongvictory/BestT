import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { HealthMonitor } from './components/HealthMonitor';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5000,
    },
  },
});

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col justify-between">
      <div>
        <Navbar />
        <main>
          <Hero />
          <Features />
          <HealthMonitor />
        </main>
      </div>

      <footer className="border-t border-slate-800/80 py-8 px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>© {new Date().getFullYear()} BestT AI Learning Companion. All rights reserved.</span>
          <div className="flex items-center space-x-6">
            <a href="#features" className="hover:text-slate-400">Features</a>
            <a href="#health" className="hover:text-slate-400">Health Check</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
