import React, { useState } from 'react';
import { ShipmentItem, BookingItem, InvoiceItem, ConsolidationItem } from '../../types/shipping';
import {
  Package,
  FileText,
  UserCheck,
  Building,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  Plus,
  Search,
  Container,
  Ship,
  Eye,
  Send,
} from 'lucide-react';

interface ForwarderPortalViewProps {
  shipments: ShipmentItem[];
  bookings: BookingItem[];
  invoices: InvoiceItem[];
  consolidations: ConsolidationItem[];
  onOpenNewBooking: () => void;
  onSelectShipment: (shp: ShipmentItem) => void;
  onOpenBl: (shp: ShipmentItem) => void;
}

export const ForwarderPortalView: React.FC<ForwarderPortalViewProps> = ({
  shipments,
  bookings,
  invoices,
  consolidations,
  onOpenNewBooking,
  onSelectShipment,
  onOpenBl,
}) => {
  const [activeTab, setActiveTab] = useState<'client_bookings' | 'hbl_desk' | 'cfs_drops' | 'customs_status'>('client_bookings');
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      {/* Forwarder Workspace Banner */}
      <div className="p-5 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">
              FREIGHT FORWARDER PORTAL
            </span>
            <span className="text-xs text-neutral-400 font-mono">
              Operating under NVOCC FMC License
            </span>
          </div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white mt-1">
            Freight Forwarding Desk & Client Service Console
          </h2>
          <p className="text-xs text-neutral-500 font-sans mt-0.5">
            Book shipper cargo, issue House B/Ls, coordinate CFS groupage deliveries with the NVOCC, and monitor customs releases.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenNewBooking}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 rounded text-xs font-mono font-bold hover:opacity-90 transition-opacity shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ New Client Booking</span>
          </button>
        </div>
      </div>

      {/* KPI Cards for Forwarder */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
        <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xs">
          <span className="text-neutral-500 dark:text-neutral-400 text-xs font-medium block">Forwarded Consignments</span>
          <span className="text-2xl font-bold text-neutral-900 dark:text-white mt-1 block">
            {shipments.length} Active
          </span>
          <span className="text-xs text-neutral-500">Across 6 shippers</span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xs">
          <span className="text-neutral-500 dark:text-neutral-400 text-xs font-medium block">House B/L (HBL) Issued</span>
          <span className="text-2xl font-bold text-neutral-900 dark:text-white mt-1 block">
            18 Sets
          </span>
          <span className="text-xs text-emerald-600 dark:text-emerald-400">100% Telex cleared</span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xs">
          <span className="text-neutral-500 dark:text-neutral-400 text-xs font-medium block">CFS Groupage Drop-offs</span>
          <span className="text-2xl font-bold text-neutral-900 dark:text-white mt-1 block">
            {consolidations.length} Active
          </span>
          <span className="text-xs text-blue-500">Stuffing on schedule</span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xs">
          <span className="text-neutral-500 dark:text-neutral-400 text-xs font-medium block">Customs Clearance Holds</span>
          <span className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1 block">
            1 Inspection Hold
          </span>
          <span className="text-xs text-amber-500">SHP-2026-8804 (USLAX)</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-1.5 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-sm">
            <button
              onClick={() => setActiveTab('client_bookings')}
              className={`px-3.5 py-2 rounded-md transition-colors text-sm ${
                activeTab === 'client_bookings'
                  ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs font-bold'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              Client Cargo Bookings ({bookings.length})
            </button>

            <button
              onClick={() => setActiveTab('hbl_desk')}
              className={`px-3.5 py-2 rounded-md transition-colors text-sm ${
                activeTab === 'hbl_desk'
                  ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs font-bold'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              House B/L Generation Desk
            </button>

            <button
              onClick={() => setActiveTab('cfs_drops')}
              className={`px-3.5 py-2 rounded-md transition-colors text-sm ${
                activeTab === 'cfs_drops'
                  ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs font-bold'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              LCL CFS Packing Depots
            </button>

            <button
              onClick={() => setActiveTab('customs_status')}
              className={`px-3 py-1.5 rounded transition-colors ${
                activeTab === 'customs_status'
                  ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs font-bold'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              Customs Filing & Releases
            </button>
          </div>
        </div>

        {/* TAB 1: CLIENT BOOKINGS */}
        {activeTab === 'client_bookings' && (
          <div className="space-y-3">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-neutral-50 dark:bg-neutral-800/60 text-neutral-500 border-b border-neutral-200 dark:border-neutral-800">
                  <tr>
                    <th className="py-2.5 px-3">Booking Reference</th>
                    <th className="py-2.5 px-3">Shipper / Exporter</th>
                    <th className="py-2.5 px-3">Consignee</th>
                    <th className="py-2.5 px-3">Trade Route</th>
                    <th className="py-2.5 px-3">Mode & Cargo</th>
                    <th className="py-2.5 px-3">Forwarding Status</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                  {bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40">
                      <td className="py-3 px-3">
                        <div className="font-bold text-neutral-900 dark:text-white">{b.bookingNo}</div>
                        <div className="text-[10px] text-neutral-400">{b.requestDate}</div>
                      </td>

                      <td className="py-3 px-3 font-sans">
                        <div className="font-semibold text-neutral-900 dark:text-white">{b.shipper}</div>
                      </td>

                      <td className="py-3 px-3 font-sans">
                        <div className="text-neutral-700 dark:text-neutral-300">{b.consignee}</div>
                      </td>

                      <td className="py-3 px-3">
                        <div>{b.pol.split('(')[1]?.replace(')', '') || b.pol} → {b.pod.split('(')[1]?.replace(')', '') || b.pod}</div>
                        <div className="text-[10px] text-neutral-400">Carrier: {b.carrier}</div>
                      </td>

                      <td className="py-3 px-3">
                        <span className="font-bold">{b.type === 'FCL' ? `${b.containerQty}x ${b.containerType}` : `${b.cbm} CBM`}</span>
                        <div className="text-[10px] text-neutral-400 truncate max-w-[150px] font-sans">{b.cargoDesc}</div>
                      </td>

                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] border font-bold ${
                            b.status === 'Approved'
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 border-emerald-200'
                              : 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400 border-amber-200'
                          }`}
                        >
                          {b.status}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => {
                            const matched = shipments.find((s) => s.bookingNo === b.bookingNo) || shipments[0];
                            onOpenBl(matched);
                          }}
                          className="px-2.5 py-1 rounded bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-[11px] font-sans font-medium hover:opacity-90"
                        >
                          Draft HBL
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: HBL DESK */}
        {activeTab === 'hbl_desk' && (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
              <div>
                <span className="font-bold text-neutral-900 dark:text-white block">
                  House Bill of Lading (HBL) FMC Authorized Template
                </span>
                <span className="text-[11px] text-neutral-500 font-sans">
                  Issued by Freight Forwarder as contractual carrier to exporter, backed by NVOCC Master Ocean B/L.
                </span>
              </div>
              <button
                onClick={() => onOpenBl(shipments[0])}
                className="px-4 py-2 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 rounded font-bold whitespace-nowrap hover:opacity-90"
              >
                Launch Document Generator
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
              {shipments.map((shp) => (
                <div
                  key={shp.id}
                  className="p-3.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-2.5"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-neutral-900 dark:text-white">
                      HBL-PCF-{shp.shipmentNo.replace('SHP-', '')}
                    </span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-neutral-100 dark:bg-neutral-800">
                      {shp.type}
                    </span>
                  </div>

                  <div className="text-[11px] text-neutral-500 font-sans">
                    <div>Shipper: <strong>{shp.shipper}</strong></div>
                    <div>To: <strong>{shp.consignee}</strong></div>
                  </div>

                  <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex justify-between items-center">
                    <span className="text-[10px] text-neutral-400">
                      Vessel: {shp.vesselName}
                    </span>
                    <button
                      onClick={() => onOpenBl(shp)}
                      className="text-xs text-neutral-900 dark:text-white font-bold hover:underline"
                    >
                      View / Print B/L →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: CFS DROPS */}
        {activeTab === 'cfs_drops' && (
          <div className="space-y-3">
            <div className="text-xs font-mono text-neutral-500">
              Deliveries dropped at Container Freight Station (CFS) for NVOCC Box Stuffing
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              {consolidations.map((csl) => (
                <div
                  key={csl.id}
                  className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-800/40 space-y-2.5"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm text-neutral-900 dark:text-white">
                      {csl.consolNo}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-[10px]">
                      {csl.status}
                    </span>
                  </div>

                  <div className="text-[11px] text-neutral-500 font-sans">
                    Drop-off CFS: <strong>{csl.cfsOrigin}</strong>
                  </div>

                  <div className="text-[11px] text-neutral-600 dark:text-neutral-300">
                    Routing: {csl.pol} → {csl.pod}
                  </div>

                  <div className="p-2.5 rounded bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex justify-between items-center text-[11px]">
                    <span>CFS Cargo Cut-Off</span>
                    <strong className="text-rose-600 dark:text-rose-400">{csl.cutOffDate}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: CUSTOMS FILING */}
        {activeTab === 'customs_status' && (
          <div className="space-y-3">
            <div className="p-3 rounded bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs font-mono text-amber-800 dark:text-amber-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>
                Attention Forwarding Desk: Shipment <strong>SHP-2026-8804</strong> has an active Customs Exam Hold at Port of Los Angeles.
              </span>
            </div>

            <div className="border border-neutral-200 dark:border-neutral-800 rounded divide-y divide-neutral-100 dark:divide-neutral-800 text-xs font-mono">
              <div className="p-3 flex items-center justify-between">
                <div>
                  <div className="font-bold text-neutral-900 dark:text-white">SHP-2026-8804 · BKG-7650</div>
                  <div className="text-[11px] text-neutral-400">California Clean Energy Systems · Entry 7501 Filed</div>
                </div>
                <div className="text-right">
                  <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-400 text-[10px] font-bold">
                    CBP VACIS EXAM HOLD
                  </span>
                  <div className="text-[10px] text-neutral-400 mt-0.5">ETA: 2026-09-28</div>
                </div>
              </div>

              <div className="p-3 flex items-center justify-between">
                <div>
                  <div className="font-bold text-neutral-900 dark:text-white">SHP-2026-8821 · BKG-7712</div>
                  <div className="text-[11px] text-neutral-400">Pacific Precision Electronics · China CIQ Cleared</div>
                </div>
                <div className="text-right">
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400 text-[10px] font-bold">
                    CLEARED FOR DELIVERY
                  </span>
                  <div className="text-[10px] text-neutral-400 mt-0.5">D/O Released</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
