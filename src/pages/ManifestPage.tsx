import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ImportGeneralManifest, ExportGeneralManifest, ManifestBlItem } from '../types';
import {
  FileText,
  Plus,
  Search,
  Filter,
  Ship,
  CheckCircle2,
  Clock,
  Printer,
  X,
  FileCheck2,
  BookmarkCheck,
  ShieldCheck,
  Check,
  Building2,
  Eye,
  Layers,
  ArrowRight,
  Anchor,
  FileSpreadsheet
} from 'lucide-react';

export const ManifestPage: React.FC = () => {
  const { igms, addIgm, egms, addEgm, vessels, currentCompany } = useApp();

  const [activeTab, setActiveTab] = useState<'IGM' | 'EGM'>('IGM');
  const [search, setSearch] = useState('');
  const [isIgmFormOpen, setIsIgmFormOpen] = useState(false);
  const [isEgmFormOpen, setIsEgmFormOpen] = useState(false);
  const [draftSavedMsg, setDraftSavedMsg] = useState<string | null>(null);

  // Selected manifest for detailed view & print
  const [selectedIgm, setSelectedIgm] = useState<ImportGeneralManifest | null>(null);
  const [selectedEgm, setSelectedEgm] = useState<ExportGeneralManifest | null>(null);

  // New IGM Form state
  const [igmVessel, setIgmVessel] = useState('MSC Oscar');
  const [igmVoyage, setIgmVoyage] = useState('MS-2640W');
  const [igmPort, setIgmPort] = useState('Karachi Port (KPT - East Wharf)');
  const [igmPortCode, setIgmPortCode] = useState('PKKHI');
  const [igmTerminal, setIgmTerminal] = useState('Karachi International Container Terminal (KICT)');
  const [igmCustomsStation, setIgmCustomsStation] = useState('Collectorate of Customs Appraisement (East), KPT');
  const [igmEta, setIgmEta] = useState('2026-10-18');
  const [igmBlNo, setIgmBlNo] = useState('HBL-2026-8850');
  const [igmShipper, setIgmShipper] = useState('Pacific Precision Electronics Inc.');
  const [igmConsignee, setIgmConsignee] = useState('Indus Micro Distribution Ltd, Karachi');
  const [igmGoods, setIgmGoods] = useState('Printed circuit boards, automated telemetry controllers in seaworthy export packing');
  const [igmPackages, setIgmPackages] = useState(600);
  const [igmWeight, setIgmWeight] = useState(21450);
  const [igmContainer, setIgmContainer] = useState('MSKU7829103');

  // New EGM Form state
  const [egmVessel, setEgmVessel] = useState('CMA CGM Antoine de Saint Exupery');
  const [egmVoyage, setEgmVoyage] = useState('CG-8820E');
  const [egmPort, setEgmPort] = useState('Port Muhammad Bin Qasim (QICT)');
  const [egmPortCode, setEgmPortCode] = useState('PKBQM');
  const [egmTerminal, setEgmTerminal] = useState('QICT Terminal 2');
  const [egmSailingDate, setEgmSailingDate] = useState('2026-10-20');
  const [egmBlNo, setEgmBlNo] = useState('EXP-BL-2026-0092');
  const [egmShipper, setEgmShipper] = useState('Indus Valley Basmati Rice Mills Ltd');
  const [egmConsignee, setEgmConsignee] = useState('Gulf Agro Foods LLC, Dubai, UAE');
  const [egmGoods, setEgmGoods] = useState('Super Kernel Basmati Rice 100% Sortexed Export Quality in 50KG Bags');
  const [egmPackages, setEgmPackages] = useState(1000);
  const [egmWeight, setEgmWeight] = useState(50000);
  const [egmContainer, setEgmContainer] = useState('CMAU1092831');

  const filteredIgms = igms.filter(i => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      i.igmNumber.toLowerCase().includes(q) ||
      i.vesselName.toLowerCase().includes(q) ||
      i.voyageNumber.toLowerCase().includes(q) ||
      i.portOfArrival.toLowerCase().includes(q)
    );
  });

  const filteredEgms = egms.filter(e => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      e.egmNumber.toLowerCase().includes(q) ||
      e.vesselName.toLowerCase().includes(q) ||
      e.voyageNumber.toLowerCase().includes(q) ||
      e.portOfLoading.toLowerCase().includes(q)
    );
  });

  const handleSaveDraft = (type: 'IGM' | 'EGM') => {
    const time = new Date().toLocaleTimeString();
    setDraftSavedMsg(`${type} manifest draft saved locally at ${time}`);
    setTimeout(() => setDraftSavedMsg(null), 3000);
  };

  const handleCreateIgm = (e: React.FormEvent) => {
    e.preventDefault();
    const idNum = Math.floor(1000 + Math.random() * 9000);
    const todayStr = new Date().toISOString().substring(0, 10);

    const blItem: ManifestBlItem = {
      blNumber: igmBlNo,
      lineNo: 1,
      subLineNo: 1,
      shipper: igmShipper,
      consignee: igmConsignee,
      packagesCount: Number(igmPackages),
      packageType: 'Cartons / Pallets',
      cargoDesc: igmGoods,
      grossWeightKg: Number(igmWeight),
      cbmVolume: 45.0,
      containers: [igmContainer],
      marksAndNumbers: `${igmBlNo}/01-08`
    };

    const newIgm: ImportGeneralManifest = {
      id: `igm_${Date.now()}`,
      igmNumber: `IGM-2026-KPT-${idNum}`,
      vesselName: igmVessel,
      imoNumber: '9703291',
      voyageNumber: igmVoyage,
      callSign: '3FDA9',
      shippingLine: 'Indus Magna Oceanic Lines / MSC',
      portOfArrival: igmPort,
      portCode: igmPortCode,
      terminalName: igmTerminal,
      etaDate: igmEta,
      filingDate: todayStr,
      totalBls: 1,
      totalContainers: 1,
      totalGrossWeightKg: Number(igmWeight),
      customsStation: igmCustomsStation,
      webocFilingStatus: 'Submitted',
      blItems: [blItem]
    };

    addIgm(newIgm);
    setIsIgmFormOpen(false);
    setSelectedIgm(newIgm);
  };

  const handleCreateEgm = (e: React.FormEvent) => {
    e.preventDefault();
    const idNum = Math.floor(1000 + Math.random() * 9000);
    const todayStr = new Date().toISOString().substring(0, 10);

    const blItem: ManifestBlItem = {
      blNumber: egmBlNo,
      lineNo: 1,
      subLineNo: 1,
      shipper: egmShipper,
      consignee: egmConsignee,
      packagesCount: Number(egmPackages),
      packageType: 'Jute Bags',
      cargoDesc: egmGoods,
      grossWeightKg: Number(egmWeight),
      cbmVolume: 60.0,
      containers: [egmContainer],
      marksAndNumbers: `EXP/${idNum}/PK`
    };

    const newEgm: ExportGeneralManifest = {
      id: `egm_${Date.now()}`,
      egmNumber: `EGM-2026-KPT-${idNum}`,
      vesselName: egmVessel,
      imoNumber: '9776418',
      voyageNumber: egmVoyage,
      shippingLine: 'Indus Magna Shipping Lines',
      portOfLoading: egmPort,
      portCode: egmPortCode,
      terminalName: egmTerminal,
      sailingDate: egmSailingDate,
      filingDate: todayStr,
      totalBls: 1,
      totalContainers: 1,
      totalGrossWeightKg: Number(egmWeight),
      customsStation: 'Collectorate of Customs Exports, Karachi',
      status: 'Filed',
      blItems: [blItem]
    };

    addEgm(newEgm);
    setIsEgmFormOpen(false);
    setSelectedEgm(newEgm);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto font-sans text-neutral-900 dark:text-neutral-100">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-neutral-950 text-white dark:bg-white dark:text-neutral-950">
              CUSTOMS MANIFEST COMPLIANCE
            </span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>WeBOC Electronic Interface Ready</span>
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight mt-1">
            Customs Manifest Registers (IGM & EGM)
          </h1>
          <p className="text-xs text-neutral-500 font-mono mt-0.5">
            Lodge, verify, and monitor Import General Manifests (IGM) & Export General Manifests (EGM) compliant with Pakistan Customs WeBOC & International Maritime Authorities
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'IGM' ? (
            <button
              onClick={() => setIsIgmFormOpen(!isIgmFormOpen)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-mono font-bold bg-neutral-950 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-200 dark:text-neutral-950 transition-all shadow-xs cursor-pointer"
            >
              {isIgmFormOpen ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              <span>{isIgmFormOpen ? 'Close Form' : '+ Lodge New IGM'}</span>
            </button>
          ) : (
            <button
              onClick={() => setIsEgmFormOpen(!isEgmFormOpen)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-mono font-bold bg-neutral-950 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-200 dark:text-neutral-950 transition-all shadow-xs cursor-pointer"
            >
              {isEgmFormOpen ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              <span>{isEgmFormOpen ? 'Close Form' : '+ Lodge New EGM'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-800">
        <button
          onClick={() => { setActiveTab('IGM'); setIsEgmFormOpen(false); }}
          className={`py-3 px-4 text-xs font-mono font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'IGM'
              ? 'border-neutral-950 text-neutral-950 dark:border-white dark:text-white'
              : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Import General Manifest (IGM Register)</span>
          <span className="px-1.5 py-0.5 rounded text-[10px] bg-neutral-100 dark:bg-neutral-800">
            {igms.length}
          </span>
        </button>

        <button
          onClick={() => { setActiveTab('EGM'); setIsIgmFormOpen(false); }}
          className={`py-3 px-4 text-xs font-mono font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'EGM'
              ? 'border-neutral-950 text-neutral-950 dark:border-white dark:text-white'
              : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
          }`}
        >
          <Anchor className="w-4 h-4" />
          <span>Export General Manifest (EGM Register)</span>
          <span className="px-1.5 py-0.5 rounded text-[10px] bg-neutral-100 dark:bg-neutral-800">
            {egms.length}
          </span>
        </button>
      </div>

      {draftSavedMsg && (
        <div className="p-3 bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs font-mono flex items-center justify-between text-neutral-900 dark:text-white">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold">{draftSavedMsg}</span>
          </div>
        </div>
      )}

      {/* On-Page Inline IGM Form */}
      {isIgmFormOpen && (
        <div className="rounded-xl border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-md p-5 sm:p-6 space-y-4 text-xs font-mono">
          <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
            <div className="flex items-center gap-2">
              <FileCheck2 className="w-4 h-4" />
              <h2 className="font-bold text-sm">Lodge Inward Import General Manifest (IGM)</h2>
            </div>
            <button
              onClick={() => handleSaveDraft('IGM')}
              className="px-3 py-1 rounded border border-neutral-300 dark:border-neutral-700 text-xs font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
            >
              Save as Draft
            </button>
          </div>

          <form onSubmit={handleCreateIgm} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="block text-neutral-500 mb-1">Ocean Vessel Name *</label>
                <input
                  type="text"
                  required
                  value={igmVessel}
                  onChange={e => setIgmVessel(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 font-bold"
                />
              </div>
              <div>
                <label className="block text-neutral-500 mb-1">Voyage Number *</label>
                <input
                  type="text"
                  required
                  value={igmVoyage}
                  onChange={e => setIgmVoyage(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 uppercase"
                />
              </div>
              <div>
                <label className="block text-neutral-500 mb-1">Port of Arrival (LOCODE) *</label>
                <input
                  type="text"
                  required
                  value={igmPort}
                  onChange={e => setIgmPort(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950"
                />
              </div>
              <div>
                <label className="block text-neutral-500 mb-1">Terminal Facility *</label>
                <input
                  type="text"
                  required
                  value={igmTerminal}
                  onChange={e => setIgmTerminal(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950"
                />
              </div>

              <div>
                <label className="block text-neutral-500 mb-1">Customs Station (Collectorate) *</label>
                <input
                  type="text"
                  required
                  value={igmCustomsStation}
                  onChange={e => setIgmCustomsStation(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950"
                />
              </div>
              <div>
                <label className="block text-neutral-500 mb-1">Estimated Arrival (ETA) *</label>
                <input
                  type="date"
                  required
                  value={igmEta}
                  onChange={e => setIgmEta(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950"
                />
              </div>
              <div>
                <label className="block text-neutral-500 mb-1">B/L Reference Number *</label>
                <input
                  type="text"
                  required
                  value={igmBlNo}
                  onChange={e => setIgmBlNo(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 font-bold"
                />
              </div>
              <div>
                <label className="block text-neutral-500 mb-1">Container Number *</label>
                <input
                  type="text"
                  required
                  value={igmContainer}
                  onChange={e => setIgmContainer(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 font-bold uppercase"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-neutral-500 mb-1">Shipper / Exporter Name *</label>
                <input
                  type="text"
                  required
                  value={igmShipper}
                  onChange={e => setIgmShipper(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-neutral-500 mb-1">Consignee Name & City *</label>
                <input
                  type="text"
                  required
                  value={igmConsignee}
                  onChange={e => setIgmConsignee(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-neutral-500 mb-1">Gross Cargo Weight (KG) *</label>
                <input
                  type="number"
                  required
                  value={igmWeight}
                  onChange={e => setIgmWeight(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-neutral-500 mb-1">Cargo Goods Description (Said to Contain) *</label>
                <input
                  type="text"
                  required
                  value={igmGoods}
                  onChange={e => setIgmGoods(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-neutral-200 dark:border-neutral-800">
              <button
                type="button"
                onClick={() => setIsIgmFormOpen(false)}
                className="px-4 py-2 rounded text-xs border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded text-xs font-bold bg-neutral-950 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-950"
              >
                Submit & Lodge IGM to Customs
              </button>
            </div>
          </form>
        </div>
      )}

      {/* On-Page Inline EGM Form */}
      {isEgmFormOpen && (
        <div className="rounded-xl border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-md p-5 sm:p-6 space-y-4 text-xs font-mono">
          <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
            <div className="flex items-center gap-2">
              <FileCheck2 className="w-4 h-4" />
              <h2 className="font-bold text-sm">Lodge Outward Export General Manifest (EGM)</h2>
            </div>
            <button
              onClick={() => handleSaveDraft('EGM')}
              className="px-3 py-1 rounded border border-neutral-300 dark:border-neutral-700 text-xs font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
            >
              Save as Draft
            </button>
          </div>

          <form onSubmit={handleCreateEgm} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="block text-neutral-500 mb-1">Ocean Vessel Name *</label>
                <input
                  type="text"
                  required
                  value={egmVessel}
                  onChange={e => setEgmVessel(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 font-bold"
                />
              </div>
              <div>
                <label className="block text-neutral-500 mb-1">Voyage Number *</label>
                <input
                  type="text"
                  required
                  value={egmVoyage}
                  onChange={e => setEgmVoyage(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 uppercase"
                />
              </div>
              <div>
                <label className="block text-neutral-500 mb-1">Port of Loading *</label>
                <input
                  type="text"
                  required
                  value={egmPort}
                  onChange={e => setEgmPort(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950"
                />
              </div>
              <div>
                <label className="block text-neutral-500 mb-1">Sailing Date *</label>
                <input
                  type="date"
                  required
                  value={egmSailingDate}
                  onChange={e => setEgmSailingDate(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950"
                />
              </div>

              <div>
                <label className="block text-neutral-500 mb-1">Export B/L Number *</label>
                <input
                  type="text"
                  required
                  value={egmBlNo}
                  onChange={e => setEgmBlNo(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 font-bold"
                />
              </div>
              <div>
                <label className="block text-neutral-500 mb-1">Export Container Number *</label>
                <input
                  type="text"
                  required
                  value={egmContainer}
                  onChange={e => setEgmContainer(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 font-bold uppercase"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-neutral-500 mb-1">Terminal Facility *</label>
                <input
                  type="text"
                  required
                  value={egmTerminal}
                  onChange={e => setEgmTerminal(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-neutral-500 mb-1">Pakistani Shipper / Exporter *</label>
                <input
                  type="text"
                  required
                  value={egmShipper}
                  onChange={e => setEgmShipper(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-neutral-500 mb-1">Foreign Consignee & Port of Discharge *</label>
                <input
                  type="text"
                  required
                  value={egmConsignee}
                  onChange={e => setEgmConsignee(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-neutral-500 mb-1">Gross Export Weight (KG) *</label>
                <input
                  type="number"
                  required
                  value={egmWeight}
                  onChange={e => setEgmWeight(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-neutral-500 mb-1">Cargo Description *</label>
                <input
                  type="text"
                  required
                  value={egmGoods}
                  onChange={e => setEgmGoods(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-neutral-200 dark:border-neutral-800">
              <button
                type="button"
                onClick={() => setIsEgmFormOpen(false)}
                className="px-4 py-2 rounded text-xs border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded text-xs font-bold bg-neutral-950 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-950"
              >
                Lodge EGM & Request Sailing Clearance
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-neutral-900 p-3 rounded-xl border border-neutral-200 dark:border-neutral-800">
        <div className="relative flex-1 w-full sm:w-auto">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder={`Search ${activeTab} by manifest number, vessel, voyage, port...`}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-hidden font-mono"
          />
        </div>
        <div className="text-xs font-mono text-neutral-500">
          Showing {activeTab === 'IGM' ? filteredIgms.length : filteredEgms.length} filed manifests
        </div>
      </div>

      {/* Manifest Register Tables */}
      {activeTab === 'IGM' ? (
        <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/60 font-mono text-[11px] text-neutral-500 uppercase">
                  <th className="py-3 px-4">IGM Number & Filing</th>
                  <th className="py-3 px-3">Vessel & Voyage</th>
                  <th className="py-3 px-3">Port of Arrival</th>
                  <th className="py-3 px-3">Lines / B/Ls</th>
                  <th className="py-3 px-3">Total Boxes / Weight</th>
                  <th className="py-3 px-3">Customs WeBOC Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 font-mono">
                {filteredIgms.map(i => (
                  <tr key={i.id} className="hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-neutral-900 dark:text-white">
                      <div>{i.igmNumber}</div>
                      <span className="text-[10px] text-neutral-400 font-normal">
                        Filing: {i.filingDate} · Call Sign: {i.callSign}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-neutral-900 dark:text-white">{i.vesselName}</div>
                      <span className="text-[11px] text-neutral-500 font-sans">
                        Voy: {i.voyageNumber} · IMO: {i.imoNumber}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-sans text-xs">
                      <div className="font-semibold">{i.portOfArrival}</div>
                      <span className="text-[10px] text-neutral-400 font-mono">{i.terminalName}</span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="font-bold">{i.totalBls} Manifested B/Ls</span>
                    </td>
                    <td className="py-3.5 px-3 text-[11px]">
                      <div>{i.totalContainers} Containers</div>
                      <span className="text-neutral-400 text-[10px]">
                        {(i.totalGrossWeightKg).toLocaleString()} KG
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className={`inline-block px-2.5 py-1 rounded text-[11px] font-bold ${
                        i.webocFilingStatus === 'Approved'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                      }`}>
                        {i.webocFilingStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1.5">
                      <button
                        onClick={() => setSelectedIgm(i)}
                        className="px-2.5 py-1 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-xs font-mono font-medium transition-colors cursor-pointer inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View / Print</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/60 font-mono text-[11px] text-neutral-500 uppercase">
                  <th className="py-3 px-4">EGM Number & Filing</th>
                  <th className="py-3 px-3">Vessel & Voyage</th>
                  <th className="py-3 px-3">Port of Loading</th>
                  <th className="py-3 px-3">Sailing Date</th>
                  <th className="py-3 px-3">Total Boxes / Weight</th>
                  <th className="py-3 px-3">Customs Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 font-mono">
                {filteredEgms.map(e => (
                  <tr key={e.id} className="hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-neutral-900 dark:text-white">
                      <div>{e.egmNumber}</div>
                      <span className="text-[10px] text-neutral-400 font-normal">
                        Filing: {e.filingDate}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-neutral-900 dark:text-white">{e.vesselName}</div>
                      <span className="text-[11px] text-neutral-500 font-sans">
                        Voy: {e.voyageNumber} · Line: {e.shippingLine}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-sans text-xs">
                      <div className="font-semibold">{e.portOfLoading}</div>
                      <span className="text-[10px] text-neutral-400 font-mono">{e.terminalName}</span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="font-semibold">{e.sailingDate}</span>
                    </td>
                    <td className="py-3.5 px-3 text-[11px]">
                      <div>{e.totalContainers} Containers ({e.totalBls} B/Ls)</div>
                      <span className="text-neutral-400 text-[10px]">
                        {(e.totalGrossWeightKg).toLocaleString()} KG
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="inline-block px-2.5 py-1 rounded text-[11px] font-bold bg-neutral-950 text-white dark:bg-white dark:text-neutral-950">
                        {e.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1.5">
                      <button
                        onClick={() => setSelectedEgm(e)}
                        className="px-2.5 py-1 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-xs font-mono font-medium transition-colors cursor-pointer inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View / Print</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Official IGM Document Drawer / Modal */}
      {selectedIgm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white text-black p-6 sm:p-8 rounded-lg max-w-4xl w-full border-2 border-black shadow-2xl space-y-5 font-mono print:border-none print:shadow-none print:p-0 my-auto max-h-[95vh] overflow-y-auto">
            {/* Header */}
            <div className="border-b-2 border-black pb-4 flex items-start justify-between">
              <div>
                <h1 className="text-lg sm:text-xl font-black uppercase tracking-wider">
                  {currentCompany.displayName || currentCompany.name}
                </h1>
                <div className="text-[11px] text-neutral-700">
                  Customs Agent Code: {currentCompany.nationalId || 'WeBOC IMS-77'} · {currentCompany.address}
                </div>
                <div className="text-xs font-bold text-neutral-900 mt-1 uppercase">
                  Official Inward Import General Manifest (IGM)
                </div>
              </div>
              <div className="text-right">
                <div className="border-2 border-black px-3 py-1 font-black text-sm uppercase bg-neutral-50">
                  {selectedIgm.igmNumber}
                </div>
                <span className="text-[10px] text-neutral-600 block mt-1">
                  WeBOC Status: {selectedIgm.webocFilingStatus}
                </span>
              </div>
            </div>

            {/* Vessel particulars */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs border border-black p-3 bg-neutral-50">
              <div>
                <span className="text-[10px] text-neutral-500 uppercase font-bold block">Vessel Name</span>
                <span className="font-black">{selectedIgm.vesselName}</span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-500 uppercase font-bold block">IMO / Call Sign</span>
                <span className="font-bold">{selectedIgm.imoNumber} / {selectedIgm.callSign}</span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-500 uppercase font-bold block">Voyage</span>
                <span className="font-bold">{selectedIgm.voyageNumber}</span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-500 uppercase font-bold block">Port of Arrival</span>
                <span className="font-bold">{selectedIgm.portOfArrival}</span>
              </div>
            </div>

            {/* Manifest Line Items Table */}
            <div>
              <div className="font-bold text-xs uppercase mb-2">Manifested Consignments & Line Numbers</div>
              <table className="w-full text-left text-xs border border-black">
                <thead>
                  <tr className="bg-neutral-100 border-b border-black text-[10px] uppercase">
                    <th className="p-2 border-r border-black">Line / Sub</th>
                    <th className="p-2 border-r border-black">B/L Number</th>
                    <th className="p-2 border-r border-black">Shipper & Consignee</th>
                    <th className="p-2 border-r border-black">Goods Description</th>
                    <th className="p-2 border-r border-black">Containers</th>
                    <th className="p-2 text-right">Weight (KG)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black text-[11px]">
                  {selectedIgm.blItems.map((bl, idx) => (
                    <tr key={idx}>
                      <td className="p-2 border-r border-black font-bold">
                        {bl.lineNo} / {bl.subLineNo}
                      </td>
                      <td className="p-2 border-r border-black font-bold">
                        {bl.blNumber}
                      </td>
                      <td className="p-2 border-r border-black font-sans">
                        <div className="font-bold">{bl.consignee}</div>
                        <span className="text-[10px] text-neutral-600">From: {bl.shipper}</span>
                      </td>
                      <td className="p-2 border-r border-black font-sans">
                        {bl.cargoDesc}
                        <div className="text-[10px] text-neutral-500 font-mono">Pkgs: {bl.packagesCount} {bl.packageType}</div>
                      </td>
                      <td className="p-2 border-r border-black font-mono font-bold">
                        {bl.containers.join(', ')}
                      </td>
                      <td className="p-2 text-right font-bold">
                        {bl.grossWeightKg.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Official Sign-offs */}
            <div className="grid grid-cols-2 gap-6 text-[10px] pt-4 border-t border-black">
              <div>
                <span className="font-bold block uppercase">Master / Agent Declaration</span>
                <p className="text-neutral-600 mt-1">
                  I hereby declare that this manifest contains a full, accurate, and true account of all cargo laden onboard the vessel for discharge at this port.
                </p>
                <div className="mt-6 border-t border-neutral-400 pt-1 font-bold">
                  Authorized Signatory for {currentCompany.displayName || currentCompany.name}
                </div>
              </div>
              <div>
                <span className="font-bold block uppercase">Pakistan Customs / WeBOC Endorsement</span>
                <div className="mt-8 border border-black p-2 text-center text-neutral-500">
                  [CUSTOMS ENTRY ADMITTED & EXAMINED]
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-black print:hidden">
              <button
                onClick={() => setSelectedIgm(null)}
                className="px-4 py-2 border border-black text-xs font-bold hover:bg-neutral-100 cursor-pointer"
              >
                Close Manifest
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2 bg-black text-white text-xs font-bold hover:bg-neutral-800 cursor-pointer flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official IGM Document</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Official EGM Document Drawer / Modal */}
      {selectedEgm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white text-black p-6 sm:p-8 rounded-lg max-w-4xl w-full border-2 border-black shadow-2xl space-y-5 font-mono print:border-none print:shadow-none print:p-0 my-auto max-h-[95vh] overflow-y-auto">
            {/* Header */}
            <div className="border-b-2 border-black pb-4 flex items-start justify-between">
              <div>
                <h1 className="text-lg sm:text-xl font-black uppercase tracking-wider">
                  {currentCompany.displayName || currentCompany.name}
                </h1>
                <div className="text-[11px] text-neutral-700">
                  Customs Agent Code: {currentCompany.nationalId || 'WeBOC IMS-77'} · {currentCompany.address}
                </div>
                <div className="text-xs font-bold text-neutral-900 mt-1 uppercase">
                  Official Outward Export General Manifest (EGM)
                </div>
              </div>
              <div className="text-right">
                <div className="border-2 border-black px-3 py-1 font-black text-sm uppercase bg-neutral-50">
                  {selectedEgm.egmNumber}
                </div>
                <span className="text-[10px] text-neutral-600 block mt-1">
                  Status: {selectedEgm.status}
                </span>
              </div>
            </div>

            {/* Vessel particulars */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs border border-black p-3 bg-neutral-50">
              <div>
                <span className="text-[10px] text-neutral-500 uppercase font-bold block">Vessel Name</span>
                <span className="font-black">{selectedEgm.vesselName}</span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-500 uppercase font-bold block">IMO Number</span>
                <span className="font-bold">{selectedEgm.imoNumber}</span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-500 uppercase font-bold block">Voyage</span>
                <span className="font-bold">{selectedEgm.voyageNumber}</span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-500 uppercase font-bold block">Port of Loading</span>
                <span className="font-bold">{selectedEgm.portOfLoading}</span>
              </div>
            </div>

            {/* Manifest Line Items Table */}
            <div>
              <div className="font-bold text-xs uppercase mb-2">Export Consignments Manifested For Sailing</div>
              <table className="w-full text-left text-xs border border-black">
                <thead>
                  <tr className="bg-neutral-100 border-b border-black text-[10px] uppercase">
                    <th className="p-2 border-r border-black">Line</th>
                    <th className="p-2 border-r border-black">Export B/L</th>
                    <th className="p-2 border-r border-black">Shipper & Consignee</th>
                    <th className="p-2 border-r border-black">Export Merchandise</th>
                    <th className="p-2 border-r border-black">Containers</th>
                    <th className="p-2 text-right">Weight (KG)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black text-[11px]">
                  {selectedEgm.blItems.map((bl, idx) => (
                    <tr key={idx}>
                      <td className="p-2 border-r border-black font-bold">
                        {bl.lineNo}
                      </td>
                      <td className="p-2 border-r border-black font-bold">
                        {bl.blNumber}
                      </td>
                      <td className="p-2 border-r border-black font-sans">
                        <div className="font-bold">{bl.shipper}</div>
                        <span className="text-[10px] text-neutral-600">To: {bl.consignee}</span>
                      </td>
                      <td className="p-2 border-r border-black font-sans">
                        {bl.cargoDesc}
                        <div className="text-[10px] text-neutral-500 font-mono">Pkgs: {bl.packagesCount} {bl.packageType}</div>
                      </td>
                      <td className="p-2 border-r border-black font-mono font-bold">
                        {bl.containers.join(', ')}
                      </td>
                      <td className="p-2 text-right font-bold">
                        {bl.grossWeightKg.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-black print:hidden">
              <button
                onClick={() => setSelectedEgm(null)}
                className="px-4 py-2 border border-black text-xs font-bold hover:bg-neutral-100 cursor-pointer"
              >
                Close Manifest
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2 bg-black text-white text-xs font-bold hover:bg-neutral-800 cursor-pointer flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official EGM Document</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
