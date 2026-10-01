import React from 'react';
import {
  Boxes,
  Container,
  Package,
  CalendarCheck,
  Ship,
  Clock,
  AlertTriangle,
  FileCheck,
  DollarSign,
  TrendingUp,
} from 'lucide-react';
import { ShipmentItem, ContainerItem, BookingItem, InvoiceItem } from '../../types/shipping';

interface KPISummaryProps {
  shipments: ShipmentItem[];
  containers: ContainerItem[];
  bookings: BookingItem[];
  invoices: InvoiceItem[];
  onFilterShipments?: (filter: string) => void;
}

export const KPISummary: React.FC<KPISummaryProps> = ({
  shipments,
  containers,
  bookings,
  invoices,
  onFilterShipments,
}) => {
  const totalShipments = shipments.length;
  const fclCount = shipments.filter((s) => s.type === 'FCL').length;
  const lclCount = shipments.filter((s) => s.type === 'LCL').length;
  const pendingBookings = bookings.filter((b) => b.status === 'Pending Review').length;
  const inTransitContainers = containers.filter((c) => c.status === 'In Transit').length;
  const criticalDemurrage = containers.filter((c) => c.demurrageRisk === 'critical').length;
  const customsHold = shipments.filter((s) => s.status === 'Customs Hold').length;
  const outstandingInvoices = invoices.filter((i) => i.paymentStatus !== 'Paid').length;
  const totalOutstandingAmount = invoices
    .filter((i) => i.paymentStatus !== 'Paid')
    .reduce((sum, i) => sum + i.total, 0);

  const kpis = [
    {
      label: 'Active Shipments',
      value: totalShipments,
      subtext: `${fclCount} FCL · ${lclCount} LCL active`,
      icon: <Boxes className="w-4 h-4 text-neutral-500" />,
      change: '+14% vs last mo',
      filter: 'all',
    },
    {
      label: 'FCL Full Containers',
      value: fclCount,
      subtext: '40HC / 20GP boxes',
      icon: <Container className="w-4 h-4 text-neutral-500" />,
      change: '1,420 TEU total',
      filter: 'FCL',
    },
    {
      label: 'LCL Consolidations',
      value: lclCount,
      subtext: 'Groupage CFS boxes',
      icon: <Package className="w-4 h-4 text-neutral-500" />,
      change: '19.8 CBM booked',
      filter: 'LCL',
    },
    {
      label: 'Pending Bookings',
      value: pendingBookings,
      subtext: 'Awaiting rate confirmation',
      icon: <CalendarCheck className="w-4 h-4 text-neutral-500" />,
      change: '2 need review',
      filter: 'pending',
    },
    {
      label: 'Demurrage Alerts',
      value: criticalDemurrage,
      subtext: 'Boxes expiring < 48 hrs',
      icon: <AlertTriangle className="w-4 h-4 text-rose-500" />,
      alert: true,
      filter: 'demurrage',
    },
    {
      label: 'Customs Exceptions',
      value: customsHold,
      subtext: 'Inspection / exam hold',
      icon: <Clock className="w-4 h-4 text-amber-500" />,
      warning: true,
      filter: 'customs',
    },
    {
      label: 'Unpaid Receivables',
      value: `$${(totalOutstandingAmount / 1000).toFixed(1)}k`,
      subtext: `${outstandingInvoices} outstanding invoices`,
      icon: <DollarSign className="w-4 h-4 text-neutral-500" />,
      filter: 'invoices',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
      {kpis.map((kpi, idx) => (
        <div
          key={idx}
          onClick={() => onFilterShipments && onFilterShipments(kpi.filter)}
          className={`p-3.5 rounded-xl border bg-white dark:bg-neutral-900 transition-all cursor-pointer hover:border-neutral-400 dark:hover:border-neutral-600 shadow-2xs ${
            kpi.alert
              ? 'border-rose-300 dark:border-rose-900/60 bg-rose-50/20'
              : kpi.warning
              ? 'border-amber-300 dark:border-amber-900/60 bg-amber-50/20'
              : 'border-neutral-200 dark:border-neutral-800'
          }`}
        >
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400">
            <span className="text-xs font-semibold truncate">{kpi.label}</span>
            {kpi.icon}
          </div>

          <div className="mt-2 flex items-baseline gap-2">
            <span
              className={`text-2xl font-bold tracking-tight ${
                kpi.alert
                  ? 'text-rose-600 dark:text-rose-400'
                  : kpi.warning
                  ? 'text-amber-600 dark:text-amber-400'
                  : 'text-neutral-900 dark:text-white'
              }`}
            >
              {kpi.value}
            </span>
          </div>

          <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 truncate">
            {kpi.subtext}
          </div>
        </div>
      ))}
    </div>
  );
};
