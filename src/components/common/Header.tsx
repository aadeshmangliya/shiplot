import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Ship,
  Sun,
  Moon,
  Search,
  Building2,
  ChevronDown,
  User,
  Shield,
  Plus,
  AlertTriangle,
  LogOut,
  Layers,
  ShieldCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Header: React.FC = () => {
  const {
    currentCompany,
    setCurrentCompany,
    companies,
    theme,
    toggleTheme,
    currentUser,
    setCurrentUser,
    containers,
    invoices,
    setIsNewBookingOpen,
    searchQuery,
    setSearchQuery,
    logout
  } = useApp();

  const navigate = useNavigate();
  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const workspaceRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (workspaceRef.current && !workspaceRef.current.contains(e.target as Node)) {
        setShowWorkspaceMenu(false);
      }
      if (roleRef.current && !roleRef.current.contains(e.target as Node)) {
        setShowRoleMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const criticalDemurrageCount = containers.filter(c => c.demurrageRisk === 'critical').length;
  const unpaidCount = invoices.filter(i => i.paymentStatus !== 'Paid').length;

  const roleOptions = [
    { id: 'nvocc_admin', label: 'NVOCC Admin (Carrier)', roleCategory: 'Internal' },
    { id: 'freight_forwarder', label: 'Freight Forwarder Desk', roleCategory: 'Internal' },
    { id: 'finance_staff', label: 'Finance & Invoicing', roleCategory: 'Internal' },
    { id: 'exporter', label: 'Exporter / Shipper', roleCategory: 'Client' },
    { id: 'importer', label: 'Importer / Consignee', roleCategory: 'Client' },
    { id: 'agent', label: 'Port CFS Destination Agent', roleCategory: 'Partner' },
    { id: 'platform_admin', label: 'Shiplot SaaS Super Admin', roleCategory: 'System' }
  ];

  const handleRoleSelect = (roleId: string) => {
    setCurrentUser(prev => ({
      ...prev,
      role: roleId as any
    }));
    setShowRoleMenu(false);
    if (roleId === 'platform_admin') {
      navigate('/platform-admin');
    } else if (roleId === 'exporter') {
      navigate('/portal/shipper');
    } else if (roleId === 'importer') {
      navigate('/portal/consignee');
    } else if (roleId === 'agent') {
      navigate('/portal/agent');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200 dark:border-neutral-800 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md transition-colors">
      <div className="flex h-15 items-center justify-between px-4 sm:px-6">
        {/* Left: Brand & Workspace Selector */}
        <div className="flex items-center gap-4">
          <div
            onClick={() => navigate('/')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 flex items-center justify-center font-bold shadow-xs">
              <Ship className="w-4.5 h-4.5" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-bold text-base tracking-tight text-neutral-900 dark:text-white">
                  Shiplot
                </span>
                <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                  NVOCC
                </span>
              </div>
              <span className="text-[10px] text-neutral-500 font-mono">
                {currentCompany.registrationNo}
              </span>
            </div>
          </div>

          <div className="h-5 w-px bg-neutral-200 dark:border-neutral-800 hidden md:block" />

          {/* Workspace Switcher */}
          <div className="relative hidden md:block" ref={workspaceRef}>
            <button
              onClick={() => setShowWorkspaceMenu(!showWorkspaceMenu)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-mono transition-colors text-neutral-700 dark:text-neutral-300"
            >
              <Building2 className="w-3.5 h-3.5 text-neutral-500" />
              <span className="max-w-[160px] truncate font-medium">
                {currentCompany.name.replace(' (NVOCC)', '')}
              </span>
              <ChevronDown className="w-3 h-3 text-neutral-400" />
            </button>

            {showWorkspaceMenu && (
              <div className="absolute left-0 mt-1 w-72 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl py-1 z-50">
                <div className="px-3 py-2 border-b border-neutral-100 dark:border-neutral-800">
                  <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider font-mono">
                    Select NVOCC Carrier Workspace
                  </div>
                </div>
                <div className="max-h-60 overflow-y-auto py-1">
                  {companies.map(c => (
                    <button
                      key={c.id}
                      onClick={() => {
                        setCurrentCompany(c);
                        setShowWorkspaceMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex flex-col gap-0.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors ${
                        c.id === currentCompany.id ? 'bg-neutral-50 dark:bg-neutral-800/60 font-semibold' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-neutral-900 dark:text-white truncate">{c.name}</span>
                        <span className="text-[10px] font-mono px-1 rounded bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300">
                          {c.plan}
                        </span>
                      </div>
                      <span className="text-[10px] text-neutral-400 font-mono">
                        {c.registrationNo} · {c.hqCity}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center: Search input */}
        <div className="hidden lg:flex items-center flex-1 max-w-md mx-6">
          <div className="relative w-full">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search B/L, containers, vessels, bookings, or LOCODE..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-neutral-100 dark:bg-neutral-800 border border-transparent focus:border-neutral-300 dark:focus:border-neutral-700 rounded-lg text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-hidden transition-all"
            />
          </div>
        </div>

        {/* Right: Actions, Alerts, Role Switcher, Theme */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Demurrage Alert Pill */}
          {criticalDemurrageCount > 0 && (
            <button
              onClick={() => navigate('/fcl')}
              title={`${criticalDemurrageCount} container(s) expiring free-time soon`}
              className="flex items-center gap-1 px-2 py-1 rounded bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900 text-xs font-mono font-medium hover:opacity-90"
            >
              <AlertTriangle className="w-3 h-3 text-rose-500 animate-pulse" />
              <span>{criticalDemurrageCount} Demurrage</span>
            </button>
          )}

          {/* Role / Persona Switcher */}
          <div className="relative" ref={roleRef}>
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-mono text-neutral-700 dark:text-neutral-300 transition-colors"
            >
              <Shield className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span className="hidden md:inline font-medium capitalize">
                {currentUser.role.replace('_', ' ')}
              </span>
              <ChevronDown className="w-3 h-3 text-neutral-400" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-1 w-64 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl py-1 z-50">
                <div className="px-3 py-2 border-b border-neutral-100 dark:border-neutral-800">
                  <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider font-mono">
                    Switch Operating Role / Persona
                  </div>
                </div>
                <div className="py-1">
                  {roleOptions.map(r => (
                    <button
                      key={r.id}
                      onClick={() => handleRoleSelect(r.id)}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors ${
                        currentUser.role === r.id ? 'bg-neutral-50 dark:bg-neutral-800/60 font-semibold text-blue-600 dark:text-blue-400' : 'text-neutral-700 dark:text-neutral-300'
                      }`}
                    >
                      <span>{r.label}</span>
                      <span className="text-[10px] font-mono px-1 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-500">
                        {r.roleCategory}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Audit Trail Shortcut */}
          <button
            onClick={() => navigate(currentUser.role === 'platform_admin' ? '/platform-admin/audit' : '/audit-logs')}
            title="Audit Trail & Security Logs"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer text-xs font-mono"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden xl:inline text-[11px] font-semibold">Audit</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer text-xs font-mono"
            aria-label="Toggle theme"
            title={`Current mode: ${theme.toUpperCase()} (Click to switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode)`}
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline text-[11px] font-semibold text-neutral-200">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-neutral-700" />
                <span className="hidden sm:inline text-[11px] font-semibold text-neutral-700">Dark</span>
              </>
            )}
          </button>

          {/* User Sign out */}
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            title="Sign out / Switch account"
            className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
