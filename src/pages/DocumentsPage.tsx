import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  FileSpreadsheet,
  Printer,
  X,
  Building2,
  Calendar,
  Lock,
  ArrowRight,
  LayoutTemplate
} from 'lucide-react';

export const DocumentsPage: React.FC = () => {
  const { currentCompany } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [docCategory, setDocCategory] = useState('All');
  const [selectedDoc, setSelectedDoc] = useState<any | null>(null);

  const docs = [
    {
      id: 'doc_01',
      title: 'Ocean House Bill of Lading (HBL-2026-8821)',
      category: 'Bill of Lading',
      shipmentRef: 'SHP-2026-8821',
      fileType: 'PDF',
      size: '240 KB',
      date: '2026-09-15',
      status: 'Verified Original',
      parties: 'Pacific Precision Electronics → Indus Micro Distribution',
      content: 'Shipped on board MSC Oscar. Negotiable Ocean House Bill of Lading issued under FMC tariff regulations.'
    },
    {
      id: 'doc_pda_01',
      title: 'Proforma Disbursement Account (PDA-2026-KPT-01)',
      category: 'PDA',
      shipmentRef: 'CALL-MSC-KPT-01',
      fileType: 'PDF / Sheet',
      size: '185 KB',
      date: '2026-10-02',
      status: 'Approved by Principal',
      parties: 'Indus Magna Agency Desk → Indus Magna Overseas Principals',
      content: 'Estimated port dues, pilotage (USD 4,800), towage (USD 8,500), berth hire, and agency fee. Advance received USD 34,500.'
    },
    {
      id: 'doc_fda_01',
      title: 'Final Disbursement Account (FDA-2026-PQA-04)',
      category: 'FDA',
      shipmentRef: 'CALL-MSK-PQA-02',
      fileType: 'PDF / Sheet',
      size: '210 KB',
      date: '2026-10-03',
      status: 'Settled',
      parties: 'Indus Magna Agency Desk → Nordic Sea-Air Cargo B.V.',
      content: 'Final audited port expenses for Maersk Mc-Kinney Moller at QICT. Total USD 51,350 against advance USD 45,000. Balance due USD 6,350.'
    },
    {
      id: 'doc_dn_01',
      title: 'Commercial Debit Note (DN-2026-0042)',
      category: 'Debit Note',
      shipmentRef: 'INV-2026-4401',
      fileType: 'PDF',
      size: '115 KB',
      date: '2026-10-02',
      status: 'Issued & Billed',
      parties: 'Indus Magna Shipping → Indus Micro Distribution Ltd',
      content: 'Debit Note for detention demurrage beyond 7 free-days tariff threshold. Amount billable: USD 1,450.00.'
    },
    {
      id: 'doc_cn_01',
      title: 'Commercial Credit Note (CN-2026-0018)',
      category: 'Credit Note',
      shipmentRef: 'INV-2026-4389',
      fileType: 'PDF',
      size: '110 KB',
      date: '2026-10-03',
      status: 'Approved Credit',
      parties: 'Indus Magna Shipping → Pacific Precision Electronics',
      content: 'Volume rebate credit on ocean FCL rate contract. Amount credited: USD 600.00.'
    },
    {
      id: 'doc_arn_01',
      title: 'Official Vessel Arrival Notice (ARN-2026-441)',
      category: 'Arrival Notice',
      shipmentRef: 'SHP-2026-8821',
      fileType: 'PDF',
      size: '160 KB',
      date: '2026-10-01',
      status: 'Broadcasted to Consignee',
      parties: 'Indus Magna Shipping Agency → Consignee / Clearing Agent',
      content: 'Vessel MSC Oscar scheduled arrival at KICT Berth 3 on 2026-10-08. Consignees requested to lodge WeBOC GD and surrender HBL for D.O.'
    },
    {
      id: 'doc_dpn_01',
      title: 'Vessel Sailing Departure Notice (DPN-2026-189)',
      category: 'Departure Notice',
      shipmentRef: 'SHP-2026-8835',
      fileType: 'PDF',
      size: '155 KB',
      date: '2026-10-03',
      status: 'Dispatched to Shipper',
      parties: 'Indus Magna Shipping Agency → Shippers & Principals',
      content: 'Vessel CMA CGM Antoine de Saint Exupery sailed outwards from SAPT Berth 3. All outward containers manifested in EGM-2026-KPT-0199.'
    },
    {
      id: 'doc_si_01',
      title: 'Shipping Instructions (SI-2026-0491)',
      category: 'Shipping Instructions',
      shipmentRef: 'BKG-5521',
      fileType: 'PDF',
      size: '140 KB',
      date: '2026-09-30',
      status: 'Verified by Line',
      parties: 'Indus Valley Basmati Rice Mills → Indus Magna Shipping',
      content: 'Cargo declaration, container seal numbers, and export B/L wording submitted before Draft B/L cut-off.'
    },
    {
      id: 'doc_pc_01',
      title: 'Port Clearance Certificate (PC-2026-PQA-02)',
      category: 'Port Clearance',
      shipmentRef: 'CALL-MSK-PQA-02',
      fileType: 'Official Gov Cert',
      size: '195 KB',
      date: '2026-10-01',
      status: 'Granted by Port Health & Customs',
      parties: 'Port Qasim Authority & Customs → Maersk Mc-Kinney Moller',
      content: 'Inward entry granted following joint boarding inspection by Customs, Immigration, and Port Health.'
    },
    {
      id: 'doc_sc_01',
      title: 'Sailing Clearance Certificate (SC-2026-KPT-01)',
      category: 'Sailing Clearance',
      shipmentRef: 'CALL-CMA-KPT-01',
      fileType: 'Official Gov Cert',
      size: '205 KB',
      date: '2026-10-03',
      status: 'Granted by Harbour Master',
      parties: 'Karachi Port Trust Harbour Master → CMA CGM Antoine de Saint Exupery',
      content: 'Vessel cleared for outward voyage following full verification of outward EGM manifest and light dues settlement.'
    },
    {
      id: 'doc_do_01',
      title: 'Delivery Order Release (DO-2026-0891)',
      category: 'Delivery Order',
      shipmentRef: 'SHP-2026-8821',
      fileType: 'PDF',
      size: '175 KB',
      date: '2026-10-01',
      status: 'Authorized & Active',
      parties: 'Indus Magna Shipping → Al-Hadi Customs Clearing Agency',
      content: 'Cargo release order for 2x40HC containers at KICT. Empty return depot: Premier Container Yard (PCY).'
    },
    {
      id: 'doc_02',
      title: 'SOLAS Verified Gross Mass (VGM) Certificate',
      category: 'Compliance',
      shipmentRef: 'SHP-2026-8821',
      fileType: 'PDF',
      size: '120 KB',
      date: '2026-09-14',
      status: 'Submitted to Terminal',
      parties: 'Weighbridge Scale Operator → Terminal APM / KICT',
      content: 'Certified scale gross mass 21,450 KG in accordance with IMO SOLAS VI Regulation 2 requirements.'
    },
    {
      id: 'doc_04',
      title: 'Customs Entry Summary (WeBOC GD #KAPE-HC-194029)',
      category: 'Customs',
      shipmentRef: 'SHP-2026-8804',
      fileType: 'PDF',
      size: '310 KB',
      date: '2026-09-28',
      status: 'Green Channel Out of Charge',
      parties: 'Pakistan Customs WeBOC → Indus Micro Distribution',
      content: 'Customs duty PKR 553,500, Sales Tax PKR 3,321,000 paid via 1Link PSID #1004928192039.'
    }
  ];

  const filtered = docs.filter(d => {
    if (docCategory !== 'All' && d.category !== docCategory) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        d.title.toLowerCase().includes(q) ||
        d.shipmentRef.toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q) ||
        d.parties.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto font-sans text-neutral-900 dark:text-neutral-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-neutral-950 text-white dark:bg-white dark:text-neutral-950">
              DOCUMENT VAULT & ARCHIVE
            </span>
            <span className="text-xs text-neutral-400 font-mono">
              FMC & Maritime Regulatory Vault
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight mt-1">
            Shipping Documents, Notices & Compliance Vault
          </h1>
          <p className="text-xs text-neutral-500 font-mono mt-0.5">
            Bills of Lading, Delivery Orders, Debit/Credit Notes, Disbursement Accounts (PDA/FDA), and Port/Sailing Clearances
          </p>
        </div>

        <button
          onClick={() => navigate('/templates')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-950 font-mono text-xs font-bold shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <LayoutTemplate className="w-4 h-4" />
          <span>Manage Master Templates & Formats →</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search documents by title, shipment ref, parties, or category..."
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
          <option value="All">All Categories ({docs.length})</option>
          <option value="Bill of Lading">Bills of Lading (HBL / MBL)</option>
          <option value="Delivery Order">Delivery Orders (D.O.)</option>
          <option value="PDA">PDA (Proforma Disbursement Account)</option>
          <option value="FDA">FDA (Final Disbursement Account)</option>
          <option value="Debit Note">Debit Notes</option>
          <option value="Credit Note">Credit Notes</option>
          <option value="Arrival Notice">Arrival Notices</option>
          <option value="Departure Notice">Departure Notices</option>
          <option value="Shipping Instructions">Shipping Instructions (S/I)</option>
          <option value="Port Clearance">Port Clearance</option>
          <option value="Sailing Clearance">Sailing Clearance</option>
          <option value="Customs">Customs Entries</option>
          <option value="Compliance">Compliance & VGM</option>
        </select>
      </div>

      {/* Documents Grid / Table */}
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/60 font-mono text-[11px] text-neutral-500 uppercase">
                <th className="py-3 px-4">Document Title & Ref</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Parties Involved</th>
                <th className="py-3 px-3">Date & Size</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 font-mono">
              {filtered.map(d => (
                <tr key={d.id} className="hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-neutral-900 dark:text-white">
                    <div>{d.title}</div>
                    <span className="text-[10px] text-neutral-400 font-normal">
                      Ref: {d.shipmentRef} · Type: {d.fileType}
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-neutral-100 dark:bg-neutral-800 font-bold text-neutral-800 dark:text-neutral-200">
                      {d.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 font-sans text-xs">
                    <div className="truncate max-w-xs">{d.parties}</div>
                  </td>
                  <td className="py-3.5 px-3 text-[11px]">
                    <div>{d.date}</div>
                    <span className="text-neutral-400 text-[10px]">{d.size}</span>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-950 text-white dark:bg-white dark:text-neutral-950">
                      {d.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-1.5">
                    <button
                      onClick={() => setSelectedDoc(d)}
                      className="px-2.5 py-1 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-xs font-mono font-medium transition-colors cursor-pointer inline-flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </button>
                    <button
                      onClick={() => setSelectedDoc(d)}
                      className="px-2.5 py-1 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-xs font-mono font-medium transition-colors cursor-pointer inline-flex items-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>PDF</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Document Preview Drawer / Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white text-black p-6 sm:p-8 rounded-lg max-w-3xl w-full border-2 border-black shadow-2xl space-y-5 font-mono print:border-none print:shadow-none print:p-0 my-auto">
            {/* Header */}
            <div className="border-b-2 border-black pb-3 flex items-start justify-between">
              <div>
                <h1 className="text-lg font-black uppercase">
                  {currentCompany.displayName || currentCompany.name}
                </h1>
                <div className="text-[10px] text-neutral-600">
                  {currentCompany.address} · Phone: {currentCompany.phone}
                </div>
                <div className="text-xs font-bold uppercase mt-1">
                  {selectedDoc.title}
                </div>
              </div>
              <div className="text-right">
                <span className="border-2 border-black px-2.5 py-0.5 text-xs font-black uppercase bg-neutral-50 inline-block">
                  {selectedDoc.category}
                </span>
                <span className="text-[10px] text-neutral-500 block mt-1">Date: {selectedDoc.date}</span>
              </div>
            </div>

            {/* Document Metadata Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs border border-black p-3 bg-neutral-50">
              <div>
                <span className="text-[10px] text-neutral-500 uppercase block font-bold">Document Reference</span>
                <span className="font-bold">{selectedDoc.shipmentRef}</span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-500 uppercase block font-bold">Verification Status</span>
                <span className="font-bold">{selectedDoc.status}</span>
              </div>
              <div className="col-span-2">
                <span className="text-[10px] text-neutral-500 uppercase block font-bold">Parties Involved</span>
                <span className="font-semibold">{selectedDoc.parties}</span>
              </div>
            </div>

            {/* Content Details */}
            <div className="border border-black p-4 text-xs space-y-2">
              <span className="font-bold uppercase block text-neutral-800">Document Particulars & Clause Record</span>
              <p className="font-sans leading-relaxed text-neutral-800">
                {selectedDoc.content}
              </p>
            </div>

            {/* Verification Signatures */}
            <div className="grid grid-cols-2 gap-4 text-[10px] pt-3 border-t border-black">
              <div>
                <span className="block font-bold">Prepared / Transmitted By</span>
                <span className="text-neutral-500 mt-6 block">Sign: ___________________</span>
              </div>
              <div>
                <span className="block font-bold">Official Seal & Endorsement</span>
                <span className="text-neutral-500 mt-6 block font-bold text-neutral-900">
                  For: {currentCompany.displayName || currentCompany.name}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-black print:hidden">
              <button
                onClick={() => setSelectedDoc(null)}
                className="px-4 py-2 border border-black text-xs font-bold hover:bg-neutral-100 cursor-pointer"
              >
                Close Document
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2 bg-black text-white text-xs font-bold hover:bg-neutral-800 cursor-pointer flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Print / Save PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
