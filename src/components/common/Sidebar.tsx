import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Ship,
  Box,
  Boxes,
  CalendarCheck,
  FileText,
  Files,
  Compass,
  ShieldAlert,
  Anchor,
  Navigation,
  DollarSign,
  Users2,
  BarChart3,
  Lock,
  Settings,
  Server,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Sun,
  Moon,
  Warehouse,
  Ticket
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { currentCompany, containers, bookings, invoices, theme, toggleTheme } = useApp();

  const criticalDemurrage = containers.filter(c => c.demurrageRisk === 'critical').length;
  const pendingBookings = bookings.filter(b => b.status === 'Pending Review').length;
  const unpaidInvoices = invoices.filter(i => i.paymentStatus !== 'Paid').length;

  const navSections = [
    {
      title: 'OPERATIONS',
      items: [
        { to: '/', label: 'Overview & KPIs', icon: LayoutDashboard },
        { to: '/shipments', label: 'Shipments & B/L', icon: Ship },
        { to: '/containers', label: 'Containers Fleet', icon: Box },
        { to: '/gatepass', label: 'Gate Pass (EIR)', icon: Ticket },
        { to: '/warehouses', label: 'Warehouse & Storage', icon: Warehouse },
        { to: '/fcl', label: 'FCL Demurrage', icon: Box, badge: criticalDemurrage > 0 ? `${criticalDemurrage} alert` : undefined, badgeColor: 'bg-rose-500' },
        { to: '/lcl', label: 'LCL Groupage / CFS', icon: Boxes },
        { to: '/bookings', label: 'Booking Requests', icon: CalendarCheck, badge: pendingBookings > 0 ? pendingBookings : undefined, badgeColor: 'bg-amber-500' },
        { to: '/bill-of-lading', label: 'Ocean B/L Generator', icon: FileText },
        { to: '/documents', label: 'Shipping Documents', icon: Files }
      ]
    },
    {
      title: 'TELEMETRY & PORTS',
      items: [
        { to: '/tracking', label: 'AIS Live Vessel Track', icon: Compass },
        { to: '/vessels', label: 'Fleet Telemetry', icon: Navigation },
        { to: '/customs', label: 'Customs & CBP Holds', icon: ShieldAlert },
        { to: '/ports', label: 'Ports & Terminals', icon: Anchor }
      ]
    },
    {
      title: 'COMMERCIAL & SETTINGS',
      items: [
        { to: '/finance', label: 'Finance & Invoicing', icon: DollarSign, badge: unpaidInvoices > 0 ? unpaidInvoices : undefined, badgeColor: 'bg-blue-500' },
        { to: '/partners', label: 'Trade Partners', icon: Users2 },
        { to: '/reports', label: 'Throughput Analytics', icon: BarChart3 },
        { to: '/users', label: 'RBAC & Permissions', icon: Lock },
        { to: '/settings', label: 'NVOCC Carrier Settings', icon: Settings }
      ]
    },
    {
      title: 'PORTALS & PLATFORM',
      items: [
        { to: '/platform-admin', label: 'SaaS Platform Admin', icon: Server, badge: 'ROOT', badgeColor: 'bg-purple-600' },
        { to: '/portal/shipper', label: 'Shipper Portal', icon: ExternalLink },
        { to: '/portal/consignee', label: 'Consignee Portal', icon: ExternalLink },
        { to: '/portal/agent', label: 'CFS Agent Portal', icon: ExternalLink }
      ]
    }
  ];

  return (
    <aside
      className={`relative border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 transition-all duration-200 flex flex-col shrink-0 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Collapse Toggle Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-5 z-20 w-6 h-6 rounded-full border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 flex items-center justify-center text-neutral-500 hover:text-neutral-900 dark:hover:text-white shadow-xs"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>

      {/* Navigation items list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-5">
        {navSections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            {!collapsed && (
              <div className="px-2 pb-1 text-[10px] font-mono font-bold tracking-wider text-neutral-400 uppercase">
                {section.title}
              </div>
            )}
            {section.items.map(item => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-semibold shadow-xs'
                        : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
                    } ${collapsed ? 'justify-center' : ''}`
                  }
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {!collapsed && (
                    <span className="truncate flex-1">{item.label}</span>
                  )}
                  {!collapsed && item.badge && (
                    <span
                      className={`text-[9px] font-mono font-bold text-white px-1.5 py-0.2 rounded ${
                        item.badgeColor || 'bg-neutral-600'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>
        ))}
      </div>

      {/* Tenant Footer Info */}
      {!collapsed ? (
        <div className="p-3 border-t border-neutral-200 dark:border-neutral-800 text-[11px] font-mono bg-neutral-50 dark:bg-neutral-950/40 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-neutral-400">Plan:</span>
            <span className="font-semibold text-neutral-800 dark:text-neutral-200">
              {currentCompany.plan}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-neutral-400">FMC License:</span>
            <span className="text-neutral-600 dark:text-neutral-400 truncate max-w-[120px]">
              {currentCompany.registrationNo}
            </span>
          </div>
          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-[11px]"
          >
            <span className="text-neutral-500">Theme:</span>
            <span className="flex items-center gap-1.5 font-bold">
              {theme === 'dark' ? (
                <>
                  <Moon className="w-3.5 h-3.5 text-blue-400" />
                  <span>Dark</span>
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span>Light</span>
                </>
              )}
            </span>
          </button>
        </div>
      ) : (
        <div className="p-2 border-t border-neutral-200 dark:border-neutral-800 flex justify-center">
          <button
            onClick={toggleTheme}
            title={`Toggle Theme (Current: ${theme})`}
            className="p-2 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            {theme === 'dark' ? <Moon className="w-4 h-4 text-blue-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
          </button>
        </div>
      )}
    </aside>
  );
};
