import React, { useState } from 'react';
import { initialAgencyPartners } from '../mock/data';
import {
  Users2,
  Building2,
  Ship,
  Search,
  Mail,
  Phone,
  MapPin,
  ExternalLink
} from 'lucide-react';

export const PartnersPage: React.FC = () => {
  const [partnerType, setPartnerType] = useState('All');
  const [search, setSearch] = useState('');

  const partners = [
    {
      id: 'pt_01',
      name: 'Pacific Precision Electronics Inc.',
      category: 'Shipper / Exporter',
      hq: 'Irvine, CA, USA',
      contact: 'export-ops@pacificprecision.com',
      monthlyTeu: 48,
      status: 'Active Tier 1',
      creditTerms: 'Net 30'
    },
    {
      id: 'pt_02',
      name: 'Shenzhen Quantum Microelectronics Ltd.',
      category: 'Consignee / Importer',
      hq: 'Shenzhen, China',
      contact: 'inbound@quantummicro.cn',
      monthlyTeu: 62,
      status: 'Active Tier 1',
      creditTerms: 'Prepaid'
    },
    ...initialAgencyPartners,
    {
      id: 'pt_03',
      name: 'Mediterranean Shipping Company (MSC)',
      category: 'Ocean Carrier',
      hq: 'Geneva, Switzerland',
      contact: 'us-booking@msc.com',
      monthlyTeu: 450,
      status: 'Service Contract Partner',
      creditTerms: 'Service Contract #MSC-2026-99'
    },
    {
      id: 'pt_04',
      name: 'Maersk Line A/S',
      category: 'Ocean Carrier',
      hq: 'Copenhagen, Denmark',
      contact: 'nvocc.desk@maersk.com',
      monthlyTeu: 380,
      status: 'Service Contract Partner',
      creditTerms: 'Service Contract #MAEU-2026-14'
    },
    {
      id: 'pt_05',
      name: 'Keppel Distripark Port Agency Pte Ltd',
      category: 'Destination Agent',
      hq: 'Singapore',
      contact: 'ops@keppeldistripark.sg',
      monthlyTeu: 120,
      status: 'Exclusive CFS Agent',
      creditTerms: 'Net 15'
    }
  ];

  const filtered = partners.filter(p => {
    if (partnerType !== 'All' && p.category !== partnerType) return false;
    if (search) {
      const q = search.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.hq.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
              TRADE NETWORK DIRECTORY
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white tracking-tight mt-1">
            Shippers, Consignees & Carrier Lines
          </h1>
          <p className="text-xs text-neutral-500 font-mono mt-0.5">
            Manage commercial relationships, service contracts, and port destination agents
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search trade partner by name or city..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-neutral-100 dark:bg-neutral-800 border border-transparent focus:border-neutral-300 dark:focus:border-neutral-700 rounded-lg text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-hidden font-mono"
          />
        </div>

        <select
          value={partnerType}
          onChange={e => setPartnerType(e.target.value)}
          className="px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 text-xs font-mono text-neutral-700 dark:text-neutral-300"
        >
          <option value="All">All Partner Categories</option>
          <option value="Principal">Overseas Principal (Agency)</option>
          <option value="Ship Owner">Ship Owner</option>
          <option value="Charterer">Charterer</option>
          <option value="Shipper / Exporter">Shipper / Exporter</option>
          <option value="Consignee / Importer">Consignee / Importer</option>
          <option value="Ocean Carrier">Ocean Carrier Line</option>
          <option value="Destination Agent">Destination Port Agent</option>
        </select>
      </div>

      {/* Partners Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(p => (
          <div
            key={p.id}
            className="p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold">
                  {p.category}
                </span>
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                  {p.status}
                </span>
              </div>

              <div className="mt-3 space-y-2">
                <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
                  {p.name}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-mono">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{p.hq}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-mono">
                  <Mail className="w-3.5 h-3.5" />
                  <span className="truncate">{p.contact}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs font-mono">
              <div>
                <span className="text-[10px] text-neutral-400 block font-sans">Monthly Volume:</span>
                <span className="font-bold text-neutral-900 dark:text-white">{p.monthlyTeu} TEUs</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-neutral-400 block font-sans">Terms:</span>
                <span className="text-neutral-700 dark:text-neutral-300">{p.creditTerms}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
