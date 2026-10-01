import React from 'react';
import { ContainerItem } from '../../types/shipping';
import {
  Container,
  Clock,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

interface ContainerDemurrageProps {
  containers: ContainerItem[];
  onSelectContainer?: (container: ContainerItem) => void;
}

export const ContainerDemurrage: React.FC<ContainerDemurrageProps> = ({
  containers,
  onSelectContainer,
}) => {
  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200">
              EQUIPMENT INVENTORY
            </span>
            <span className="text-xs text-neutral-400">· Demurrage & Detention Free Time Guard</span>
          </div>
          <h2 className="text-base font-bold text-neutral-900 dark:text-white tracking-tight mt-1">
            Active Container Tracking & Free Time Monitor
          </h2>
        </div>

        <span className="text-xs font-mono text-neutral-500">
          {containers.length} Tracked Boxes
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-neutral-50 dark:bg-neutral-800/60 text-neutral-500 border-b border-neutral-200 dark:border-neutral-800 font-mono">
            <tr>
              <th className="py-2.5 px-3 font-semibold">Container No. / Seal</th>
              <th className="py-2.5 px-3 font-semibold">Equipment Type</th>
              <th className="py-2.5 px-3 font-semibold">Vessel / Voyage</th>
              <th className="py-2.5 px-3 font-semibold">Route (POL → POD)</th>
              <th className="py-2.5 px-3 font-semibold">Certified VGM</th>
              <th className="py-2.5 px-3 font-semibold">Demurrage Free Time</th>
              <th className="py-2.5 px-3 font-semibold">Lifecycle Status</th>
              <th className="py-2.5 px-3 text-right font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/80 font-mono">
            {containers.map((c) => {
              const isCritical = c.demurrageRisk === 'critical';
              const isWarning = c.demurrageRisk === 'warning';

              return (
                <tr
                  key={c.id}
                  onClick={() => onSelectContainer && onSelectContainer(c)}
                  className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 cursor-pointer transition-colors"
                >
                  <td className="py-3 px-3">
                    <div className="font-bold text-neutral-900 dark:text-white">
                      {c.containerNo}
                    </div>
                    <div className="text-[11px] text-neutral-400">
                      Seal: {c.sealNo}
                    </div>
                  </td>

                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 font-bold text-[11px] text-neutral-800 dark:text-neutral-200">
                      {c.type}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-neutral-800 dark:text-neutral-200">
                    <div className="font-sans font-medium">{c.vesselName}</div>
                    <div className="text-[11px] text-neutral-400">{c.voyage}</div>
                  </td>

                  <td className="py-3 px-3 text-neutral-600 dark:text-neutral-400 text-[11px]">
                    {c.pol.split('(')[1]?.replace(')', '') || c.pol} → {c.pod.split('(')[1]?.replace(')', '') || c.pod}
                  </td>

                  <td className="py-3 px-3 tabular-nums font-bold text-neutral-900 dark:text-white">
                    {c.vgmKg.toLocaleString()} kg
                  </td>

                  <td className="py-3 px-3 tabular-nums">
                    <div className="flex items-center gap-1.5">
                      {isCritical ? (
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      ) : isWarning ? (
                        <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      )}
                      <span
                        className={`font-semibold ${
                          isCritical
                            ? 'text-rose-600 dark:text-rose-400'
                            : isWarning
                            ? 'text-amber-600 dark:text-amber-400'
                            : 'text-neutral-800 dark:text-neutral-200'
                        }`}
                      >
                        {c.daysRemaining} days remaining
                      </span>
                    </div>
                    <div className="text-[10px] text-neutral-400">
                      ({c.demurrageFreeDays} free days total)
                    </div>
                  </td>

                  <td className="py-3 px-3">
                    <span className="text-[11px] px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                      {c.status}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-right">
                    <span className="text-xs font-sans font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-900">
                      Details
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
