import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DeliveryOrder } from '../types';
import {
  FileText,
  Plus,
  Search,
  Printer,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Lock,
  AlertCircle,
  Eye,
  Check,
  X,
  Building2,
  FileCheck,
  Package,
  Box,
  Truck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DeliveryOrderPage: React.FC = () => {
  const { deliveryOrders, addDeliveryOrder, canUserPerform, currentUser, currentCompany } = useApp();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedDoForPrint, setSelectedDoForPrint] = useState<DeliveryOrder | null>(null);
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [roleError, setRoleError] = useState<string | null>(null);
  const [draftSavedMsg, setDraftSavedMsg] = useState<string | null>(null);

  // Form State
  const [vesselName, setVesselName] = useState('MSC Oscar');
  const [voyage, setVoyage] = useState('MS-2640W');
  const [virNumber, setVirNumber] = useState('VIR-KPT-2026-441');
  const [mblNumber, setMblNumber] = useState('MEDU77192841');
  const [hblNumber, setHblNumber] = useState('HBL-2026-8850');
  const [destinationPort, setDestinationPort] = useState('Karachi Port (KPT)');
  const [igmNumber, setIgmNumber] = useState('IGM-2026-KPT-0418');
  const [issuedTo, setIssuedTo] = useState('Al-Hadi Customs Clearing & Forwarding Agency (Lic #2140)');
  const [consigneeName, setConsigneeName] = useState('Indus Micro Distribution Ltd');
  const [consigneeAddress, setConsigneeAddress] = useState('Suite 401, Business Avenue, P.E.C.H.S Block 6, Shahrah-e-Faisal, Karachi');
  const [containerNo, setContainerNo] = useState('MSKU7829103');
  const [emptyReturnLocation, setEmptyReturnLocation] = useState('Premier Container Yard (PCY), Hawke\'s Bay Road, Karachi');
  const [emptyReturnValidity, setEmptyReturnValidity] = useState('2026-10-18');
  const [cargoDesc, setCargoDesc] = useState('Integrated microcontrollers and server telecommunication processors');
  const [grossWeight, setGrossWeight] = useState(21450);

  const canGenerate = canUserPerform('canGenerateDeliveryOrder');

  const filteredDos = deliveryOrders.filter(d => {
    if (filterStatus !== 'All' && d.status !== filterStatus) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        d.doNumber.toLowerCase().includes(q) ||
        d.vesselName.toLowerCase().includes(q) ||
        d.hblNumber.toLowerCase().includes(q) ||
        d.consigneeName.toLowerCase().includes(q) ||
        d.igmNumber.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleOpenCreateForm = () => {
    if (!canGenerate) {
      setRoleError('Permission Denied: Only Admin and System Administrator roles are authorized to issue and generate Delivery Orders (D.O.). Current user role: ' + currentUser.role);
      setTimeout(() => setRoleError(null), 5000);
      return;
    }
    setIsCreateFormOpen(!isCreateFormOpen);
  };

  const handleSaveDraft = () => {
    const time = new Date().toLocaleTimeString();
    setDraftSavedMsg(`Delivery order draft saved at ${time}`);
    setTimeout(() => setDraftSavedMsg(null), 3000);
  };

  const handleCreateDo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canGenerate) {
      setRoleError('Role restriction: Delivery Order generation requires Administrator authorization.');
      return;
    }

    const idNum = Math.floor(1000 + Math.random() * 9000);
    const todayStr = new Date().toISOString().substring(0, 10);
    const validUntil = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10);

    const newDo: DeliveryOrder = {
      id: `do_${Date.now()}`,
      doNumber: `DO-2026-${idNum}`,
      issueDate: todayStr,
      validityDate: validUntil,
      vesselName,
      voyage,
      virNumber,
      mblNumber,
      hblNumber,
      destinationPort,
      igmNumber,
      igmLineNo: 1,
      igmSubLineNo: 1,
      issuedTo,
      consigneeName,
      consigneeAddress,
      notifyPartyName: 'Same as Consignee',
      notifyPartyAddress: consigneeAddress,
      containers: [
        {
          containerNo: containerNo.toUpperCase(),
          sizeType: '40HC',
          sealNo: 'SL-881920',
          emptyReturnLocation,
          emptyReturnValidity,
          marksAndNumbers: 'AS PER B/L',
          packageCount: 600,
          packageType: 'Cartons',
          cargoDesc,
          grossWeightKg: Number(grossWeight)
        }
      ],
      lineRemarks: 'All ocean freight, terminal THC, and delivery order documentation charges paid. Release authorized.',
      status: 'Issued',
      clearingAgent: issuedTo
    };

    addDeliveryOrder(newDo);
    setIsCreateFormOpen(false);
    setSelectedDoForPrint(newDo);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto font-sans text-neutral-900 dark:text-neutral-100">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-neutral-950 text-white dark:bg-white dark:text-neutral-950">
              COMMERCIAL CARGO RELEASE
            </span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Role-Gated Issuance</span>
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight mt-1">
            Delivery Order (D.O.) Management
          </h1>
          <p className="text-xs text-neutral-500 font-mono mt-0.5">
            Issue and verify authentic ocean Delivery Orders against surrendered Bills of Lading, IGM Line Nos, and Empty Container Return guarantees
          </p>
        </div>

        <button
          onClick={handleOpenCreateForm}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-mono font-bold bg-neutral-950 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-200 dark:text-neutral-950 transition-all shadow-xs cursor-pointer self-start sm:self-auto"
        >
          {canGenerate ? <Plus className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
          <span>+ Generate Delivery Order</span>
        </button>
      </div>

      {/* Role Permission Alert */}
      {roleError && (
        <div className="p-3.5 bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 rounded-lg text-xs font-mono flex items-center gap-2 text-rose-900 dark:text-rose-200">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{roleError}</span>
        </div>
      )}

      {draftSavedMsg && (
        <div className="p-3 bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs font-mono flex items-center gap-2 text-neutral-900 dark:text-white">
          <Check className="w-4 h-4 text-emerald-600" />
          <span className="font-semibold">{draftSavedMsg}</span>
        </div>
      )}

      {/* On-Page Inline DO Generation Form */}
      {isCreateFormOpen && (
        <div className="rounded-xl border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-md p-5 sm:p-6 space-y-4 text-xs font-mono">
          <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
            <div className="flex items-center gap-2">
              <FileCheck className="w-4 h-4" />
              <h2 className="font-bold text-sm">Issue Authentic Ocean Delivery Order (D.O.)</h2>
            </div>
            <button
              onClick={handleSaveDraft}
              className="px-3 py-1 rounded border border-neutral-300 dark:border-neutral-700 text-xs font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
            >
              Save as Draft
            </button>
          </div>

          <form onSubmit={handleCreateDo} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="block text-neutral-500 mb-1">Ocean Vessel *</label>
                <input
                  type="text"
                  required
                  value={vesselName}
                  onChange={e => setVesselName(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 font-bold"
                />
              </div>
              <div>
                <label className="block text-neutral-500 mb-1">Voyage Number *</label>
                <input
                  type="text"
                  required
                  value={voyage}
                  onChange={e => setVoyage(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 uppercase"
                />
              </div>
              <div>
                <label className="block text-neutral-500 mb-1">VIR (Vessel Info Report) No *</label>
                <input
                  type="text"
                  required
                  value={virNumber}
                  onChange={e => setVirNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950"
                />
              </div>
              <div>
                <label className="block text-neutral-500 mb-1">Customs IGM Number *</label>
                <input
                  type="text"
                  required
                  value={igmNumber}
                  onChange={e => setIgmNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 font-bold"
                />
              </div>

              <div>
                <label className="block text-neutral-500 mb-1">Master B/L (MBL) *</label>
                <input
                  type="text"
                  required
                  value={mblNumber}
                  onChange={e => setMblNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950"
                />
              </div>
              <div>
                <label className="block text-neutral-500 mb-1">House B/L (HBL) *</label>
                <input
                  type="text"
                  required
                  value={hblNumber}
                  onChange={e => setHblNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 font-bold"
                />
              </div>
              <div>
                <label className="block text-neutral-500 mb-1">Destination Port *</label>
                <input
                  type="text"
                  required
                  value={destinationPort}
                  onChange={e => setDestinationPort(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950"
                />
              </div>
              <div>
                <label className="block text-neutral-500 mb-1">Container Number *</label>
                <input
                  type="text"
                  required
                  value={containerNo}
                  onChange={e => setContainerNo(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 font-bold uppercase"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-neutral-500 mb-1">Issued To (Clearing Agent / Consignee) *</label>
                <input
                  type="text"
                  required
                  value={issuedTo}
                  onChange={e => setIssuedTo(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-neutral-500 mb-1">Consignee Full Legal Name *</label>
                <input
                  type="text"
                  required
                  value={consigneeName}
                  onChange={e => setConsigneeName(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-neutral-500 mb-1">Consignee Address *</label>
                <input
                  type="text"
                  required
                  value={consigneeAddress}
                  onChange={e => setConsigneeAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-neutral-500 mb-1">Empty Return Depot & City *</label>
                <input
                  type="text"
                  required
                  value={emptyReturnLocation}
                  onChange={e => setEmptyReturnLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-neutral-500 mb-1">Empty Return Validity Date *</label>
                <input
                  type="date"
                  required
                  value={emptyReturnValidity}
                  onChange={e => setEmptyReturnValidity(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-neutral-500 mb-1">Cargo Goods Description *</label>
                <input
                  type="text"
                  required
                  value={cargoDesc}
                  onChange={e => setCargoDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-neutral-200 dark:border-neutral-800">
              <button
                type="button"
                onClick={() => setIsCreateFormOpen(false)}
                className="px-4 py-2 rounded text-xs border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded text-xs font-bold bg-neutral-950 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-950"
              >
                Authorize & Issue Delivery Order
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-neutral-900 p-3 rounded-xl border border-neutral-200 dark:border-neutral-800">
        <div className="relative flex-1 w-full sm:w-auto">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by DO number, vessel, HBL, consignee, IGM..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-hidden font-mono"
          />
        </div>

        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 text-xs font-mono text-neutral-700 dark:text-neutral-300"
        >
          <option value="All">All Statuses</option>
          <option value="Issued">Issued & Valid</option>
          <option value="Gate Pass Generated">Gate Pass Ready</option>
          <option value="Expired">Expired</option>
          <option value="Surrendered">Surrendered</option>
        </select>
      </div>

      {/* Delivery Orders Table */}
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/60 font-mono text-[11px] text-neutral-500 uppercase">
                <th className="py-3 px-4">DO Number & Issue Date</th>
                <th className="py-3 px-3">Vessel & Voyage</th>
                <th className="py-3 px-3">B/L References (HBL / MBL)</th>
                <th className="py-3 px-3">Consignee & Issued To</th>
                <th className="py-3 px-3">Containers & Return Depot</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 font-mono">
              {filteredDos.map(d => (
                <tr key={d.id} className="hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-neutral-900 dark:text-white">
                    <div>{d.doNumber}</div>
                    <span className="text-[10px] text-neutral-400 font-normal">
                      Issued: {d.issueDate} · Valid: {d.validityDate}
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="font-bold text-neutral-900 dark:text-white">{d.vesselName}</div>
                    <span className="text-[11px] text-neutral-500 font-sans">
                      Voy: {d.voyage} · VIR: {d.virNumber}
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="font-bold">{d.hblNumber}</div>
                    <span className="text-[10px] text-neutral-400">
                      MBL: {d.mblNumber} · IGM: {d.igmNumber}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 font-sans text-xs">
                    <div className="font-bold">{d.consigneeName}</div>
                    <span className="text-[10px] text-neutral-500 block truncate max-w-xs">
                      Agent: {d.issuedTo}
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="font-bold">
                      {d.containers.map(c => c.containerNo).join(', ')}
                    </div>
                    <span className="text-[10px] text-neutral-400 block truncate max-w-xs">
                      Return: {d.containers[0]?.emptyReturnLocation}
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="inline-block px-2.5 py-1 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      {d.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-1.5">
                    <button
                      onClick={() => setSelectedDoForPrint(d)}
                      className="px-2.5 py-1 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-xs font-mono font-medium transition-colors cursor-pointer inline-flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View & Print D.O.</span>
                    </button>
                    <button
                      onClick={() => navigate('/gatepass', { state: { prefilledContainerNo: d.containers[0]?.containerNo } })}
                      className="px-2.5 py-1 rounded border border-neutral-950 dark:border-white bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 hover:bg-neutral-800 text-xs font-mono font-bold transition-colors cursor-pointer inline-flex items-center gap-1"
                      title="Generate Gate Out Pass"
                    >
                      <Truck className="w-3 h-3" />
                      <span>Gate Pass</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Official Printable Delivery Order Document Drawer / Modal */}
      {selectedDoForPrint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white text-black p-6 sm:p-8 rounded-lg max-w-4xl w-full border-2 border-black shadow-2xl space-y-5 font-mono print:border-none print:shadow-none print:p-0 my-auto max-h-[95vh] overflow-y-auto">
            {/* Header with Company Branding */}
            <div className="border-b-2 border-black pb-4 flex items-start justify-between">
              <div>
                {currentCompany.logoUrl ? (
                  <img src={currentCompany.logoUrl} alt={currentCompany.name} className="h-10 max-w-[180px] object-contain mb-1" />
                ) : (
                  <h1 className="text-xl font-black uppercase tracking-tight">
                    {currentCompany.displayName || currentCompany.name}
                  </h1>
                )}
                <div className="text-[11px] font-bold text-neutral-800">
                  {currentCompany.tagline}
                </div>
                <div className="text-[10px] text-neutral-600">
                  {currentCompany.address} · Phone: {currentCompany.phone} · Email: {currentCompany.email}
                </div>
                <div className="text-[10px] text-neutral-700 font-bold mt-0.5">
                  Tax / NTN / Reg: {currentCompany.nationalId || currentCompany.registrationNo}
                </div>
              </div>
              <div className="text-right">
                <div className="border-2 border-black px-3 py-1 font-black text-sm uppercase bg-neutral-50">
                  DELIVERY ORDER (D.O.)
                </div>
                <div className="text-xs font-black mt-1">
                  NO: {selectedDoForPrint.doNumber}
                </div>
                <span className="text-[10px] text-neutral-600 block">
                  Date: {selectedDoForPrint.issueDate}
                </span>
                <span className="text-[10px] font-bold text-neutral-800 block">
                  Valid Until: {selectedDoForPrint.validityDate}
                </span>
              </div>
            </div>

            {/* Vessel & IGM Reference Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs border border-black p-3 bg-neutral-50">
              <div>
                <span className="text-[10px] text-neutral-500 uppercase font-bold block">Vessel & Voyage</span>
                <span className="font-black">{selectedDoForPrint.vesselName} / {selectedDoForPrint.voyage}</span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-500 uppercase font-bold block">VIR Number</span>
                <span className="font-bold">{selectedDoForPrint.virNumber}</span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-500 uppercase font-bold block">IGM No & Line</span>
                <span className="font-bold">{selectedDoForPrint.igmNumber} (Line {selectedDoForPrint.igmLineNo})</span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-500 uppercase font-bold block">Port of Delivery</span>
                <span className="font-bold">{selectedDoForPrint.destinationPort}</span>
              </div>
            </div>

            {/* Parties */}
            <div className="grid grid-cols-2 gap-4 text-xs border border-black p-3">
              <div>
                <span className="text-[10px] text-neutral-500 uppercase font-bold block">Consignee Legal Entity</span>
                <span className="font-black text-sm block">{selectedDoForPrint.consigneeName}</span>
                <span className="text-[11px] text-neutral-600 font-sans block mt-0.5">{selectedDoForPrint.consigneeAddress}</span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-500 uppercase font-bold block">Issued To (Clearing Agent / Transporter)</span>
                <span className="font-bold block">{selectedDoForPrint.issuedTo}</span>
                <span className="text-[10px] text-neutral-500 block mt-1">
                  Master B/L: {selectedDoForPrint.mblNumber} · House B/L: {selectedDoForPrint.hblNumber}
                </span>
              </div>
            </div>

            {/* Per-Container Table */}
            <div>
              <div className="font-bold text-xs uppercase mb-1">Manifested Equipment & Container Delivery Specifics</div>
              <table className="w-full text-left text-xs border border-black">
                <thead>
                  <tr className="bg-neutral-100 border-b border-black text-[10px] uppercase">
                    <th className="p-2 border-r border-black">Container No</th>
                    <th className="p-2 border-r border-black">Type & Seal</th>
                    <th className="p-2 border-r border-black">Empty Return Depot & Validity</th>
                    <th className="p-2 border-r border-black">Marks & Packages</th>
                    <th className="p-2 border-r border-black">Description of Goods</th>
                    <th className="p-2 text-right">Weight (KG)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black text-[11px]">
                  {selectedDoForPrint.containers.map((c, idx) => (
                    <tr key={idx}>
                      <td className="p-2 border-r border-black font-bold">
                        {c.containerNo}
                      </td>
                      <td className="p-2 border-r border-black">
                        {c.sizeType} (Seal: {c.sealNo})
                      </td>
                      <td className="p-2 border-r border-black">
                        <div className="font-bold">{c.emptyReturnLocation}</div>
                        <span className="text-[10px] text-neutral-500">Return by: {c.emptyReturnValidity}</span>
                      </td>
                      <td className="p-2 border-r border-black">
                        {c.packageCount} {c.packageType}
                        <div className="text-[10px] text-neutral-500">{c.marksAndNumbers}</div>
                      </td>
                      <td className="p-2 border-r border-black font-sans">
                        {c.cargoDesc}
                      </td>
                      <td className="p-2 text-right font-bold">
                        {c.grossWeightKg.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Line Remarks & Legal Notes */}
            <div className="border border-black p-3 bg-neutral-50 text-[10px] space-y-1">
              <span className="font-bold uppercase block text-neutral-800">Line Remarks & Carrier Delivery Conditions</span>
              <p className="text-neutral-700">
                1. Please deliver the above cargo / container(s) to the consignee or their authorized clearing agent, all freight and landing dues having been settled.
              </p>
              <p className="text-neutral-700">
                2. Empty container(s) must be returned clean, dry, and undamaged to the designated container return depot within the free-time window. Demurrage and detention tariff applies automatically on expiry.
              </p>
              <p className="text-neutral-700">
                3. The carrier and shipping agency shall not be held liable for demurrage, port storage, or customs inspection delays incurred after the issuance of this delivery order.
              </p>
            </div>

            {/* Sign-offs */}
            <div className="grid grid-cols-3 gap-3 text-[10px] pt-3">
              <div className="border-t border-black pt-1">
                <span className="block font-bold">Consignee / Agent Receipt</span>
                <span className="text-neutral-500 mt-6 block">Sign: ___________________</span>
              </div>
              <div className="border-t border-black pt-1">
                <span className="block font-bold">Terminal Port Gate Officer</span>
                <span className="text-neutral-500 mt-6 block">Sign: ___________________</span>
              </div>
              <div className="border-t border-black pt-1">
                <span className="block font-bold">Authorized Shipping Line Officer</span>
                <span className="text-neutral-500 mt-6 block font-bold text-neutral-900">
                  For: {currentCompany.displayName || currentCompany.name}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-black print:hidden">
              <button
                onClick={() => setSelectedDoForPrint(null)}
                className="px-4 py-2 border border-black text-xs font-bold hover:bg-neutral-100 cursor-pointer"
              >
                Close Window
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2 bg-black text-white text-xs font-bold hover:bg-neutral-800 cursor-pointer flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Delivery Order</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
