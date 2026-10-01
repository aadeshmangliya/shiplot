import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Anchor,
  Box,
  CheckCircle,
  Clock,
  ShieldCheck,
  FileCheck2,
  Warehouse
} from 'lucide-react';

export const PortalAgentPage: React.FC = () => {
  const { containers, shipments } = useApp();
  const [gatedOut, setGatedOut] = useState<Record<string, boolean>>({});

  const handleGateOut = (id: string) => {
    setGatedOut(prev => ({ ...prev, [id]: true }));
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
            PORT AGENT & CFS OPERATOR
          </span>
          <span className="text-xs text-neutral-400 font-mono">
            Terminal Gate-In & Stripping Desk
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white tracking-tight mt-1">
          Destination Agent & Terminal Gate Operations
        </h1>
        <p className="text-xs text-neutral-500 font-mono mt-0.5">
          Manage CFS de-consolidation, container seal verification, terminal gate-out, and delivery receipts.
        </p>
      </div>

      {/* Terminal Gate Tasks */}
      <div className="rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs overflow-hidden p-5 space-y-4">
        <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
          Active Discharged Containers Awaiting CFS Gate-Out
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-400 text-[11px]">
                <th className="py-2.5 px-3">Container No</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Seal No</th>
                <th className="py-2.5 px-3">Vessel</th>
                <th className="py-2.5 px-3">Terminal Location</th>
                <th className="py-2.5 px-3">Free-Time Remaining</th>
                <th className="py-2.5 px-3 text-right">Gate Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {containers.map(c => {
                const isReleased = gatedOut[c.id];
                return (
                  <tr key={c.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40">
                    <td className="py-3 px-3 font-bold text-neutral-900 dark:text-white">
                      {c.containerNo}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 font-bold">
                        {c.type}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-neutral-600 dark:text-neutral-400">
                      {c.sealNo}
                    </td>
                    <td className="py-3 px-3 text-neutral-800 dark:text-neutral-200">
                      {c.vesselName} ({c.voyage})
                    </td>
                    <td className="py-3 px-3 text-neutral-500">
                      {c.pod}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          c.demurrageRisk === 'critical'
                            ? 'bg-rose-500 text-white'
                            : c.demurrageRisk === 'warning'
                            ? 'bg-amber-500 text-white'
                            : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        }`}
                      >
                        {c.daysRemaining} days left
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {isReleased ? (
                        <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 justify-end">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Gated Out / CFS</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => handleGateOut(c.id)}
                          className="px-2.5 py-1 rounded bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-950 font-sans text-[11px] font-medium transition-colors"
                        >
                          Confirm Terminal Gate-Out
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
