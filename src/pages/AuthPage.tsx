import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import {
  Ship,
  Sun,
  Moon,
  ArrowRight,
  Shield,
  Building2,
  Lock,
  Mail,
  CheckCircle2
} from 'lucide-react';

export const AuthPage: React.FC = () => {
  const { login, theme, toggleTheme, companies } = useApp();
  const navigate = useNavigate();

  const [email, setEmail] = useState('ops.director@pacificcrest.com');
  const [password, setPassword] = useState('••••••••••••');
  const [workspaceId, setWorkspaceId] = useState('COMP-001');
  const [role, setRole] = useState<'nvocc_admin' | 'freight_forwarder' | 'finance_staff' | 'exporter' | 'importer' | 'agent' | 'platform_admin'>('nvocc_admin');

  const demoPersonas = [
    {
      role: 'nvocc_admin',
      label: 'NVOCC Carrier Admin',
      badge: 'CARRIER',
      name: 'Capt. Ethan Roberts',
      email: 'ops.director@pacificcrest.com',
      workspaceId: 'COMP-001',
      desc: 'Full NVOCC operating authority: B/L issuance, container demurrage, ocean routing'
    },
    {
      role: 'freight_forwarder',
      label: 'Freight Forwarder Desk',
      badge: 'FORWARDER',
      name: 'Elena Rostova',
      email: 'operations@pacificcrest.com',
      workspaceId: 'COMP-001',
      desc: 'Client booking coordination, HBL generation, terminal slotting'
    },
    {
      role: 'finance_staff',
      label: 'Finance & Invoicing',
      badge: 'FINANCE',
      name: 'Marcus Chen',
      email: 'finance@pacificcrest.com',
      workspaceId: 'COMP-001',
      desc: 'Freight receivables ledger, demurrage tariff billing, cash collections'
    },
    {
      role: 'exporter',
      label: 'Exporter / Shipper',
      badge: 'SHIPPER',
      name: 'David Vance (Pacific Precision)',
      email: 'export-ops@pacificprecision.com',
      workspaceId: 'COMP-001',
      desc: 'External exporter portal: create bookings, packing lists, track departure'
    },
    {
      role: 'importer',
      label: 'Importer / Consignee',
      badge: 'CONSIGNEE',
      name: 'Rachel Sterling (CA Clean Energy)',
      email: 'logistics@cleanenergysys.com',
      workspaceId: 'COMP-001',
      desc: 'Inbound cargo tracker, customs exam alerts, delivery orders'
    },
    {
      role: 'platform_admin',
      label: 'Shiplot SaaS Super Admin',
      badge: 'SAAS ROOT',
      name: 'System Root Administrator',
      email: 'root@shiplot.io',
      workspaceId: 'COMP-001',
      desc: 'Multi-tenant provisioning plane, subscription MRR, security audit log'
    }
  ];

  const handleSelectPersona = (p: typeof demoPersonas[0]) => {
    setEmail(p.email);
    setRole(p.role as any);
    setWorkspaceId(p.workspaceId);
    login({
      name: p.name,
      email: p.email,
      role: p.role as any,
      workspaceId: p.workspaceId
    });
    if (p.role === 'platform_admin') {
      navigate('/platform-admin');
    } else if (p.role === 'exporter') {
      navigate('/portal/shipper');
    } else if (p.role === 'importer') {
      navigate('/portal/consignee');
    } else {
      navigate('/');
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({
      name: 'Capt. Ethan Roberts',
      email,
      role,
      workspaceId
    });
    if (role === 'platform_admin') {
      navigate('/platform-admin');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-100 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 font-sans transition-colors">
      {/* Top Navbar */}
      <nav className="border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 flex items-center justify-center font-bold shadow-xs">
            <Ship className="w-4.5 h-4.5" />
          </div>
          <div>
            <span className="font-bold text-base tracking-tight">Shiplot</span>
            <span className="text-[10px] text-neutral-400 font-mono ml-2">FMC Multi-Tenant OS</span>
          </div>
        </div>

        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-neutral-700" />}
        </button>
      </nav>

      {/* Main Container */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 max-w-5xl mx-auto w-full">
        <div className="text-center max-w-xl mb-8 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-300 text-xs font-mono font-medium">
            <span>FMC Ocean Transport Intermediary Cloud</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
            Sign in to Shiplot Workspace
          </h1>
          <p className="text-sm text-neutral-500 font-sans">
            Choose a quick demo persona or log in to your licensed carrier workspace
          </p>
        </div>

        {/* Quick Demo Personas Grid */}
        <div className="w-full mb-8">
          <div className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-wider mb-3 text-center sm:text-left">
            1-Click Demo Persona Access
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {demoPersonas.map((p, idx) => (
              <div
                key={idx}
                onClick={() => handleSelectPersona(p)}
                className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs hover:border-neutral-400 dark:hover:border-neutral-600 hover:scale-[1.01] transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-xs font-mono text-neutral-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      {p.label}
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 font-bold">
                      {p.badge}
                    </span>
                  </div>
                  <div className="text-xs font-medium text-neutral-800 dark:text-neutral-200">
                    {p.name}
                  </div>
                  <div className="text-[11px] text-neutral-400 font-mono truncate">
                    {p.email}
                  </div>
                  <p className="text-[11px] text-neutral-500 font-sans mt-2 leading-relaxed">
                    {p.desc}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-neutral-100 dark:border-neutral-800/60 flex items-center justify-between text-xs text-blue-600 dark:text-blue-400 font-medium">
                  <span>Sign in as {p.badge}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Manual Credentials Box */}
        <div className="w-full max-w-md p-6 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4">
          <div className="font-bold text-sm text-neutral-900 dark:text-white font-mono">
            Standard Login Form
          </div>

          <form onSubmit={handleManualSubmit} className="space-y-3 text-xs font-mono">
            <div>
              <label className="block text-neutral-600 dark:text-neutral-400 mb-1">Carrier Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-neutral-600 dark:text-neutral-400 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-950 font-bold rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              Sign In to Shiplot OS
            </button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 py-3 px-6 text-xs text-neutral-400 font-mono text-center">
        © 2026 Shiplot Logistics Technologies Inc. · High Availability Multi-Tenant FMC Cloud
      </footer>
    </div>
  );
};
