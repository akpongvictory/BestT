import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Activity, CheckCircle2, AlertCircle, RefreshCw, Database, Clock, Server } from 'lucide-react';
interface HealthCheckResponse {
  status: string;
  timestamp: string;
  uptime: number;
  environment: string;
  database: string;
}

interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

const fetchHealth = async (): Promise<HealthCheckResponse> => {
  const res = await fetch('/health');
  if (!res.ok) {
    throw new Error(`Health check failed with status: ${res.status}`);
  }
  const json: ApiResponse<HealthCheckResponse> = await res.json();
  if (!json.success || !json.data) {
    throw new Error(json.error || 'Invalid response');
  }
  return json.data;
};

export const HealthMonitor: React.FC = () => {
  const { data, error, isLoading, isFetching, refetch } = useQuery<HealthCheckResponse>({
    queryKey: ['backend-health'],
    queryFn: fetchHealth,
    refetchInterval: 10000,
    retry: 1,
  });

  return (
    <section id="health" className="py-16 px-6 max-w-4xl mx-auto">
      <div className="glass-card p-8 rounded-3xl border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Activity className="w-5 h-5 text-accent-violet" />
              <h2 className="text-2xl font-bold text-white">Backend Health Status</h2>
            </div>
            <p className="text-sm text-slate-400">
              Live status monitor polling Express backend endpoint <code className="text-brand-500 bg-slate-900 px-2 py-0.5 rounded">/health</code>
            </p>
          </div>

          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="px-4 py-2 rounded-xl glass-card text-xs font-semibold text-slate-200 border border-slate-700/80 hover:bg-slate-800 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`} />
            Refresh Status
          </button>
        </div>

        {isLoading ? (
          <div className="py-12 text-center text-slate-400 flex flex-col items-center gap-3">
            <RefreshCw className="w-8 h-8 animate-spin text-brand-500" />
            <span>Connecting to BestT Backend Service...</span>
          </div>
        ) : error ? (
          <div className="p-6 rounded-2xl bg-red-950/30 border border-red-900/50 text-red-200">
            <div className="flex items-center gap-3 mb-2">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <h4 className="font-bold text-red-300">Backend Endpoint Unavailable</h4>
            </div>
            <p className="text-xs text-red-300/80 leading-relaxed mb-4">
              Could not fetch health check status. Make sure the Express server is running on port 5000 (`npm run dev --workspace=apps/server`).
            </p>
            <span className="font-mono text-xs bg-red-950 px-2 py-1 rounded text-red-400">
              {(error as Error).message}
            </span>
          </div>
        ) : data ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-emerald-950/30 border border-emerald-900/40">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                <div>
                  <span className="text-sm font-bold text-emerald-300 block">Server Operational</span>
                  <span className="text-xs text-emerald-400/80">Express app running cleanly</span>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 uppercase tracking-wider">
                {data.status}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center gap-2 text-slate-400 mb-1">
                  <Database className="w-4 h-4 text-accent-cyan" />
                  <span className="text-xs font-semibold">Database Status</span>
                </div>
                <span className={`text-base font-bold capitalize ${data.database === 'connected' ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {data.database}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center gap-2 text-slate-400 mb-1">
                  <Server className="w-4 h-4 text-brand-500" />
                  <span className="text-xs font-semibold">Environment</span>
                </div>
                <span className="text-base font-bold text-white capitalize">
                  {data.environment}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center gap-2 text-slate-400 mb-1">
                  <Clock className="w-4 h-4 text-accent-violet" />
                  <span className="text-xs font-semibold">Uptime</span>
                </div>
                <span className="text-base font-bold text-white">
                  {Math.floor(data.uptime)}s
                </span>
              </div>
            </div>

            <div className="text-right text-xs text-slate-500 font-mono">
              Last check: {new Date(data.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
};

