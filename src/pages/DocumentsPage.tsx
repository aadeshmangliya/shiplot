import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Files,
  FileText,
  Download,
  Eye,
  Search,
  CheckCircle2,
  FileCheck,
  Shield,
  FileSpreadsheet
} from 'lucide-react';

export const DocumentsPage: React.FC = () => {
  const { shipments, setSelectedShipmentForBl } = useApp();
  const [search, setSearch] = useState('');
  const [docCategory, setDocCategory] = useState('All');

  const docs = [
    {
      id: 'doc_01',
      title: 'Ocean House Bill of Lading (HBL-2026-8821)',
      category: 'Bill of Lading',
      shipmentRef: 'SHP-2026-8821',
      fileType: 'PDF',
      size: '240 KB',
      date: '2026-09-15',
      status: 'Verified Original'
    },
    {
      id: 'doc_02',
      title: 'SOLAS Verified Gross Mass (VGM) Certificate',
      category: 'Compliance',
      shipmentRef: 'SHP-2026-8821',
      fileType: 'PDF',
      size: '120 KB',
      date: '2026-09-14',
      status: 'Submitted to Terminal'
    },
    {
      id: 'doc_03',
      title: 'Commercial Invoice & Packing List Bundle',
      category: 'Commercial',
      shipmentRef: 'SHP-2026-8804',
      fileType: 'PDF',
      size: '480 KB',
      date: '2026-09-10',
      status: 'Customs Exam Attached'
    },
    {
      id: 'doc_04',
      title: 'CBP Form 7501 - Customs Entry Summary',
      category: 'Customs',
      shipmentRef: 'SHP-2026-8804',
      fileType: 'PDF',
      size: '310 KB',
      date: '2026-09-28',
      status: 'Pending Intensive Release'
    },
    {
      id: 'doc_05',
      title: 'Ocean Master Bill of Lading (MBL-MSC-44910)',
      category: 'Bill of Lading',
      shipmentRef: 'SHP-2026-8821',
      fileType: 'EDI / PDF',
      size: '190 KB',
      date: '2026-09-15',
      status: 'INTTRA Acknowledged'
    },
    {
      id: 'doc_06',
      title: 'Arrival Notice & Freight Delivery Order (D/O)',
      category: 'Delivery',
      shipmentRef: 'SHP-2026-8835',
      fileType: 'PDF',
      size: '175 KB',
      date: '2026-09-29',
      status: 'Ready for Dispatch'
    }
  ];

  const filtered = docs.filter(d => {
    if (docCategory !== 'All' && d.category !== docCategory) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        d.title.toLowerCase().includes(q) ||
        d.shipmentRef.toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q)
      );
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
              EDI & DIGITAL VAULT
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white tracking-tight mt-1">
            Shipping Documents & Compliance Vault
          </h1>
          <p className="text-xs text-neutral-500 font-mono mt-0.5">
            Bills of lading, arrival notices, customs exam entries, and SOLAS VGM manifests
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search documents by title, shipment ref, or category..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-neutral-100 dark:bg-neutral-800 border border-transparent focus:border-neutral-300 dark:focus:border-neutral-700 rounded-lg text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-hidden font-mono"
          />
        </div>

        <select
          value={docCategory}
          onChange={e => setDocCategory(e.target.value)}
          className="px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 text-xs font-mono text-neutral-700 dark:text-neutral-300"
        >
          <option value="All">All Categories</option>
          <option value="Bill of Lading">Bill of Lading</option>
          <option value="Compliance">Compliance & VGM</option>
          <option value="Customs">Customs Entries</option>
          <option value="Commercial">Commercial Invoices</option>
          <option value="Delivery">Delivery Orders</option>
        </select>
      </div>

      {/* Documents List */}
      <div className="rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="bg-neutral-50 dark:bg-neutral-800/60 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 text-[11px]">
                <th className="py-3 px-4">Document Title</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Shipment Ref</th>
                <th className="py-3 px-4">Format / Size</th>
                <th className="py-3 px-4">Issued Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {filtered.map(doc => (
                <tr key={doc.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-500 shrink-0" />
                    <span>{doc.title}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-[10px]">
                      {doc.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-neutral-800 dark:text-neutral-200">
                    {doc.shipmentRef}
                  </td>
                  <td className="py-3.5 px-4 text-neutral-500">
                    {doc.fileType} · {doc.size}
                  </td>
                  <td className="py-3.5 px-4 text-neutral-500">
                    {doc.date}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-semibold">
                      {doc.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <button
                      onClick={() => {
                        const s = shipments.find(item => item.shipmentNo === doc.shipmentRef) || shipments[0];
                        setSelectedShipmentForBl(s);
                      }}
                      className="px-2.5 py-1 rounded bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-950 font-sans text-[11px] font-medium transition-colors"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
