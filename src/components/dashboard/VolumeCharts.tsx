import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  BarChart,
} from 'recharts';
import { MONTHLY_VOLUMES, TRADE_LANES, CARRIER_METRICS } from '../../mock/shippingData';
import {
  TrendingUp,
  Layers,
  PieChart as PieIcon,
  BarChart2,
  DollarSign,
  Maximize2,
} from 'lucide-react';

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomVolumeTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-3 shadow-xl text-xs space-y-1.5 font-sans">
        <div className="font-bold text-neutral-900 dark:text-white border-b border-neutral-100 dark:border-neutral-800 pb-1 font-mono">
          {label} 2026 Volume Record
        </div>
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center justify-between gap-4 font-mono text-[11px]">
            <span className="flex items-center gap-1.5 text-neutral-500">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              {entry.name}:
            </span>
            <span className="font-bold text-neutral-900 dark:text-white tabular-nums">
              {entry.name.includes('$') || entry.name.includes('Revenue') || entry.name.includes('Cost')
                ? `$${entry.value.toLocaleString()}`
                : entry.name.includes('%')
                ? `${entry.value}%`
                : `${entry.value.toLocaleString()} ${entry.name.includes('LCL') ? 'CBM' : 'TEU'}`}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const VolumeCharts: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'throughput' | 'trade_lanes' | 'carriers' | 'financials'>('throughput');
  const [metricMode, setMetricMode] = useState<'all' | 'fcl' | 'lcl'>('all');

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-5 shadow-xs space-y-4">
      {/* Top Header & Interactive Segmented Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-100 dark:border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200">
              ANALYTICS ENGINE
            </span>
            <span className="text-xs text-neutral-400">· Monthly Sea Freight Volumes & Telemetry</span>
          </div>
          <h2 className="text-base font-bold text-neutral-900 dark:text-white tracking-tight mt-1">
            Shipping Volume & Capacity Throughput
          </h2>
        </div>

        {/* View Tabs */}
        <div className="flex items-center gap-1 p-0.5 bg-neutral-100 dark:bg-neutral-800 rounded text-xs">
          <button
            onClick={() => setActiveTab('throughput')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-medium transition-colors ${
              activeTab === 'throughput'
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs font-semibold'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Monthly Volumes</span>
          </button>

          <button
            onClick={() => setActiveTab('trade_lanes')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-medium transition-colors ${
              activeTab === 'trade_lanes'
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs font-semibold'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <PieIcon className="w-3.5 h-3.5" />
            <span>Trade Lanes</span>
          </button>

          <button
            onClick={() => setActiveTab('carriers')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-medium transition-colors ${
              activeTab === 'carriers'
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs font-semibold'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Carriers</span>
          </button>

          <button
            onClick={() => setActiveTab('financials')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-medium transition-colors ${
              activeTab === 'financials'
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs font-semibold'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Revenue Yield</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: MONTHLY VOLUME THROUGHPUT */}
      {activeTab === 'throughput' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-4 text-neutral-500 font-mono text-[11px]">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-neutral-900 dark:bg-white inline-block" />
                FCL Full Containers (TEU)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-neutral-400 dark:bg-neutral-500 inline-block" />
                LCL Consolidation (CBM)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-emerald-500 inline-block" />
                On-Time Vessel Arrival Rate (%)
              </span>
            </div>

            <div className="flex items-center gap-1 p-0.5 bg-neutral-100 dark:bg-neutral-800 rounded font-mono text-[11px]">
              <button
                onClick={() => setMetricMode('all')}
                className={`px-2 py-0.5 rounded ${metricMode === 'all' ? 'bg-white dark:bg-neutral-900 font-semibold shadow-xs' : 'text-neutral-500'}`}
              >
                All Metrics
              </button>
              <button
                onClick={() => setMetricMode('fcl')}
                className={`px-2 py-0.5 rounded ${metricMode === 'fcl' ? 'bg-white dark:bg-neutral-900 font-semibold shadow-xs' : 'text-neutral-500'}`}
              >
                FCL TEUs
              </button>
              <button
                onClick={() => setMetricMode('lcl')}
                className={`px-2 py-0.5 rounded ${metricMode === 'lcl' ? 'bg-white dark:bg-neutral-900 font-semibold shadow-xs' : 'text-neutral-500'}`}
              >
                LCL CBM
              </button>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={MONTHLY_VOLUMES} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorFcl" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#171717" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#171717" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorLcl" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#737373" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#737373" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-neutral-200 dark:text-neutral-800" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: 'currentColor' }} className="text-neutral-500 font-mono" />
                <YAxis yAxisId="left" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: 'currentColor' }} className="text-neutral-500 font-mono" />
                <YAxis yAxisId="right" orientation="right" domain={[80, 100]} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: 'currentColor' }} className="text-neutral-400 font-mono" unit="%" />
                <Tooltip content={<CustomVolumeTooltip />} />

                {(metricMode === 'all' || metricMode === 'fcl') && (
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="fclTeu"
                    name="FCL TEU"
                    stroke="#171717"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorFcl)"
                  />
                )}

                {(metricMode === 'all' || metricMode === 'lcl') && (
                  <Bar
                    yAxisId="left"
                    dataKey="lclCbm"
                    name="LCL CBM"
                    fill="#737373"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={22}
                  />
                )}

                {metricMode === 'all' && (
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="onTimePercent"
                    name="On-Time Rate"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ r: 3, fill: '#10b981' }}
                  />
                )}
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-neutral-100 dark:border-neutral-800 text-xs font-mono">
            <div>
              <span className="text-neutral-400 text-[10px] block">YTD Throughput</span>
              <span className="font-bold text-neutral-900 dark:text-white text-sm">
                15,870 TEUs
              </span>
            </div>
            <div>
              <span className="text-neutral-400 text-[10px] block">LCL Groupage CBM</span>
              <span className="font-bold text-neutral-900 dark:text-white text-sm">
                68,650 m³
              </span>
            </div>
            <div>
              <span className="text-neutral-400 text-[10px] block">Peak Monthly High</span>
              <span className="font-bold text-neutral-900 dark:text-white text-sm">
                1,610 TEU (Nov)
              </span>
            </div>
            <div>
              <span className="text-neutral-400 text-[10px] block">Annual Volume Growth</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                +14.8% YoY
              </span>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: TRADE LANES BREAKDOWN */}
      {activeTab === 'trade_lanes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={TRADE_LANES}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="teu"
                  nameKey="lane"
                >
                  {TRADE_LANES.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => [`${value.toLocaleString()} TEUs`, 'Volume']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-3 text-xs">
            <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Primary Maritime Trade Lane Share
            </div>
            {TRADE_LANES.map((lane) => (
              <div key={lane.code} className="p-2.5 rounded border border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-neutral-900 dark:text-white flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: lane.color }} />
                    <span className="truncate max-w-[200px]">{lane.lane}</span>
                  </div>
                  <div className="text-[11px] text-neutral-500 font-mono ml-4">
                    Routing Code: {lane.code}
                  </div>
                </div>
                <div className="text-right font-mono font-bold tabular-nums text-neutral-900 dark:text-white">
                  <div>{lane.percentage}%</div>
                  <div className="text-[11px] text-neutral-400 font-normal">{lane.teu.toLocaleString()} TEU</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 3: CARRIER SLOTS & PERFORMANCE */}
      {activeTab === 'carriers' && (
        <div className="space-y-4">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CARRIER_METRICS} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-neutral-200 dark:text-neutral-800" />
                <XAxis dataKey="code" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} className="text-neutral-500 font-mono" />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11 }} className="text-neutral-500 font-mono" />
                <Tooltip
                  formatter={(val: any, name: any) => [
                    name === 'teuAllocated' ? `${val} TEUs` : `${val}%`,
                    name === 'teuAllocated' ? 'Contract Slots' : 'On-Time Rate',
                  ]}
                />
                <Bar dataKey="teuAllocated" name="Contract Slots (TEU)" fill="#171717" radius={[4, 4, 0, 0]} maxBarSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="border border-neutral-200 dark:border-neutral-800 rounded divide-y divide-neutral-100 dark:divide-neutral-800 text-xs font-mono">
            {CARRIER_METRICS.map((c) => (
              <div key={c.code} className="p-3 flex items-center justify-between">
                <div>
                  <div className="font-bold text-neutral-900 dark:text-white">{c.carrier}</div>
                  <div className="text-[11px] text-neutral-500">{c.activeVessels} Active chartered vessels</div>
                </div>
                <div className="text-right">
                  <div className="text-emerald-600 dark:text-emerald-400 font-bold">{c.onTimeRate}% on-time</div>
                  <div className="text-[11px] text-neutral-400">Avg delay: {c.avgDelayDays}d</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 4: FINANCIAL REVENUE YIELD */}
      {activeTab === 'financials' && (
        <div className="space-y-4">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={MONTHLY_VOLUMES} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-neutral-200 dark:text-neutral-800" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} className="text-neutral-500 font-mono" />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11 }} tickFormatter={(val) => `$${val / 1000}k`} className="text-neutral-500 font-mono" />
                <Tooltip content={<CustomVolumeTooltip />} />
                <Bar dataKey="revenueUsd" name="Billed Freight Revenue ($)" fill="#171717" radius={[4, 4, 0, 0]} maxBarSize={22} />
                <Line type="monotone" dataKey="freightCostUsd" name="Liner Operating Cost ($)" stroke="#737373" strokeWidth={2} strokeDasharray="4 4" dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3.5 rounded bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs font-mono">
            <div>
              <span className="text-neutral-400 block text-[10px]">Net Freight Margin (Current Q3)</span>
              <span className="text-sm font-bold text-neutral-900 dark:text-white">$112,000.00 (26.0%)</span>
            </div>
            <div className="text-right">
              <span className="text-neutral-400 block text-[10px]">Carrier Rate Benchmark</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">-4.2% below SCFI index</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
