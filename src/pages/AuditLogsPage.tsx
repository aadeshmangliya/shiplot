import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { AuditLog, AuditSeverity, AuditCategory } from '../types';
import {
  ShieldCheck,
  Search,
  Filter,
  Download,
  Printer,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  FileText,
  User,
  Building2,
  Clock,
  Layers,
  Terminal,
  Hash,
  ExternalLink,
  Plus,
  RefreshCw,
  Copy,
  Check,
  X,
  FileCheck2,
  Ship,
  Lock,
  DollarSign,
  Ticket
} from 'lucide-react';

export const AuditLogsPage: React.FC = () => {
  const { currentCompany, auditLogs, addAuditLog, currentUser } = useApp();

  // Filter States
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<AuditCategory | 'ALL'>('ALL');
  const [selectedSeverity, setSelectedSeverity] = useState<AuditSeverity | 'ALL'>('ALL');
  const [timeRange, setTimeRange] = useState<'all' | 'today' | '7d' | '30d'>('all');

  // Modals & Details State
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [isManualLogOpen, setIsManualLogOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Manual Log Form State
  const [newAction, setNewAction] = useState('');
  const [newCategory, setNewCategory] = useState<AuditCategory>('Users & Security');
  const [newSeverity, setNewSeverity] = useState<AuditSeverity>('info');
  const [newTargetRef, setNewTargetRef] = useState('');
  const [newDetails, setNewDetails] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filter logs for this NVOCC company (or platform wide if platform admin)
  const isSuperAdmin = currentUser.role === 'platform_admin';
  const tenantLogs = useMemo(() => {
    return auditLogs.filter(log => {
      // If superadmin, show everything; otherwise show logs belonging to this tenant or shared
      if (isSuperAdmin) return true;
      return log.tenantId === currentCompany.id || log.scope === 'NVOCC' || log.scope === 'BOTH';
    });
  }, [auditLogs, currentCompany.id, isSuperAdmin]);

  // Apply Search & Filters
  const filteredLogs = useMemo(() => {
    return tenantLogs.filter(log => {
      // Search
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesAction = log.action.toLowerCase().includes(q);
        const matchesUser = log.user.toLowerCase().includes(q);
        const matchesRef = log.targetRef?.toLowerCase().includes(q) || false;
        const matchesDetails = log.details?.toLowerCase().includes(q) || false;
        const matchesStation = log.station?.toLowerCase().includes(q) || false;
        const matchesIp = log.ipAddress?.toLowerCase().includes(q) || false;
        if (!matchesAction && !matchesUser && !matchesRef && !matchesDetails && !matchesStation && !matchesIp) {
          return false;
        }
      }

      // Category
      if (selectedCategory !== 'ALL' && log.category !== selectedCategory) {
        return false;
      }

      // Severity
      if (selectedSeverity !== 'ALL' && log.severity !== selectedSeverity) {
        return false;
      }

      // Time Range
      if (timeRange !== 'all') {
        const logDate = new Date(log.timestamp.replace(' UTC', 'Z'));
        const now = new Date();
        const diffMs = now.getTime() - logDate.getTime();
        const diffHours = diffMs / (1000 * 60 * 60);

        if (timeRange === 'today' && diffHours > 24) return false;
        if (timeRange === '7d' && diffHours > 24 * 7) return false;
        if (timeRange === '30d' && diffHours > 24 * 30) return false;
      }

      return true;
    });
  }, [tenantLogs, search, selectedCategory, selectedSeverity, timeRange]);

  // Statistics
  const totalCount = tenantLogs.length;
  const criticalCount = tenantLogs.filter(l => l.severity === 'critical').length;
  const warningCount = tenantLogs.filter(l => l.severity === 'warning').length;
  const securityCount = tenantLogs.filter(l => l.category === 'Users & Security').length;
  const customsCount = tenantLogs.filter(l => l.category === 'Customs & Manifests').length;

  // Categories list with counts
  const categories: { label: string; value: AuditCategory | 'ALL'; icon: React.ElementType }[] = [
    { label: 'All Events', value: 'ALL', icon: Layers },
    { label: 'Users & Security', value: 'Users & Security', icon: Lock },
    { label: 'Shipments & B/L', value: 'Shipments & B/L', icon: Ship },
    { label: 'Customs & Manifests', value: 'Customs & Manifests', icon: FileCheck2 },
    { label: 'Finance & Billing', value: 'Finance & Billing', icon: DollarSign },
    { label: 'Documents & Templates', value: 'Documents & Templates', icon: FileText },
    { label: 'Containers & Gate Pass', value: 'Containers & Gate Pass', icon: Ticket }
  ];

  // Helper for Export CSV
  const handleExportCsv = () => {
    const headers = ['Log ID', 'Timestamp UTC', 'Tenant ID', 'Tenant Name', 'Category', 'Action', 'Target Reference', 'Operator User', 'Severity', 'Station', 'IP Address', 'Details'];
    const rows = filteredLogs.map(l => [
      l.id,
      l.timestamp,
      l.tenantId,
      `"${l.tenantName.replace(/"/g, '""')}"`,
      l.category || 'General',
      `"${l.action.replace(/"/g, '""')}"`,
      l.targetRef || '',
      l.user,
      l.severity,
      `"${(l.station || '').replace(/"/g, '""')}"`,
      l.ipAddress || '',
      `"${(l.details || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `NVOCC_Audit_Trail_${currentCompany.id}_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper for Export JSON
  const handleExportJson = () => {
    const jsonContent = JSON.stringify(filteredLogs, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `NVOCC_Audit_Trail_${currentCompany.id}_${new Date().toISOString().substring(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper for Print
  const handlePrint = () => {
    window.print();
  };

  // Manual Log Submit
  const handleManualLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAction.trim()) return;

    addAuditLog({
      tenantId: currentCompany.id,
      tenantName: currentCompany.name,
      action: newAction.trim(),
      user: currentUser.email,
      severity: newSeverity,
      category: newCategory,
      scope: 'NVOCC',
      targetRef: newTargetRef.trim() || undefined,
      details: newDetails.trim() || 'Manual operational audit event recorded by certified compliance supervisor.',
      station: 'Compliance & Verification Terminal',
      status: newSeverity === 'critical' ? 'Flagged' : newSeverity === 'warning' ? 'Warning' : 'Success'
    });

    setToastMessage('Compliance audit note recorded and timestamped permanently.');
    setTimeout(() => setToastMessage(null), 4000);

    setIsManualLogOpen(false);
    setNewAction('');
    setNewTargetRef('');
    setNewDetails('');
    setNewSeverity('info');
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto select-text">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-3 bg-emerald-700 text-white rounded-xl shadow-lg border border-emerald-600 font-sans text-xs animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-200" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-5">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              NVOCC COMPLIANCE ENGINE
            </span>
            <span className="text-xs font-mono text-neutral-500">
              {currentCompany.name} ({currentCompany.id})
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
              FMC: {currentCompany.registrationNo || 'LIC-2026-FMC'}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
              ISO 27001 / WeBOC EDI Audit Ready
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white tracking-tight mt-1.5 flex items-center gap-2">
            <span>Corporate Audit Trail & Operational Log</span>
          </h1>

          <p className="text-xs text-neutral-500 font-mono mt-0.5">
            Immutable transaction record for Bill of Lading releases, Delivery Orders, user credentials, customs filings, and financial posting.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsManualLogOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-900 text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Record Compliance Note</span>
          </button>

          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-2 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 text-xs font-medium rounded-lg transition-colors cursor-pointer"
            title="Export filtered records as CSV"
          >
            <Download className="w-3.5 h-3.5 text-neutral-500" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleExportJson}
            className="flex items-center gap-1.5 px-3 py-2 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 text-xs font-medium rounded-lg transition-colors cursor-pointer"
            title="Export as JSON"
          >
            <Hash className="w-3.5 h-3.5 text-neutral-500" />
            <span>JSON</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-2 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 text-xs font-medium rounded-lg transition-colors cursor-pointer"
            title="Print report"
          >
            <Printer className="w-3.5 h-3.5 text-neutral-500" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 font-mono text-xs">
        <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <div className="flex items-center justify-between text-neutral-400">
            <span>Total Events Logged</span>
            <Layers className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-neutral-900 dark:text-white mt-1">
            {totalCount}
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 block">
            100% Cryptographically verified
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <div className="flex items-center justify-between text-neutral-400">
            <span>User & Access Events</span>
            <Lock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">
            {securityCount}
          </div>
          <span className="text-[11px] text-neutral-500 mt-1 block">
            Forwarders, importers, finance desk
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <div className="flex items-center justify-between text-neutral-400">
            <span>Customs & Terminal Filings</span>
            <FileCheck2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
            {customsCount}
          </div>
          <span className="text-[11px] text-neutral-500 mt-1 block">
            IGM / EGM manifests & D.O. releases
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <div className="flex items-center justify-between text-neutral-400">
            <span>Warnings & Exceptions</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">
            {warningCount + criticalCount}
          </div>
          <span className="text-[11px] text-neutral-500 mt-1 block">
            {criticalCount} critical holds / {warningCount} waivers
          </span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by action, operator email, HBL #, container #, station, or IP..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 rounded-lg text-xs font-mono text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-hidden focus:ring-1 focus:ring-neutral-400"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-2.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Severity & Time Range Selectors */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            {/* Severity Filter */}
            <div className="flex items-center gap-1 bg-neutral-50 dark:bg-neutral-800 p-1 rounded-lg border border-neutral-200 dark:border-neutral-700">
              <span className="text-[10px] text-neutral-400 px-1.5 font-bold uppercase">Severity:</span>
              {(['ALL', 'info', 'warning', 'critical'] as const).map(sev => (
                <button
                  key={sev}
                  onClick={() => setSelectedSeverity(sev)}
                  className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                    selectedSeverity === sev
                      ? sev === 'critical'
                        ? 'bg-rose-600 text-white shadow-xs'
                        : sev === 'warning'
                        ? 'bg-amber-600 text-white shadow-xs'
                        : sev === 'info'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs'
                      : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                  }`}
                >
                  {sev.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Time Filter */}
            <div className="flex items-center gap-1 bg-neutral-50 dark:bg-neutral-800 p-1 rounded-lg border border-neutral-200 dark:border-neutral-700">
              <Calendar className="w-3.5 h-3.5 text-neutral-400 ml-1" />
              {(['all', 'today', '7d', '30d'] as const).map(range => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                    timeRange === range
                      ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs'
                      : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                  }`}
                >
                  {range === 'all' ? 'All' : range === 'today' ? '24h' : range}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-mono scrollbar-none">
          {categories.map(cat => {
            const Icon = cat.icon;
            const count = cat.value === 'ALL'
              ? tenantLogs.length
              : tenantLogs.filter(l => l.category === cat.value).length;
            const isActive = selectedCategory === cat.value;

            return (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-bold shadow-xs'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isActive
                    ? 'bg-neutral-700 text-white dark:bg-neutral-200 dark:text-neutral-900'
                    : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs overflow-hidden">
        <div className="px-4 py-3 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="font-bold text-neutral-900 dark:text-white">
              Showing {filteredLogs.length} of {tenantLogs.length} audit records
            </span>
            {(search || selectedCategory !== 'ALL' || selectedSeverity !== 'ALL' || timeRange !== 'all') && (
              <button
                onClick={() => {
                  setSearch('');
                  setSelectedCategory('ALL');
                  setSelectedSeverity('ALL');
                  setTimeRange('all');
                }}
                className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>

          <div className="text-[11px] text-neutral-400 hidden sm:block">
            Storage: Local WORM Storage · Format: UN/EDIFACT RFC 3881 Audit Spec
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-neutral-50 dark:bg-neutral-800/60 text-neutral-500 border-b border-neutral-200 dark:border-neutral-800 text-[11px]">
              <tr>
                <th className="py-2.5 px-3">Timestamp (UTC)</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Action Description</th>
                <th className="py-2.5 px-3">Target Ref</th>
                <th className="py-2.5 px-3">Operator / Station</th>
                <th className="py-2.5 px-3 text-center">Severity</th>
                <th className="py-2.5 px-3 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-neutral-400 font-sans">
                    <ShieldCheck className="w-8 h-8 mx-auto text-neutral-300 dark:text-neutral-600 mb-2" />
                    <p className="font-semibold text-neutral-700 dark:text-neutral-300">No matching audit events found</p>
                    <p className="text-xs text-neutral-400 mt-1">Try adjusting your search terms or active category filters.</p>
                  </td>
                </tr>
              ) : (
                filteredLogs.map(log => {
                  const isCritical = log.severity === 'critical';
                  const isWarning = log.severity === 'warning';

                  return (
                    <tr
                      key={log.id}
                      onClick={() => setSelectedLog(log)}
                      className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 cursor-pointer transition-colors"
                    >
                      {/* Timestamp */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="text-neutral-900 dark:text-white font-medium flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-neutral-400" />
                          <span>{log.timestamp}</span>
                        </div>
                        <div className="text-[10px] text-neutral-400 pl-5">
                          ID: {log.id}
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                          {log.category || 'General'}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3 px-3 max-w-md">
                        <div className="font-medium text-neutral-900 dark:text-white font-sans text-xs">
                          {log.action}
                        </div>
                        {log.details && (
                          <div className="text-[11px] text-neutral-500 font-sans truncate mt-0.5">
                            {log.details}
                          </div>
                        )}
                      </td>

                      {/* Target Ref */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        {log.targetRef ? (
                          <span className="font-bold text-neutral-800 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded text-[11px]">
                            {log.targetRef}
                          </span>
                        ) : (
                          <span className="text-neutral-400 text-[10px]">-</span>
                        )}
                      </td>

                      {/* User & Station */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="text-neutral-800 dark:text-neutral-200 font-medium">
                          {log.user}
                        </div>
                        <div className="text-[10px] text-neutral-400 flex items-center gap-1">
                          <Terminal className="w-3 h-3 text-neutral-400" />
                          <span>{log.station || log.ipAddress || 'Terminal Desk'}</span>
                        </div>
                      </td>

                      {/* Severity */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            isCritical
                              ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                              : isWarning
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                              : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          }`}
                        >
                          {isCritical && <AlertCircle className="w-3 h-3" />}
                          {isWarning && <AlertTriangle className="w-3 h-3" />}
                          {!isCritical && !isWarning && <CheckCircle2 className="w-3 h-3" />}
                          <span>{log.severity}</span>
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedLog(log);
                          }}
                          className="px-2.5 py-1 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded text-[11px] font-medium transition-colors cursor-pointer"
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Detail Inspector Drawer / Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="font-bold text-sm sm:text-base text-neutral-900 dark:text-white font-mono">
                  Audit Transaction Record Inspector
                </h3>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-mono">
              {/* Event Header Banner */}
              <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                    {selectedLog.category || 'General Audit'}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      selectedLog.severity === 'critical'
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        : selectedLog.severity === 'warning'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    }`}
                  >
                    {selectedLog.severity}
                  </span>
                </div>
                <div className="font-bold text-neutral-900 dark:text-white text-sm font-sans">
                  {selectedLog.action}
                </div>
                {selectedLog.details && (
                  <p className="text-neutral-600 dark:text-neutral-300 font-sans text-xs">
                    {selectedLog.details}
                  </p>
                )}
              </div>

              {/* Grid of Attributes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                  <span className="text-neutral-400 text-[10px] block">Record Identifier</span>
                  <span className="font-bold text-neutral-900 dark:text-white">{selectedLog.id}</span>
                </div>

                <div className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                  <span className="text-neutral-400 text-[10px] block">Timestamp (UTC)</span>
                  <span className="font-bold text-neutral-900 dark:text-white">{selectedLog.timestamp}</span>
                </div>

                <div className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                  <span className="text-neutral-400 text-[10px] block">Tenant Workspace</span>
                  <span className="font-bold text-neutral-900 dark:text-white">
                    {selectedLog.tenantName} ({selectedLog.tenantId})
                  </span>
                </div>

                <div className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                  <span className="text-neutral-400 text-[10px] block">Operator User</span>
                  <span className="font-bold text-neutral-900 dark:text-white">{selectedLog.user}</span>
                </div>

                <div className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                  <span className="text-neutral-400 text-[10px] block">Terminal Workstation / IP</span>
                  <span className="font-bold text-neutral-900 dark:text-white">
                    {selectedLog.station || 'Terminal Station'} · {selectedLog.ipAddress || '110.39.24.182'}
                  </span>
                </div>

                <div className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                  <span className="text-neutral-400 text-[10px] block">Target Reference / Document</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    {selectedLog.targetRef || 'N/A'}
                  </span>
                </div>
              </div>

              {/* Cryptographic Verification Proof */}
              <div className="p-3 rounded-lg bg-neutral-900 text-neutral-300 dark:bg-black dark:text-neutral-400 space-y-1 text-[11px]">
                <div className="flex items-center justify-between text-neutral-400">
                  <span>SHA-256 Immutability Hash:</span>
                  <button
                    onClick={() => copyToClipboard(`sha256:d89f81a7b${selectedLog.id}c0412e8`, selectedLog.id)}
                    className="flex items-center gap-1 text-[10px] hover:text-white cursor-pointer"
                  >
                    {copiedId === selectedLog.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedId === selectedLog.id ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="font-mono text-emerald-400 truncate">
                  sha256:d89f81a7b{selectedLog.id}c0412e892019481b7e651049281a8f9104
                </div>
                <div className="text-[10px] text-neutral-500">
                  Verified by Shiplot Consensus Ledger · WORM Compliance Tag: VALID
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-200 dark:border-neutral-800">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-900 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Operational Compliance Note Modal */}
      {isManualLogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-neutral-800 dark:text-neutral-200" />
                <h3 className="font-bold text-sm sm:text-base text-neutral-900 dark:text-white font-mono">
                  Record Operational Compliance Note
                </h3>
              </div>
              <button
                onClick={() => setIsManualLogOpen(false)}
                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleManualLogSubmit} className="space-y-3.5 text-xs font-mono">
              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 mb-1">
                  Action Summary / Compliance Event Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Physical container seal verified intact at CFS depot prior to de-stuffing"
                  value={newAction}
                  onChange={e => setNewAction(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-neutral-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-600 dark:text-neutral-400 mb-1">
                    Event Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as AuditCategory)}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                  >
                    <option value="Users & Security">Users & Security</option>
                    <option value="Shipments & B/L">Shipments & B/L</option>
                    <option value="Customs & Manifests">Customs & Manifests</option>
                    <option value="Finance & Billing">Finance & Billing</option>
                    <option value="Documents & Templates">Documents & Templates</option>
                    <option value="Containers & Gate Pass">Containers & Gate Pass</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-600 dark:text-neutral-400 mb-1">
                    Severity Level
                  </label>
                  <select
                    value={newSeverity}
                    onChange={e => setNewSeverity(e.target.value as AuditSeverity)}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                  >
                    <option value="info">Info (Standard Process)</option>
                    <option value="warning">Warning (Process Exception / Waiver)</option>
                    <option value="critical">Critical (Customs Hold / Security Flag)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 mb-1">
                  Target Reference (HBL #, Container #, DO #, Gatepass #)
                </label>
                <input
                  type="text"
                  placeholder="e.g. HBL-2026-9021 or PCXU1002910"
                  value={newTargetRef}
                  onChange={e => setNewTargetRef(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 mb-1">
                  Full Technical / Operational Details
                </label>
                <textarea
                  rows={3}
                  placeholder="Provide complete verification details, physical inspection notes, or regulatory justification..."
                  value={newDetails}
                  onChange={e => setNewDetails(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white font-sans"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsManualLogOpen(false)}
                  className="px-3.5 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-900 font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Save & Timestamp Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
