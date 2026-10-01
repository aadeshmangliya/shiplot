import React, { useState } from 'react';
import { ShipmentItem, ShipmentType, DirectionType } from '../../types/shipping';
import {
  Search,
  Filter,
  Eye,
  FileText,
  Ship,
  ArrowUpRight,
  ArrowDownLeft,
  Container,
  Box,
  CheckCircle2,
  AlertTriangle,
  Clock,
} from 'lucide-react';

interface ShipmentsTableProps {
  shipments: ShipmentItem[];
  onSelectShipment: (shipment: ShipmentItem) => void;
  onOpenBl: (shipment: ShipmentItem) => void;
  onNewShipment: () => void;
  filterMode?: string;
}

export const ShipmentsTable: React.FC<ShipmentsTableProps> = ({
  shipments,
  onSelectShipment,
  onOpenBl,
  onNewShipment,
  filterMode = 'all',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'All' | ShipmentType>('All');
  const [directionFilter, setDirectionFilter] = useState<'All' | DirectionType>('All');

  const filtered = shipments.filter((shp) => {
    if (filterMode === 'FCL' && shp.type !== 'FCL') return false;
    if (filterMode === 'LCL' && shp.type !== 'LCL') return false;
    if (filterMode === 'customs' && shp.status !== 'Customs Hold') return false;

    if (typeFilter !== 'All' && shp.type !== typeFilter) return false;
    if (directionFilter !== 'All' && shp.direction !== directionFilter) return false;

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchNo = shp.shipmentNo.toLowerCase().includes(q);
      const matchBkg = shp.bookingNo.toLowerCase().includes(q);
      const matchShipper = shp.shipper.toLowerCase().includes(q);
      const matchConsignee = shp.consignee.toLowerCase().includes(q);
      const matchVessel = shp.vesselName.toLowerCase().includes(q);
      const matchPol = shp.pol.toLowerCase().includes(q) || shp.polCode.toLowerCase().includes(q);
      const matchPod = shp.pod.toLowerCase().includes(q) || shp.podCode.toLowerCase().includes(q);
      if (!matchNo && !matchBkg && !matchShipper && !matchConsignee && !matchVessel && !matchPol && !matchPod) {
        return false;
      }
    }
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'In Transit':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border-blue-200 dark:border-blue-800';
      case 'Customs Hold':
        return 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border-rose-200 dark:border-rose-800';
      case 'Loaded':
        return 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400 border-purple-200 dark:border-purple-800';
      case 'Discharged':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200 dark:border-amber-800';
      case 'Booking Confirmed':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
      default:
        return 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 border-neutral-200';
    }
  };

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-5 shadow-xs space-y-4">
      {/* Table Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-100 dark:border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200">
              OPERATIONS MANIFEST
            </span>
            <span className="text-xs text-neutral-400">· Real-Time Shipment & B/L Register</span>
          </div>
          <h2 className="text-base font-bold text-neutral-900 dark:text-white tracking-tight mt-1">
            Active Ocean Freight Consignments
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onNewShipment}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:opacity-90 shadow-xs"
          >
            <span>+ New Consignment</span>
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="relative flex-1 min-w-[240px] max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
          <input
            type="text"
            placeholder="Search reference, shipper, consignee, vessel..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded text-neutral-900 dark:text-white focus:outline-none font-mono"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <div className="flex items-center gap-1 p-0.5 bg-neutral-100 dark:bg-neutral-800 rounded">
            {(['All', 'FCL', 'LCL'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setTypeFilter(m)}
                className={`px-2.5 py-1 rounded transition-colors ${
                  typeFilter === m
                    ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs font-semibold'
                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 p-0.5 bg-neutral-100 dark:bg-neutral-800 rounded">
            {(['All', 'Export', 'Import'] as const).map((d) => (
              <button
                key={d}
                onClick={() => setDirectionFilter(d)}
                className={`px-2.5 py-1 rounded transition-colors ${
                  directionFilter === d
                    ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs font-semibold'
                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-neutral-50 dark:bg-neutral-800/60 text-neutral-500 border-b border-neutral-200 dark:border-neutral-800 font-mono text-xs uppercase">
            <tr>
              <th className="py-3 px-3.5 font-semibold">Shipment Ref / Bkg</th>
              <th className="py-3 px-3.5 font-semibold">Mode</th>
              <th className="py-3 px-3.5 font-semibold">Shipper & Consignee</th>
              <th className="py-3 px-3.5 font-semibold">Routing (POL → POD)</th>
              <th className="py-3 px-3.5 font-semibold">Liner & Vessel</th>
              <th className="py-3 px-3.5 font-semibold">ETA / ETD</th>
              <th className="py-3 px-3.5 font-semibold">Status</th>
              <th className="py-3 px-3.5 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 font-mono text-xs">
            {filtered.map((shp) => (
              <tr
                key={shp.id}
                className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors"
              >
                <td className="py-3 px-3.5">
                  <div
                    onClick={() => onSelectShipment(shp)}
                    className="font-bold text-sm text-neutral-900 dark:text-white hover:underline cursor-pointer flex items-center gap-1.5"
                  >
                    <span>{shp.shipmentNo}</span>
                  </div>
                  <div className="text-xs text-neutral-400 mt-0.5">
                    Bkg: {shp.bookingNo}
                  </div>
                </td>

                <td className="py-3 px-3.5">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 font-bold text-xs text-neutral-800 dark:text-neutral-200">
                      {shp.type}
                    </span>
                    <span className="text-xs text-neutral-500">
                      {shp.direction}
                    </span>
                  </div>
                  <div className="text-xs text-neutral-400 mt-0.5">
                    {shp.type === 'FCL'
                      ? `${shp.containersCount} Box(es)`
                      : `${shp.cbmVolume || 0} CBM`}
                  </div>
                </td>

                <td className="py-3 px-3.5">
                  <div className="font-sans font-semibold text-sm text-neutral-900 dark:text-white truncate max-w-[180px]">
                    {shp.shipper}
                  </div>
                  <div className="font-sans text-xs text-neutral-400 truncate max-w-[180px] mt-0.5">
                    To: {shp.consignee}
                  </div>
                </td>

                <td className="py-3 px-3.5">
                  <div className="font-bold text-sm text-neutral-800 dark:text-neutral-200">
                    {shp.polCode} → {shp.podCode}
                  </div>
                  <div className="text-xs text-neutral-400 truncate max-w-[160px] mt-0.5">
                    {shp.pol.split('(')[0]}
                  </div>
                </td>

                <td className="py-3 px-3">
                  <div className="font-sans font-medium text-neutral-900 dark:text-white">
                    {shp.vesselName}
                  </div>
                  <div className="text-[11px] text-neutral-400">
                    {shp.voyageNo} · {shp.carrier.split(' ')[0]}
                  </div>
                </td>

                <td className="py-3 px-3">
                  <div className="text-neutral-800 dark:text-neutral-200">
                    ETA: {shp.eta}
                  </div>
                  <div className="text-[10px] text-neutral-400">
                    ETD: {shp.etd}
                  </div>
                </td>

                <td className="py-3 px-3">
                  <span
                    className={`inline-block px-2 py-0.5 rounded border text-[10px] font-mono ${getStatusBadge(
                      shp.status
                    )}`}
                  >
                    {shp.status}
                  </span>
                </td>

                <td className="py-3 px-3 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => onSelectShipment(shp)}
                      title="Inspect Shipment Lifecycle"
                      className="p-1 rounded text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onOpenBl(shp)}
                      title="Generate Ocean Bill of Lading"
                      className="p-1 rounded text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    >
                      <FileText className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
