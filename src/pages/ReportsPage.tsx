import React from 'react';
import { useApp } from '../context/AppContext';
import {
  BarChart3,
  TrendingUp,
  Percent,
  DollarSign,
  Box,
  Boxes,
  ArrowUpRight,
  Download
} from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const { monthlyMetrics, currentCompany } = useApp();

  const totalRev = monthlyMetrics.reduce((s, m) => s + m.revenueUsd, 0);
  const totalCost = monthlyMetrics.reduce((s, m) => s + m.freightCostUsd, 0);
  const grossProfit = totalRev - totalCost;
  const marginPercent = Math.round((grossProfit / totalRev) * 100);

  const topCorridors = [
    { route: 'USLAX → CNSHA', volumeTeu: 4420, share: '38%', avgTransitDays: 14.5, onTime: '94%' },
    { route: 'CNSHA → USLAX', volumeTeu: 3890, share: '32%', avgTransitDays: 15.2, onTime: '89%' },
    { route: 'SGSIN → USLAX', volumeTeu: 1950, share: '18%', avgTransitDays: 22.0, onTime: '92%' },
    { route: 'USNYC → DEHAM', volumeTeu: 1340, share: '12%', avgTransitDays: 11.8, onTime: '96%' }
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
              OPERATIONAL INTELLIGENCE
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white tracking-tight mt-1">
            Throughput, Freight Revenue & Margin Analytics
          </h1>
          <p className="text-xs text-neutral-500 font-mono mt-0.5">
            Historical 12-month performance for {currentCompany.name}
          </p>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono text-xs">
        <div className="p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <span className="text-neutral-400">Total 12M Gross Revenue</span>
          <div className="text-2xl font-bold text-neutral-900 dark:text-white mt-1">
            ${(totalRev / 1000000).toFixed(2)}M
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+18.4% YoY Growth</span>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <span className="text-neutral-400">Net Freight Gross Margin</span>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            ${(grossProfit / 1000).toFixed(0)}k ({marginPercent}%)
          </div>
          <span className="text-[11px] text-neutral-500 font-sans mt-1 block">Carrier BAF & slot spreads</span>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <span className="text-neutral-400">Annual Throughput</span>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
            {monthlyMetrics.reduce((s, m) => s + m.fclTeu, 0).toLocaleString()} TEUs
          </div>
          <span className="text-[11px] text-neutral-500 font-sans mt-1 block">
            {monthlyMetrics.reduce((s, m) => s + m.lclCbm, 0).toLocaleString()} LCL CBM
          </span>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <span className="text-neutral-400">Average On-Time Arrival</span>
          <div className="text-2xl font-bold text-neutral-900 dark:text-white mt-1">
            92.8%
          </div>
          <span className="text-[11px] text-neutral-500 font-sans mt-1 block">Carrier schedule reliability</span>
        </div>
      </div>

      {/* Monthly Performance Table */}
      <div className="p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4">
        <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
          Monthly Performance Breakdown (2026)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-400 text-[11px]">
                <th className="py-2.5 px-3">Month</th>
                <th className="py-2.5 px-3">FCL (TEU)</th>
                <th className="py-2.5 px-3">LCL (CBM)</th>
                <th className="py-2.5 px-3">Export vs Import</th>
                <th className="py-2.5 px-3">Revenue (USD)</th>
                <th className="py-2.5 px-3">Carrier Cost (USD)</th>
                <th className="py-2.5 px-3">Gross Margin</th>
                <th className="py-2.5 px-3 text-right">Schedule Reliability</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {monthlyMetrics.map((m, idx) => {
                const profit = m.revenueUsd - m.freightCostUsd;
                const margin = Math.round((profit / m.revenueUsd) * 100);
                return (
                  <tr key={idx} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40">
                    <td className="py-3 px-3 font-bold text-neutral-900 dark:text-white">
                      {m.month} 2026
                    </td>
                    <td className="py-3 px-3 font-semibold text-blue-600 dark:text-blue-400">
                      {m.fclTeu} TEU
                    </td>
                    <td className="py-3 px-3 text-purple-600 dark:text-purple-400">
                      {m.lclCbm} CBM
                    </td>
                    <td className="py-3 px-3 text-neutral-600 dark:text-neutral-400">
                      {m.exportTeu} Exp / {m.importTeu} Imp
                    </td>
                    <td className="py-3 px-3 font-bold text-neutral-900 dark:text-white">
                      ${m.revenueUsd.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-neutral-500">
                      ${m.freightCostUsd.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-emerald-600 dark:text-emerald-400 font-bold">
                      ${profit.toLocaleString()} ({margin}%)
                    </td>
                    <td className="py-3 px-3 text-right font-semibold text-neutral-900 dark:text-white">
                      {m.onTimePercent}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Corridors Grid */}
      <div className="p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4">
        <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
          Key Ocean Trade Lanes & Corridors
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {topCorridors.map((c, idx) => (
            <div
              key={idx}
              className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800 space-y-2 text-xs font-mono"
            >
              <div className="font-bold text-sm text-neutral-900 dark:text-white">
                {c.route}
              </div>
              <div className="flex justify-between text-neutral-500">
                <span>Volume:</span>
                <span className="font-semibold text-neutral-900 dark:text-white">{c.volumeTeu} TEUs ({c.share})</span>
              </div>
              <div className="flex justify-between text-neutral-500">
                <span>Avg Transit:</span>
                <span className="text-neutral-700 dark:text-neutral-300">{c.avgTransitDays} days</span>
              </div>
              <div className="flex justify-between text-neutral-500">
                <span>On-Time:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">{c.onTime}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
