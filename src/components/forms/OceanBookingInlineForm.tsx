import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Shipment, Container } from '../../types';
import {
  Ship,
  ArrowLeft,
  ArrowRight,
  Check,
  Save,
  RotateCcw,
  X,
  FileText,
  BookmarkCheck,
  AlertCircle
} from 'lucide-react';

interface Props {
  mode: 'FCL' | 'LCL';
  onClose: () => void;
}

export const OceanBookingInlineForm: React.FC<Props> = ({ mode, onClose }) => {
  const { currentCompany, addShipment, vessels } = useApp();

  const [activeTab, setActiveTab] = useState<'parties' | 'voyage' | 'cargo' | 'freight' | 'tracking'>('parties');
  const [draftSavedMessage, setDraftSavedMessage] = useState<string | null>(null);

  // Tab 1: Parties
  const [shipperName, setShipperName] = useState('Pacific Precision Electronics Inc.');
  const [shipperRef, setShipperRef] = useState('SH-REF-001');
  const [shipperEmail, setShipperEmail] = useState('shipper@pacificprecision.com');
  const [shipperPhone, setShipperPhone] = useState('+1-949-555-0199');
  const [shipperAddress, setShipperAddress] = useState('9200 Irvine Center Drive, Suite 400, Irvine, CA 92618, United States');

  const [consigneeName, setConsigneeName] = useState('Shenzhen Quantum Microelectronics Ltd.');
  const [consigneePhone, setConsigneePhone] = useState('+86-755-8839-2000');
  const [consigneeEmail, setConsigneeEmail] = useState('consignee@quantummicro.cn');
  const [consigneeTaxId, setConsigneeTaxId] = useState('CN-91440300MA5EX7');
  const [consigneeAddress, setConsigneeAddress] = useState('Tower B, Hi-Tech Industrial Park, Nanshan District, Shenzhen, China');

  const [notifySameAsConsignee, setNotifySameAsConsignee] = useState(true);
  const [notifyName, setNotifyName] = useState('');
  const [notifyPhone, setNotifyPhone] = useState('');
  const [notifyAddress, setNotifyAddress] = useState('');

  // Tab 2: Voyage
  const [carrier, setCarrier] = useState('Mediterranean Shipping Company (MSC)');
  const [vesselName, setVesselName] = useState('MSC Oscar');
  const [imoNumber, setImoNumber] = useState('9703291');
  const [voyageNo, setVoyageNo] = useState('MS-2640W');
  const [pol, setPol] = useState('Port of Los Angeles (Pier 400)');
  const [polCode, setPolCode] = useState('USLAX');
  const [pod, setPod] = useState('Port of Shanghai (Yangshan Phase IV)');
  const [podCode, setPodCode] = useState('CNSHA');
  const [placeOfReceipt, setPlaceOfReceipt] = useState('Los Angeles Harbor Pier 400');
  const [placeOfDelivery, setPlaceOfDelivery] = useState('Waigaoqiao Logistics Park / Customer Warehouse');
  const [etd, setEtd] = useState('2026-10-15');
  const [eta, setEta] = useState('2026-11-02');

  // Tab 3: Cargo Particulars
  // FCL specific
  const [containerNo, setContainerNo] = useState(`MSKU${Math.floor(1000000 + Math.random() * 9000000)}`);
  const [sealNo, setSealNo] = useState(`SL-${Math.floor(100000 + Math.random() * 900000)}`);
  const [containerType, setContainerType] = useState('40HC');
  const [containerQty, setContainerQty] = useState(1);
  const [grossWeightKg, setGrossWeightKg] = useState(21450);
  const [tareWeightKg, setTareWeightKg] = useState(3820);
  const [vgmKg, setVgmKg] = useState(25270);
  const [packagesCount, setPackagesCount] = useState('48 Pallets / 1,200 Cartons');
  const [hsCode, setHsCode] = useState('8542.31.00');
  const [cargoDesc, setCargoDesc] = useState('Printed circuit board assemblies, integrated controllers, dry cargo in seaworthy export packing.');

  // LCL specific
  const [cbmVolume, setCbmVolume] = useState(14.8);
  const [cfsOrigin, setCfsOrigin] = useState('Los Angeles Pier 400 CFS Terminal');
  const [cfsDestination, setCfsDestination] = useState('Waigaoqiao Waigaoqiao CFS #4 Depot');
  const [groupageLotNo, setGroupageLotNo] = useState('CNS-LAX-SHA-2610');
  const [marksNumbers, setMarksNumbers] = useState('PPE/SHA-LAX/01-48');

  // Tab 4: Freight
  const [freightTerms, setFreightTerms] = useState<'FREIGHT PREPAID' | 'FREIGHT COLLECT'>('FREIGHT PREPAID');
  const [freightPayableAt, setFreightPayableAt] = useState('Origin (Los Angeles, CA)');
  const [currency, setCurrency] = useState('USD');
  const [baseRate, setBaseRate] = useState(mode === 'FCL' ? 2450 : 1250);
  const [bafCharge, setBafCharge] = useState(320);
  const [thcCharge, setThcCharge] = useState(280);
  const [docFee, setDocFee] = useState(75);
  const [demurrageFreeDays, setDemurrageFreeDays] = useState(7);

  // Tab 5: Tracking & BL
  const [blType, setBlType] = useState('Negotiable FIATA Ocean House Bill of Lading');
  const [blNumber, setBlNumber] = useState(`HBL-2026-${Math.floor(1000 + Math.random() * 9000)}`);
  const [originalCount, setOriginalCount] = useState('THREE (3 / THREE)');
  const [issuePlace, setIssuePlace] = useState('Long Beach, CA');
  const [issueDate, setIssueDate] = useState('2026-10-01');
  const [signatoryName, setSignatoryName] = useState('Capt. Ethan Roberts');
  const [endorsement, setEndorsement] = useState('To Order of Shipper');
  const [carrierRemarks, setCarrierRemarks] = useState('Shipper Load, Stow & Count. Clean On Board Ocean Vessel.');

  const totalFreight = (baseRate * (mode === 'FCL' ? containerQty : 1)) + bafCharge + thcCharge + docFee;

  const handleSaveDraft = () => {
    const time = new Date().toLocaleTimeString();
    try {
      const draftData = {
        mode,
        activeTab,
        shipperName,
        shipperRef,
        shipperEmail,
        shipperPhone,
        shipperAddress,
        consigneeName,
        consigneePhone,
        consigneeEmail,
        consigneeTaxId,
        consigneeAddress,
        notifySameAsConsignee,
        carrier,
        vesselName,
        voyageNo,
        pol,
        pod,
        grossWeightKg,
        cargoDesc,
        savedAt: time
      };
      localStorage.setItem(`shiplot_draft_${mode.toLowerCase()}`, JSON.stringify(draftData));
    } catch {
      // ignore
    }
    setDraftSavedMessage(`Draft successfully saved at ${time}`);
    setTimeout(() => setDraftSavedMessage(null), 3500);
  };

  const handleNext = () => {
    if (activeTab === 'parties') setActiveTab('voyage');
    else if (activeTab === 'voyage') setActiveTab('cargo');
    else if (activeTab === 'cargo') setActiveTab('freight');
    else if (activeTab === 'freight') setActiveTab('tracking');
  };

  const handlePrevious = () => {
    if (activeTab === 'tracking') setActiveTab('freight');
    else if (activeTab === 'freight') setActiveTab('cargo');
    else if (activeTab === 'cargo') setActiveTab('voyage');
    else if (activeTab === 'voyage') setActiveTab('parties');
  };

  const handleReset = () => {
    setShipperName('');
    setShipperRef('');
    setShipperEmail('');
    setShipperPhone('');
    setShipperAddress('');
    setConsigneeName('');
    setConsigneePhone('');
    setConsigneeEmail('');
    setConsigneeTaxId('');
    setConsigneeAddress('');
    setNotifySameAsConsignee(true);
    setCargoDesc('');
  };

  const handleCreateShipment = (e: React.FormEvent) => {
    e.preventDefault();

    const shipmentIdNum = Math.floor(1000 + Math.random() * 9000);
    const newShipment: Shipment = {
      id: `shp_${Date.now()}`,
      shipmentNo: `SHP-2026-${shipmentIdNum}`,
      bookingNo: shipperRef || `BKG-${shipmentIdNum}`,
      type: mode,
      direction: 'Export',
      shipper: shipperName || 'Pacific Precision Electronics Inc.',
      consignee: consigneeName || 'Shenzhen Quantum Microelectronics Ltd.',
      pol,
      polCode: polCode || 'USLAX',
      pod,
      podCode: podCode || 'CNSHA',
      carrier,
      vesselName,
      voyageNo,
      etd,
      eta,
      status: 'Booking Confirmed',
      containersCount: mode === 'FCL' ? containerQty : 1,
      weightKg: Number(grossWeightKg),
      cbmVolume: mode === 'LCL' ? Number(cbmVolume) : undefined,
      cargoDesc
    };

    addShipment(newShipment);
    onClose();
  };

  return (
    <div className="rounded-xl border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-md overflow-hidden transition-all text-neutral-900 dark:text-neutral-100 font-sans">
      
      {/* Top Banner (Pure Black & White) */}
      <div className="bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 px-5 py-3.5 flex items-center justify-between border-b border-neutral-900 dark:border-neutral-200">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded bg-white text-neutral-950 dark:bg-neutral-950 dark:text-white flex items-center justify-center font-bold">
            <Ship className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-bold text-sm sm:text-base tracking-tight font-mono">
              {currentCompany.name.replace(' (NVOCC)', '')} — Bill of Lading & Ocean Booking ({mode})
            </h2>
            <p className="text-[11px] text-neutral-400 dark:text-neutral-600 font-mono">
              Direct On-Page Consignment Entry · FMC Tariff Compliant
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Save as Draft on top bar */}
          <button
            type="button"
            onClick={handleSaveDraft}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-semibold bg-neutral-800 hover:bg-neutral-700 text-white dark:bg-neutral-100 dark:hover:bg-neutral-200 dark:text-neutral-950 border border-neutral-700 dark:border-neutral-300 transition-colors cursor-pointer"
            title="Save draft progress"
          >
            <BookmarkCheck className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Save Draft</span>
          </button>

          <button
            onClick={onClose}
            className="p-1.5 rounded hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors text-white dark:text-neutral-950 flex items-center gap-1 text-xs font-mono"
            title="Close Form and return to list"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Toast Alert when Draft is Saved */}
      {draftSavedMessage && (
        <div className="bg-neutral-100 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 px-5 py-2 text-xs font-mono flex items-center justify-between text-neutral-900 dark:text-white">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-neutral-900 dark:text-white" />
            <span className="font-semibold">{draftSavedMessage}</span>
          </div>
          <span className="text-[10px] text-neutral-500">Stored locally in session</span>
        </div>
      )}

      {/* 5 Tabs Bar (Black & White) */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/60 px-5 flex items-center justify-between overflow-x-auto text-xs">
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setActiveTab('parties')}
            className={`py-3 px-4 border-b-2 font-mono transition-colors whitespace-nowrap ${
              activeTab === 'parties'
                ? 'border-neutral-950 text-neutral-950 dark:border-white dark:text-white font-bold'
                : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            1. Parties
          </button>
          <button
            onClick={() => setActiveTab('voyage')}
            className={`py-3 px-4 border-b-2 font-mono transition-colors whitespace-nowrap ${
              activeTab === 'voyage'
                ? 'border-neutral-950 text-neutral-950 dark:border-white dark:text-white font-bold'
                : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            2. Voyage
          </button>
          <button
            onClick={() => setActiveTab('cargo')}
            className={`py-3 px-4 border-b-2 font-mono transition-colors whitespace-nowrap ${
              activeTab === 'cargo'
                ? 'border-neutral-950 text-neutral-950 dark:border-white dark:text-white font-bold'
                : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            3. Cargo
          </button>
          <button
            onClick={() => setActiveTab('freight')}
            className={`py-3 px-4 border-b-2 font-mono transition-colors whitespace-nowrap ${
              activeTab === 'freight'
                ? 'border-neutral-950 text-neutral-950 dark:border-white dark:text-white font-bold'
                : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            4. Freight
          </button>
          <button
            onClick={() => setActiveTab('tracking')}
            className={`py-3 px-4 border-b-2 font-mono transition-colors whitespace-nowrap ${
              activeTab === 'tracking'
                ? 'border-neutral-950 text-neutral-950 dark:border-white dark:text-white font-bold'
                : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            5. Tracking & BL
          </button>
        </div>

        {/* In-tab Draft indicator */}
        <button
          type="button"
          onClick={handleSaveDraft}
          className="text-[11px] font-mono font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white underline py-2 flex items-center gap-1 cursor-pointer shrink-0 ml-3"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save this step as draft</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="p-5 sm:p-6 text-xs space-y-6 bg-white dark:bg-neutral-900">
        
        {/* TAB 1: PARTIES */}
        {activeTab === 'parties' && (
          <div className="space-y-6">
            {/* Shipper / Exporter Section Bar */}
            <div className="space-y-3">
              <div className="bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950 px-3.5 py-1.5 rounded font-mono font-bold text-xs uppercase tracking-wider">
                Shipper / Exporter
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="sm:col-span-1">
                  <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1 font-mono">
                    Shipper Name <span className="text-neutral-900 dark:text-white font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Company or person name"
                    value={shipperName}
                    onChange={e => setShipperName(e.target.value)}
                    className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-hidden focus:border-neutral-950 dark:focus:border-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1 font-mono">
                    Shipper Reference No
                  </label>
                  <input
                    type="text"
                    placeholder="SH-REF-001"
                    value={shipperRef}
                    onChange={e => setShipperRef(e.target.value)}
                    className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-hidden focus:border-neutral-950 dark:focus:border-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1 font-mono">
                    Shipper Email <span className="text-neutral-900 dark:text-white font-bold">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="shipper@example.com"
                    value={shipperEmail}
                    onChange={e => setShipperEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-hidden focus:border-neutral-950 dark:focus:border-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1 font-mono">
                    Shipper Phone
                  </label>
                  <input
                    type="text"
                    placeholder="+92-XXX-XXXXXXX"
                    value={shipperPhone}
                    onChange={e => setShipperPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-hidden focus:border-neutral-950 dark:focus:border-white font-mono"
                  />
                </div>
                <div className="sm:col-span-2 lg:col-span-4">
                  <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1 font-mono">
                    Shipper Address
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Full address with city, country"
                    value={shipperAddress}
                    onChange={e => setShipperAddress(e.target.value)}
                    className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-hidden focus:border-neutral-950 dark:focus:border-white font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Consignee / Receiver Section Bar */}
            <div className="space-y-3">
              <div className="bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950 px-3.5 py-1.5 rounded font-mono font-bold text-xs uppercase tracking-wider">
                Consignee / Receiver
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1 font-mono">
                    Consignee Name <span className="text-neutral-900 dark:text-white font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Company or person name"
                    value={consigneeName}
                    onChange={e => setConsigneeName(e.target.value)}
                    className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-hidden focus:border-neutral-950 dark:focus:border-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1 font-mono">
                    Consignee Phone
                  </label>
                  <input
                    type="text"
                    placeholder="+971-XXX-XXXXXXX"
                    value={consigneePhone}
                    onChange={e => setConsigneePhone(e.target.value)}
                    className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-hidden focus:border-neutral-950 dark:focus:border-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1 font-mono">
                    Consignee Email
                  </label>
                  <input
                    type="email"
                    placeholder="consignee@example.com"
                    value={consigneeEmail}
                    onChange={e => setConsigneeEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-hidden focus:border-neutral-950 dark:focus:border-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1 font-mono">
                    Consignee Tax / VAT ID
                  </label>
                  <input
                    type="text"
                    placeholder="Tax or company reg no"
                    value={consigneeTaxId}
                    onChange={e => setConsigneeTaxId(e.target.value)}
                    className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-hidden focus:border-neutral-950 dark:focus:border-white font-mono"
                  />
                </div>
                <div className="sm:col-span-2 lg:col-span-4">
                  <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1 font-mono">
                    Consignee Address <span className="text-neutral-900 dark:text-white font-bold">*</span>
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Full delivery address"
                    value={consigneeAddress}
                    onChange={e => setConsigneeAddress(e.target.value)}
                    className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-hidden focus:border-neutral-950 dark:focus:border-white font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Notify Party Section Bar */}
            <div className="space-y-3">
              <div className="bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950 px-3.5 py-1.5 rounded font-mono font-bold text-xs uppercase tracking-wider">
                Notify Party
              </div>

              {/* Toggle switch (Black & White) */}
              <div className="flex items-start gap-3 p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/40">
                <button
                  type="button"
                  onClick={() => setNotifySameAsConsignee(!notifySameAsConsignee)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer shrink-0 ${
                    notifySameAsConsignee
                      ? 'bg-neutral-950 dark:bg-white justify-end'
                      : 'bg-neutral-300 dark:bg-neutral-700 justify-start'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full transition-transform ${
                      notifySameAsConsignee ? 'bg-white dark:bg-neutral-950' : 'bg-white'
                    }`}
                  />
                </button>
                <div>
                  <span className="font-bold text-xs text-neutral-900 dark:text-white font-mono">
                    Notify Party same as consignee
                  </span>
                  <p className="text-[11px] text-neutral-500 font-sans mt-0.5">
                    When enabled, the notify party fields are hidden and the notify party details will mirror the consignee details.
                  </p>
                </div>
              </div>

              {!notifySameAsConsignee && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1 font-mono">
                      Notify Party Name
                    </label>
                    <input
                      type="text"
                      placeholder="Company or agent name"
                      value={notifyName}
                      onChange={e => setNotifyName(e.target.value)}
                      className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1 font-mono">
                      Notify Party Phone
                    </label>
                    <input
                      type="text"
                      placeholder="+XX-XXX-XXXXXXX"
                      value={notifyPhone}
                      onChange={e => setNotifyPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white font-mono"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1 font-mono">
                      Notify Party Address
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Full notify address"
                      value={notifyAddress}
                      onChange={e => setNotifyAddress(e.target.value)}
                      className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white font-mono"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: VOYAGE */}
        {activeTab === 'voyage' && (
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950 px-3.5 py-1.5 rounded font-mono font-bold text-xs uppercase tracking-wider">
                Vessel & Ocean Carrier Details
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1 font-mono">
                    Ocean Carrier Line <span className="text-neutral-900 dark:text-white font-bold">*</span>
                  </label>
                  <select
                    value={carrier}
                    onChange={e => setCarrier(e.target.value)}
                    className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white font-mono"
                  >
                    <option value="Mediterranean Shipping Company (MSC)">MSC</option>
                    <option value="Maersk Line">Maersk Line</option>
                    <option value="CMA CGM">CMA CGM</option>
                    <option value="Ocean Network Express (ONE)">ONE Line</option>
                    <option value="Hapag-Lloyd">Hapag-Lloyd</option>
                    <option value="Evergreen Marine">Evergreen Marine</option>
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1 font-mono">
                    Ocean Vessel Name <span className="text-neutral-900 dark:text-white font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. MSC Oscar"
                    value={vesselName}
                    onChange={e => setVesselName(e.target.value)}
                    className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1 font-mono">
                    Vessel IMO Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 9703291"
                    value={imoNumber}
                    onChange={e => setImoNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1 font-mono">
                    Voyage Number <span className="text-neutral-900 dark:text-white font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. MS-2640W"
                    value={voyageNo}
                    onChange={e => setVoyageNo(e.target.value)}
                    className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950 px-3.5 py-1.5 rounded font-mono font-bold text-xs uppercase tracking-wider">
                Port Routing & Transit Schedule
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1 font-mono">
                    Port of Loading (POL) <span className="text-neutral-900 dark:text-white font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    value={pol}
                    onChange={e => setPol(e.target.value)}
                    className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1 font-mono">
                    POL LOCODE <span className="text-neutral-900 dark:text-white font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    value={polCode}
                    onChange={e => setPolCode(e.target.value)}
                    className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white uppercase font-mono"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1 font-mono">
                    Port of Discharge (POD) <span className="text-neutral-900 dark:text-white font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    value={pod}
                    onChange={e => setPod(e.target.value)}
                    className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1 font-mono">
                    POD LOCODE <span className="text-neutral-900 dark:text-white font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    value={podCode}
                    onChange={e => setPodCode(e.target.value)}
                    className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white uppercase font-mono"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1 font-mono">
                    Place of Receipt
                  </label>
                  <input
                    type="text"
                    value={placeOfReceipt}
                    onChange={e => setPlaceOfReceipt(e.target.value)}
                    className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1 font-mono">
                    Place of Delivery
                  </label>
                  <input
                    type="text"
                    value={placeOfDelivery}
                    onChange={e => setPlaceOfDelivery(e.target.value)}
                    className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1 font-mono">
                    Departure Date (ETD) <span className="text-neutral-900 dark:text-white font-bold">*</span>
                  </label>
                  <input
                    type="date"
                    value={etd}
                    onChange={e => setEtd(e.target.value)}
                    className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1 font-mono">
                    Arrival Date (ETA) <span className="text-neutral-900 dark:text-white font-bold">*</span>
                  </label>
                  <input
                    type="date"
                    value={eta}
                    onChange={e => setEta(e.target.value)}
                    className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CARGO */}
        {activeTab === 'cargo' && (
          <div className="space-y-6">
            {mode === 'FCL' ? (
              <>
                <div className="space-y-3">
                  <div className="bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950 px-3.5 py-1.5 rounded font-mono font-bold text-xs uppercase tracking-wider">
                    FCL Equipment & Container Identification
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1 font-mono">
                        Container Number <span className="text-neutral-900 dark:text-white font-bold">*</span>
                      </label>
                      <input
                        type="text"
                        value={containerNo}
                        onChange={e => setContainerNo(e.target.value)}
                        className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white uppercase font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1 font-mono">
                        Seal Number <span className="text-neutral-900 dark:text-white font-bold">*</span>
                      </label>
                      <input
                        type="text"
                        value={sealNo}
                        onChange={e => setSealNo(e.target.value)}
                        className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1 font-mono">
                        ISO Container Type <span className="text-neutral-900 dark:text-white font-bold">*</span>
                      </label>
                      <select
                        value={containerType}
                        onChange={e => setContainerType(e.target.value)}
                        className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white font-mono"
                      >
                        <option value="40HC">40' High Cube (40HC)</option>
                        <option value="20GP">20' General Purpose (20GP)</option>
                        <option value="40GP">40' Standard Dry (40GP)</option>
                        <option value="40RF">40' Temperature Reefer (40RF)</option>
                        <option value="45HC">45' High Cube Palletwide</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1 font-mono">
                        Total Box Quantity <span className="text-neutral-900 dark:text-white font-bold">*</span>
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={20}
                        value={containerQty}
                        onChange={e => setContainerQty(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950 px-3.5 py-1.5 rounded font-mono font-bold text-xs uppercase tracking-wider">
                    Weights, SOLAS VGM & Cargo Description
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1 font-mono">
                        Gross Weight (KG) <span className="text-neutral-900 dark:text-white font-bold">*</span>
                      </label>
                      <input
                        type="number"
                        value={grossWeightKg}
                        onChange={e => {
                          const val = Number(e.target.value);
                          setGrossWeightKg(val);
                          setVgmKg(val + tareWeightKg);
                        }}
                        className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1 font-mono">
                        Tare Weight (KG)
                      </label>
                      <input
                        type="number"
                        value={tareWeightKg}
                        onChange={e => {
                          const val = Number(e.target.value);
                          setTareWeightKg(val);
                          setVgmKg(grossWeightKg + val);
                        }}
                        className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1 font-mono">
                        Verified Gross Mass (VGM KG) <span className="text-neutral-900 dark:text-white font-bold">*</span>
                      </label>
                      <input
                        type="number"
                        value={vgmKg}
                        onChange={e => setVgmKg(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1 font-mono">
                        HS Tariff Code
                      </label>
                      <input
                        type="text"
                        value={hsCode}
                        onChange={e => setHsCode(e.target.value)}
                        className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white font-mono"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1 font-mono">
                        Total Packages (Qty & Type) <span className="text-neutral-900 dark:text-white font-bold">*</span>
                      </label>
                      <input
                        type="text"
                        value={packagesCount}
                        onChange={e => setPackagesCount(e.target.value)}
                        className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white font-mono"
                      />
                    </div>

                    <div className="sm:col-span-2 lg:col-span-4">
                      <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1 font-mono">
                        Cargo Goods Description (Said to Contain) <span className="text-neutral-900 dark:text-white font-bold">*</span>
                      </label>
                      <textarea
                        rows={2}
                        value={cargoDesc}
                        onChange={e => setCargoDesc(e.target.value)}
                        className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white font-mono"
                      />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              /* LCL Specific Cargo Form */
              <>
                <div className="space-y-3">
                  <div className="bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950 px-3.5 py-1.5 rounded font-mono font-bold text-xs uppercase tracking-wider">
                    LCL Consolidation Volume & CFS Groupage
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1 font-mono">
                        Consolidation Volume (CBM / m³) <span className="text-neutral-900 dark:text-white font-bold">*</span>
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={cbmVolume}
                        onChange={e => setCbmVolume(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1 font-mono">
                        Gross Weight (KG) <span className="text-neutral-900 dark:text-white font-bold">*</span>
                      </label>
                      <input
                        type="number"
                        value={grossWeightKg}
                        onChange={e => setGrossWeightKg(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1 font-mono">
                        Packages & Packing Type <span className="text-neutral-900 dark:text-white font-bold">*</span>
                      </label>
                      <input
                        type="text"
                        value={packagesCount}
                        onChange={e => setPackagesCount(e.target.value)}
                        className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1 font-mono">
                        Origin CFS Packing Facility <span className="text-neutral-900 dark:text-white font-bold">*</span>
                      </label>
                      <input
                        type="text"
                        value={cfsOrigin}
                        onChange={e => setCfsOrigin(e.target.value)}
                        className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1 font-mono">
                        Destination CFS Hub <span className="text-neutral-900 dark:text-white font-bold">*</span>
                      </label>
                      <input
                        type="text"
                        value={cfsDestination}
                        onChange={e => setCfsDestination(e.target.value)}
                        className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1 font-mono">
                        Groupage Lot Reference
                      </label>
                      <input
                        type="text"
                        value={groupageLotNo}
                        onChange={e => setGroupageLotNo(e.target.value)}
                        className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white font-mono"
                      />
                    </div>
                    <div className="sm:col-span-2 lg:col-span-3">
                      <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1 font-mono">
                        Shipping Marks & Numbers
                      </label>
                      <input
                        type="text"
                        value={marksNumbers}
                        onChange={e => setMarksNumbers(e.target.value)}
                        className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white font-mono"
                      />
                    </div>
                    <div className="sm:col-span-2 lg:col-span-3">
                      <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1 font-mono">
                        LCL Cargo Goods Description (Said to Contain) <span className="text-neutral-900 dark:text-white font-bold">*</span>
                      </label>
                      <textarea
                        rows={2}
                        value={cargoDesc}
                        onChange={e => setCargoDesc(e.target.value)}
                        className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white font-mono"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* TAB 4: FREIGHT */}
        {activeTab === 'freight' && (
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950 px-3.5 py-1.5 rounded font-mono font-bold text-xs uppercase tracking-wider">
                Freight Commercial Terms & Charges
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1 font-mono">
                    Payment Terms <span className="text-neutral-900 dark:text-white font-bold">*</span>
                  </label>
                  <select
                    value={freightTerms}
                    onChange={e => setFreightTerms(e.target.value as any)}
                    className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white font-mono font-bold"
                  >
                    <option value="FREIGHT PREPAID">FREIGHT PREPAID</option>
                    <option value="FREIGHT COLLECT">FREIGHT COLLECT</option>
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1 font-mono">
                    Freight Payable At
                  </label>
                  <input
                    type="text"
                    value={freightPayableAt}
                    onChange={e => setFreightPayableAt(e.target.value)}
                    className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1 font-mono">
                    Billing Currency
                  </label>
                  <select
                    value={currency}
                    onChange={e => setCurrency(e.target.value)}
                    className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white font-mono"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="AED">AED (د.إ)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="CNY">CNY (¥)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1 font-mono">
                    Demurrage Free Days
                  </label>
                  <input
                    type="number"
                    value={demurrageFreeDays}
                    onChange={e => setDemurrageFreeDays(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1 font-mono">
                    Base Ocean Freight ({currency}) <span className="text-neutral-900 dark:text-white font-bold">*</span>
                  </label>
                  <input
                    type="number"
                    value={baseRate}
                    onChange={e => setBaseRate(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1 font-mono">
                    Bunker Factor (BAF)
                  </label>
                  <input
                    type="number"
                    value={bafCharge}
                    onChange={e => setBafCharge(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1 font-mono">
                    Terminal Handling (THC)
                  </label>
                  <input
                    type="number"
                    value={thcCharge}
                    onChange={e => setThcCharge(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1 font-mono">
                    Documentation Fee
                  </label>
                  <input
                    type="number"
                    value={docFee}
                    onChange={e => setDocFee(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              {/* Total Freight Box (Monochrome) */}
              <div className="p-4 rounded-lg border border-neutral-950 dark:border-neutral-200 bg-neutral-50 dark:bg-neutral-950/60 flex items-center justify-between font-mono mt-3">
                <div>
                  <span className="text-xs text-neutral-500 block">Total Freight Charges:</span>
                  <span className="text-2xl font-bold text-neutral-950 dark:text-white">
                    ${totalFreight.toLocaleString()} {currency}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-neutral-500 block">Status:</span>
                  <span className="text-xs font-bold text-neutral-900 dark:text-white uppercase">
                    {freightTerms}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: TRACKING & BL */}
        {activeTab === 'tracking' && (
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950 px-3.5 py-1.5 rounded font-mono font-bold text-xs uppercase tracking-wider">
                Bill of Lading Profile & FMC Documentation
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1 font-mono">
                    Document Type <span className="text-neutral-900 dark:text-white font-bold">*</span>
                  </label>
                  <select
                    value={blType}
                    onChange={e => setBlType(e.target.value)}
                    className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white font-mono"
                  >
                    <option value="Negotiable FIATA Ocean House Bill of Lading">Negotiable FIATA House B/L (HBL)</option>
                    <option value="Non-Negotiable Sea Waybill">Non-Negotiable Sea Waybill</option>
                    <option value="Express Release Ocean B/L">Express Release Ocean B/L</option>
                    <option value="Master Ocean Bill of Lading">Master Ocean Bill of Lading (MBL)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1 font-mono">
                    House B/L Number <span className="text-neutral-900 dark:text-white font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    value={blNumber}
                    onChange={e => setBlNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1 font-mono">
                    Number of Original B/Ls
                  </label>
                  <input
                    type="text"
                    value={originalCount}
                    onChange={e => setOriginalCount(e.target.value)}
                    className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1 font-mono">
                    Place of Issue
                  </label>
                  <input
                    type="text"
                    value={issuePlace}
                    onChange={e => setIssuePlace(e.target.value)}
                    className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1 font-mono">
                    Date of Issue
                  </label>
                  <input
                    type="date"
                    value={issueDate}
                    onChange={e => setIssueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1 font-mono">
                    Authorized Signatory
                  </label>
                  <input
                    type="text"
                    value={signatoryName}
                    onChange={e => setSignatoryName(e.target.value)}
                    className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white font-mono"
                  />
                </div>
                <div className="sm:col-span-2 lg:col-span-3">
                  <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1 font-mono">
                    Carrier Endorsements & Custom Remarks
                  </label>
                  <textarea
                    rows={2}
                    value={carrierRemarks}
                    onChange={e => setCarrierRemarks(e.target.value)}
                    className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Action Controls (Black & White with Save as Draft on EVERY tab) */}
      <div className="border-t border-neutral-200 dark:border-neutral-800 px-5 py-3.5 bg-neutral-50 dark:bg-neutral-950/80 flex flex-wrap items-center justify-between gap-3">
        <div>
          <button
            type="button"
            disabled={activeTab === 'parties'}
            onClick={handlePrevious}
            className={`px-4 py-2 rounded text-xs font-mono font-semibold border transition-colors ${
              activeTab === 'parties'
                ? 'border-neutral-200 text-neutral-300 dark:border-neutral-800 dark:text-neutral-700 cursor-not-allowed'
                : 'border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-800'
            }`}
          >
            ← Previous
          </button>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleReset}
            className="px-3.5 py-2 rounded text-xs font-mono font-medium border border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            Reset
          </button>

          {/* Save as Draft Button on EVERY tab */}
          <button
            type="button"
            onClick={handleSaveDraft}
            className="flex items-center gap-1.5 px-4 py-2 rounded text-xs font-mono font-bold border-2 border-neutral-900 dark:border-white text-neutral-950 dark:text-white bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer shadow-xs"
          >
            <BookmarkCheck className="w-3.5 h-3.5" />
            <span>Save as Draft</span>
          </button>

          {activeTab !== 'tracking' ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-1.5 px-5 py-2 rounded text-xs font-mono font-bold bg-neutral-950 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-200 dark:text-neutral-950 transition-colors cursor-pointer shadow-xs"
            >
              <span>Next</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleCreateShipment}
              className="flex items-center gap-1.5 px-5 py-2 rounded text-xs font-mono font-bold bg-neutral-950 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-200 dark:text-neutral-950 transition-colors cursor-pointer shadow-sm"
            >
              <Check className="w-4 h-4" />
              <span>Create Shipment</span>
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="px-3 py-2 text-xs font-mono text-neutral-500 hover:text-neutral-950 dark:hover:text-white transition-colors cursor-pointer ml-1"
          >
            Close
          </button>
        </div>
      </div>

    </div>
  );
};
