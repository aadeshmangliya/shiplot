import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Booking, Shipment } from '../../types';
import {
  Boxes,
  Warehouse,
  ArrowLeft,
  ArrowRight,
  Check,
  Save,
  RotateCcw,
  X,
  FileText,
  BookmarkCheck,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Anchor,
  Compass,
  DollarSign,
  Layers,
  Scale,
  Plus,
  Trash2,
  Building2,
  User,
  Phone,
  Mail,
  MapPin,
  Clock,
  Package,
  Layers3,
  Calculator,
  ShieldCheck,
  FileCheck2
} from 'lucide-react';

interface LclBookingFormProps {
  onClose?: () => void;
  onBookingCreated?: (booking: Booking) => void;
}

interface CargoPieceItem {
  id: string;
  description: string;
  packageType: string;
  quantity: number;
  lengthCm: number;
  widthCm: number;
  heightCm: number;
  grossWeightKg: number;
}

export const LclBookingForm: React.FC<LclBookingFormProps> = ({ onClose, onBookingCreated }) => {
  const { currentCompany, addBooking, addShipment, addAuditLog, currentUser, vessels } = useApp();

  type LclTab = 'parties' | 'cfs' | 'dimensions' | 'groupage' | 'freight';
  const [activeTab, setActiveTab] = useState<LclTab>('parties');
  const [draftSavedMessage, setDraftSavedMessage] = useState<string | null>(null);
  const [bookingSubmitted, setBookingSubmitted] = useState<Booking | null>(null);

  // ==========================================
  // TAB 1: COMMERCIAL PARTIES & CO-LOAD
  // ==========================================
  const [bookingNo, setBookingNo] = useState(`LCL-BK-2026-${Math.floor(1000 + Math.random() * 9000)}`);
  const [requestDate, setRequestDate] = useState(new Date().toISOString().substring(0, 10));
  const [shipperRef, setShipperRef] = useState('PO-LCL-88190');
  const [coLoaderRef, setCoLoaderRef] = useState('COL-VANGUARD-0412');
  const [quotationRef, setQuotationRef] = useState('QTN-LCL-SHA-5501');
  const [tradeLane, setTradeLane] = useState('Far East - Subcontinent & Gulf');

  // Shipper Details
  const [shipperName, setShipperName] = useState('Apex Industrial Hardware Exports Ltd.');
  const [shipperTaxId, setShipperTaxId] = useState('NTN #4129840-3');
  const [shipperContact, setShipperContact] = useState('Rashid Mehmood (Shipping Officer)');
  const [shipperPhone, setShipperPhone] = useState('+92-21-3568-1122');
  const [shipperEmail, setShipperEmail] = useState('exports@apexhardware.com');
  const [shipperAddress, setShipperAddress] = useState('Plot 44, Sector 15, Korangi Industrial Area');
  const [shipperCity, setShipperCity] = useState('Karachi');
  const [shipperCountry, setShipperCountry] = useState('Pakistan');

  // Consignee Details
  const [consigneeName, setConsigneeName] = useState('Al-Futtaim Engineering & Logistics LLC');
  const [consigneeTaxId, setConsigneeTaxId] = useState('TRN-100294819200003');
  const [consigneeContact, setConsigneeContact] = useState('Tariq Al-Mansoor (Materials Controller)');
  const [consigneePhone, setConsigneePhone] = useState('+971-4-295-8800');
  const [consigneeEmail, setConsigneeEmail] = useState('inbound@alfuttaim-eng.ae');
  const [consigneeAddress, setConsigneeAddress] = useState('Al-Qusais Industrial Area 2, PO Box 1284, Dubai, UAE');

  // Notify Party
  const [notifySameAsConsignee, setNotifySameAsConsignee] = useState(true);
  const [notifyName, setNotifyName] = useState('Gulf Clearing & Freight Forwarding Agency');
  const [notifyAddress, setNotifyAddress] = useState('Cargo Village Building A, Dubai Airport Freezone, UAE');
  const [notifyPhone, setNotifyPhone] = useState('+971-4-282-4411');

  // ==========================================
  // TAB 2: CFS DEPOTS & CONSOLIDATION SCHEDULE
  // ==========================================
  const [cfsOrigin, setCfsOrigin] = useState('KICT Bonded CFS Warehouse (Terminal Gate 2, Karachi)');
  const [cfsOriginBay, setCfsOriginBay] = useState('Receiving Bay #04 (LCL Export Consolidation)');
  const [cfsDestination, setCfsDestination] = useState('Jebel Ali CFS De-consolidation Hub #1 (South Zone, Dubai)');

  const [pol, setPol] = useState('Port of Karachi (KICT)');
  const [polCode, setPolCode] = useState('PKKHI');
  const [pod, setPod] = useState('Port of Jebel Ali (Terminal 1)');
  const [podCode, setPodCode] = useState('AEJEA');

  const [vesselName, setVesselName] = useState('MSC Oscar');
  const [imoNumber, setImoNumber] = useState('9703291');
  const [voyageNo, setVoyageNo] = useState('MS-2640W');
  const [carrier, setCarrier] = useState('Mediterranean Shipping Company (MSC)');

  const [cargoDeliveryDate, setCargoDeliveryDate] = useState('2026-10-14');
  const [cfsCutOff, setCfsCutOff] = useState('2026-10-15 16:00');
  const [etd, setEtd] = useState('2026-10-17');
  const [eta, setEta] = useState('2026-10-21');
  const [destripDate, setDestripDate] = useState('2026-10-22 09:00');

  // ==========================================
  // TAB 3: CARGO PIECES, DIMENSIONS & REVENUE TONS (W/M)
  // ==========================================
  const [cargoItems, setCargoItems] = useState<CargoPieceItem[]>([
    {
      id: 'item_1',
      description: 'Precision Stainless Steel Valve Fittings & Flanges',
      packageType: 'Wooden Crates (ISPM-15)',
      quantity: 12,
      lengthCm: 120,
      widthCm: 80,
      heightCm: 90,
      grossWeightKg: 1800
    },
    {
      id: 'item_2',
      description: 'Brass Coupling Joints & Pressure Regulators',
      packageType: 'Heavy Cartons on Pallets',
      quantity: 16,
      lengthCm: 100,
      widthCm: 100,
      heightCm: 110,
      grossWeightKg: 2240
    }
  ]);

  const [shippingMarks, setShippingMarks] = useState('APEX/DXB/2026/01-28 · MADE IN PAKISTAN · HANDLE WITH CARE');
  const [hsCode, setHsCode] = useState('8481.80.30');
  const [isStackable, setIsStackable] = useState(true);
  const [isDangerousGoods, setIsDangerousGoods] = useState(false);
  const [dgDetails, setDgDetails] = useState('');
  const [forkliftRequired, setForkliftRequired] = useState(true);

  // Auto-calculated Dimensions
  const totalPackagesCount = cargoItems.reduce((sum, item) => sum + item.quantity, 0);

  // Calculate individual and total CBM: L * W * H / 1,000,000 * Qty
  const totalVolumeCbm = parseFloat(
    cargoItems.reduce((sum, item) => {
      const singleItemCbm = (item.lengthCm * item.widthCm * item.heightCm) / 1000000;
      return sum + singleItemCbm * item.quantity;
    }, 0).toFixed(3)
  );

  const totalGrossWeightKg = cargoItems.reduce((sum, item) => sum + item.grossWeightKg, 0);
  const totalGrossWeightMt = parseFloat((totalGrossWeightKg / 1000).toFixed(3));

  // Maritime Revenue Ton (W/M) Calculation: Greater of (Volume in CBM vs Weight in Metric Tons)
  const revenueTons = Math.max(totalVolumeCbm, totalGrossWeightMt);
  const revenueTonBasis = totalVolumeCbm >= totalGrossWeightMt ? 'Measurement (CBM)' : 'Weight (MT)';

  // Add Item Line
  const addCargoItem = () => {
    setCargoItems(prev => [
      ...prev,
      {
        id: `item_${Date.now()}`,
        description: 'Spare Parts & Accessories in Export Cartons',
        packageType: 'Cartons',
        quantity: 10,
        lengthCm: 60,
        widthCm: 40,
        heightCm: 40,
        grossWeightKg: 250
      }
    ]);
  };

  // Remove Item Line
  const removeCargoItem = (id: string) => {
    if (cargoItems.length <= 1) return;
    setCargoItems(prev => prev.filter(i => i.id !== id));
  };

  // ==========================================
  // TAB 4: GROUPAGE LOT & MASTER CONTAINER ALLOCATION
  // ==========================================
  const [groupageLotNo, setGroupageLotNo] = useState(`LOT-${polCode}-${podCode}-2610`);
  const [masterContainerNo, setMasterContainerNo] = useState('MSKU9918204 (40HC Consolidation)');
  const [masterBlNo, setMasterBlNo] = useState('MSCU88192031');
  const [masterSealNo, setMasterSealNo] = useState('SL-441920');
  const [freeStorageDaysCfs, setFreeStorageDaysCfs] = useState(7);
  const [customsExamRequired, setCustomsExamRequired] = useState(false);
  const [destuffingNotes, setDestuffingNotes] = useState('Segregate palletized crates for immediate inspection and gate-pass issuance upon customs clearance.');

  // ==========================================
  // TAB 5: LCL FREIGHT RATING, INCOTERMS & HBL
  // ==========================================
  const [incoterms, setIncoterms] = useState('FOB (Free On Board)');
  const [freightTerms, setFreightTerms] = useState<'FREIGHT PREPAID' | 'FREIGHT COLLECT'>('FREIGHT PREPAID');
  const [currency, setCurrency] = useState('USD');

  // LCL Rates per Revenue Ton / CBM
  const [baseRatePerRt, setBaseRatePerRt] = useState(85); // $85 / RT
  const [cfsReceivingFeePerCbm, setCfsReceivingFeePerCbm] = useState(25); // $25 / CBM
  const [cfsDestripFeePerCbm, setCfsDestripFeePerCbm] = useState(30); // $30 / CBM
  const [docFee, setDocFee] = useState(65);
  const [customsEdiFee, setCustomsEdiFee] = useState(45);

  // Auto-calculated LCL Freight
  const oceanBaseFreight = Math.round(baseRatePerRt * revenueTons);
  const totalCfsReceiving = Math.round(cfsReceivingFeePerCbm * totalVolumeCbm);
  const totalCfsDestrip = Math.round(cfsDestripFeePerCbm * totalVolumeCbm);
  const totalFreightAmount = oceanBaseFreight + totalCfsReceiving + totalCfsDestrip + docFee + customsEdiFee;

  // HBL Instructions
  const [blType, setBlType] = useState('Express Release Cargo Waybill (No Originals)');
  const [canNotifyEmail, setCanNotifyEmail] = useState('inbound@alfuttaim-eng.ae; clearance@gulflogistics.ae');
  const [hblNumber, setHblNumber] = useState(`HBL-LCL-${Math.floor(1000 + Math.random() * 9000)}`);

  // Load Draft from LocalStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('shiplot_draft_lcl_booking');
      if (saved) {
        const d = JSON.parse(saved);
        if (d.shipperName) setShipperName(d.shipperName);
        if (d.consigneeName) setConsigneeName(d.consigneeName);
        if (d.cfsOrigin) setCfsOrigin(d.cfsOrigin);
        if (d.cfsDestination) setCfsDestination(d.cfsDestination);
        if (d.baseRatePerRt) setBaseRatePerRt(d.baseRatePerRt);
      }
    } catch {}
  }, []);

  // Save Draft Action
  const handleSaveDraft = () => {
    const draftPayload = {
      bookingNo,
      requestDate,
      shipperName,
      shipperRef,
      shipperContact,
      shipperPhone,
      shipperEmail,
      shipperAddress,
      shipperTaxId,
      consigneeName,
      consigneeTaxId,
      consigneeContact,
      consigneePhone,
      consigneeEmail,
      consigneeAddress,
      notifySameAsConsignee,
      notifyName,
      notifyAddress,
      notifyPhone,
      cfsOrigin,
      cfsOriginBay,
      cfsDestination,
      pol,
      polCode,
      pod,
      podCode,
      vesselName,
      voyageNo,
      cargoItems,
      totalVolumeCbm,
      totalGrossWeightKg,
      revenueTons,
      shippingMarks,
      hsCode,
      incoterms,
      freightTerms,
      baseRatePerRt,
      totalFreightAmount,
      groupageLotNo,
      hblNumber,
      updatedAt: new Date().toLocaleTimeString()
    };

    try {
      localStorage.setItem('shiplot_draft_lcl_booking', JSON.stringify(draftPayload));
    } catch {}

    setDraftSavedMessage(`LCL draft saved locally at ${new Date().toLocaleTimeString()} UTC`);
    setTimeout(() => setDraftSavedMessage(null), 3000);
  };

  // Submit Final LCL Booking
  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();

    const summaryCargoDesc = `${cargoItems.map(i => `${i.quantity}x ${i.packageType} (${i.description})`).join(', ')}. Marks: ${shippingMarks}`;

    const newBooking: Booking = {
      id: `bk_${Date.now()}`,
      bookingNo,
      requestDate,
      shipper: shipperName,
      consignee: consigneeName,
      type: 'LCL',
      direction: 'Export',
      pol: `${pol} (${polCode})`,
      pod: `${pod} (${podCode})`,
      containerType: `LCL Groupage (${revenueTons} RT / ${totalVolumeCbm} CBM)`,
      containerQty: 1,
      cargoDesc: summaryCargoDesc,
      carrier,
      targetVessel: vesselName,
      targetEtd: etd,
      status: 'Approved',
      totalFreightUsd: totalFreightAmount,
      // Operational fields
      shipperAddress,
      shipperPhone,
      shipperEmail,
      shipperTaxId,
      consigneeAddress,
      consigneePhone,
      consigneeEmail,
      consigneeTaxId,
      notifyPartyName: notifySameAsConsignee ? consigneeName : notifyName,
      notifyPartyAddress: notifySameAsConsignee ? consigneeAddress : notifyAddress,
      contractNo: coLoaderRef,
      tradeLane,
      placeOfReceipt: cfsOrigin,
      placeOfDelivery: cfsDestination,
      targetEta: eta,
      cargoCutOff: cfsCutOff,
      grossWeightKg: totalGrossWeightKg,
      cbmVolume: totalVolumeCbm,
      revenueTons,
      packagesCount: `${totalPackagesCount} Total Packages`,
      hsCode,
      incoterms,
      freightTerms,
      demurrageFreeDays: freeStorageDaysCfs,
      cfsOrigin,
      cfsDestination,
      groupageLotNo,
      masterBlNo,
      masterContainerNo,
      isDangerousGoods,
      dgDetails: isDangerousGoods ? dgDetails : undefined,
      blType,
      specialInstructions: destuffingNotes
    };

    // Add to AppContext bookings
    addBooking(newBooking);

    // Also auto-generate active Shipment record for LCL tracking
    const newShipment: Shipment = {
      id: `shp_${Date.now()}`,
      shipmentNo: `SHP-${bookingNo.replace('LCL-BK-', '')}`,
      bookingNo,
      shipper: shipperName,
      consignee: consigneeName,
      pol,
      polCode,
      pod,
      podCode,
      etd,
      eta,
      carrier,
      carrierCode: 'MSC',
      vesselName,
      voyageNo,
      type: 'LCL',
      direction: 'Export',
      status: 'Booking Confirmed',
      containersCount: 1,
      weightKg: totalGrossWeightKg,
      cbmVolume: totalVolumeCbm,
      cargoDesc: summaryCargoDesc
    };
    addShipment(newShipment);

    // Clear Draft
    try {
      localStorage.removeItem('shiplot_draft_lcl_booking');
    } catch {}

    setBookingSubmitted(newBooking);
    if (onBookingCreated) {
      onBookingCreated(newBooking);
    }
  };

  const tabs: { id: LclTab; label: string; icon: React.ElementType }[] = [
    { id: 'parties', label: '1. Parties & Co-loader', icon: Building2 },
    { id: 'cfs', label: '2. CFS Depots & Schedule', icon: Warehouse },
    { id: 'dimensions', label: '3. Cargo Pieces & W/M', icon: Calculator },
    { id: 'groupage', label: '4. Groupage Lot & Storage', icon: Boxes },
    { id: 'freight', label: '5. LCL Rating & HBL', icon: DollarSign }
  ];

  return (
    <div className="w-full rounded-2xl bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 shadow-xl overflow-hidden font-sans transition-all">
      {/* Draft Notification Toast */}
      {draftSavedMessage && (
        <div className="bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 px-4 py-2 text-xs font-mono flex items-center justify-between animate-fade-in border-b border-neutral-700">
          <div className="flex items-center gap-2">
            <BookmarkCheck className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
            <span>{draftSavedMessage}</span>
          </div>
          <button onClick={() => setDraftSavedMessage(null)} className="text-neutral-400 hover:text-white cursor-pointer">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Booking Success Confirmation Banner */}
      {bookingSubmitted ? (
        <div className="p-8 text-center space-y-4 font-mono">
          <div className="w-14 h-14 mx-auto rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 flex items-center justify-center">
            <Check className="w-7 h-7 text-neutral-900 dark:text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white font-sans">
              LCL Groupage / CFS Booking Confirmed
            </h2>
            <p className="text-xs text-neutral-500 mt-1">
              Booking Ref #{bookingSubmitted.bookingNo} allocated to Groupage Lot {groupageLotNo}
            </p>
          </div>

          <div className="max-w-md mx-auto p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 text-xs text-left space-y-1.5">
            <div className="flex justify-between">
              <span className="text-neutral-400">Shipper:</span>
              <span className="font-bold text-neutral-900 dark:text-white">{bookingSubmitted.shipper}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Origin CFS:</span>
              <span className="font-bold text-neutral-900 dark:text-white truncate max-w-[240px]">{cfsOrigin}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Volume & Weight:</span>
              <span className="font-bold text-neutral-900 dark:text-white">{totalVolumeCbm} CBM · {totalGrossWeightKg.toLocaleString()} KG</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Revenue Tons:</span>
              <span className="font-bold text-neutral-900 dark:text-white">{revenueTons} RT ({revenueTonBasis})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Total Freight:</span>
              <span className="font-bold text-neutral-900 dark:text-white">${bookingSubmitted.totalFreightUsd.toLocaleString()} USD</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setBookingSubmitted(null);
                setBookingNo(`LCL-BK-2026-${Math.floor(1000 + Math.random() * 9000)}`);
              }}
              className="px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              + Create Another LCL Booking
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="px-5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-200 dark:text-neutral-950 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                Close Form
              </button>
            )}
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmitBooking}>
          {/* Header Banner */}
          <div className="p-4 sm:p-5 border-b border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-50/70 dark:bg-neutral-900/50">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 uppercase">
                  LCL CFS CONSOLIDATION
                </span>
                <span className="text-xs font-mono font-bold text-neutral-900 dark:text-white">
                  Ref #{bookingNo}
                </span>
                <span className="text-[11px] font-mono text-neutral-400 hidden sm:inline">
                  Consolidator: {currentCompany.name}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white tracking-tight mt-1 font-sans">
                Less than Container Load (LCL) Groupage Booking & CFS Receiving Order
              </h2>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                type="button"
                onClick={handleSaveDraft}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs font-mono font-semibold transition-colors cursor-pointer shadow-xs"
                title="Save current state as draft"
              >
                <Save className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-400" />
                <span>Save as Draft</span>
              </button>

              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-white rounded-lg border border-transparent hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors cursor-pointer"
                  title="Close Booking Form"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* 5 Tabs Navigation Bar */}
          <div className="flex border-b border-neutral-200 dark:border-neutral-800 overflow-x-auto bg-white dark:bg-neutral-950 scrollbar-none">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-xs font-mono font-medium whitespace-nowrap transition-all border-b-2 cursor-pointer ${
                    isActive
                      ? 'border-neutral-900 text-neutral-900 dark:border-white dark:text-white font-bold bg-neutral-100/60 dark:bg-neutral-900/60'
                      : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900/30'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content Body */}
          <div className="p-5 sm:p-6 space-y-6 text-xs font-mono">
            {/* ========================================================= */}
            {/* TAB 1: PARTIES & CO-LOADER */}
            {/* ========================================================= */}
            {activeTab === 'parties' && (
              <div className="space-y-6 animate-fade-in">
                {/* Header Meta */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40">
                  <div>
                    <label className="block text-neutral-500 mb-1 text-[11px]">LCL Booking Reference *</label>
                    <input
                      type="text"
                      required
                      value={bookingNo}
                      onChange={e => setBookingNo(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-500 mb-1 text-[11px]">Booking Date</label>
                    <input
                      type="date"
                      value={requestDate}
                      onChange={e => setRequestDate(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-500 mb-1 text-[11px]">Co-Loader / Master Consolidator Ref</label>
                    <input
                      type="text"
                      placeholder="e.g. COL-VANGUARD-0412"
                      value={coLoaderRef}
                      onChange={e => setCoLoaderRef(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                    />
                  </div>
                </div>

                {/* Shipper & Consignee Columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Shipper Box */}
                  <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-3">
                    <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-2">
                      <span className="font-bold text-neutral-900 dark:text-white font-sans text-sm flex items-center gap-1.5">
                        <Building2 className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
                        <span>Shipper / Exporter</span>
                      </span>
                      <span className="text-[10px] text-neutral-400 font-mono">Cargo Consignor</span>
                    </div>

                    <div className="space-y-2.5">
                      <div>
                        <label className="block text-neutral-500 mb-1">Company Legal Name *</label>
                        <input
                          type="text"
                          required
                          value={shipperName}
                          onChange={e => setShipperName(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-neutral-500 mb-1">NTN / Tax ID</label>
                          <input
                            type="text"
                            value={shipperTaxId}
                            onChange={e => setShipperTaxId(e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-neutral-500 mb-1">Contact Officer</label>
                          <input
                            type="text"
                            value={shipperContact}
                            onChange={e => setShipperContact(e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-neutral-500 mb-1">Phone</label>
                          <input
                            type="tel"
                            value={shipperPhone}
                            onChange={e => setShipperPhone(e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-neutral-500 mb-1">Email</label>
                          <input
                            type="email"
                            value={shipperEmail}
                            onChange={e => setShipperEmail(e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-neutral-500 mb-1">Cargo Pickup / Factory Address</label>
                        <input
                          type="text"
                          value={shipperAddress}
                          onChange={e => setShipperAddress(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Consignee Box */}
                  <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-3">
                    <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-2">
                      <span className="font-bold text-neutral-900 dark:text-white font-sans text-sm flex items-center gap-1.5">
                        <Building2 className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
                        <span>Consignee / Importer</span>
                      </span>
                      <span className="text-[10px] text-neutral-400 font-mono">Destination Receiver</span>
                    </div>

                    <div className="space-y-2.5">
                      <div>
                        <label className="block text-neutral-500 mb-1">Company Legal Name *</label>
                        <input
                          type="text"
                          required
                          value={consigneeName}
                          onChange={e => setConsigneeName(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-neutral-500 mb-1">TRN / Tax ID / EORI</label>
                          <input
                            type="text"
                            value={consigneeTaxId}
                            onChange={e => setConsigneeTaxId(e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-neutral-500 mb-1">Contact Officer</label>
                          <input
                            type="text"
                            value={consigneeContact}
                            onChange={e => setConsigneeContact(e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-neutral-500 mb-1">Phone</label>
                          <input
                            type="tel"
                            value={consigneePhone}
                            onChange={e => setConsigneePhone(e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-neutral-500 mb-1">Email</label>
                          <input
                            type="email"
                            value={consigneeEmail}
                            onChange={e => setConsigneeEmail(e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-neutral-500 mb-1">Destination Delivery Address</label>
                        <input
                          type="text"
                          value={consigneeAddress}
                          onChange={e => setConsigneeAddress(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notify Party */}
                <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-3">
                  <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-2">
                    <span className="font-bold text-neutral-900 dark:text-white font-sans text-sm">
                      Notify Party / Destination Customs Broker
                    </span>
                    <label className="flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-400 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifySameAsConsignee}
                        onChange={e => setNotifySameAsConsignee(e.target.checked)}
                      />
                      <span>Same as Consignee</span>
                    </label>
                  </div>

                  {!notifySameAsConsignee && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-neutral-500 mb-1">Notify Party Name</label>
                        <input
                          type="text"
                          value={notifyName}
                          onChange={e => setNotifyName(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-neutral-500 mb-1">Notify Address</label>
                        <input
                          type="text"
                          value={notifyAddress}
                          onChange={e => setNotifyAddress(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-neutral-500 mb-1">Notify Phone</label>
                        <input
                          type="text"
                          value={notifyPhone}
                          onChange={e => setNotifyPhone(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                        />
                      </div>
                    </div>
                  )}
                  {notifySameAsConsignee && (
                    <p className="text-xs text-neutral-400 italic">
                      Destination CFS arrival notifications will be dispatched directly to Consignee ({consigneeName}).
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* TAB 2: CFS DEPOTS & CONSOLIDATION SCHEDULE */}
            {/* ========================================================= */}
            {activeTab === 'cfs' && (
              <div className="space-y-6 animate-fade-in">
                {/* CFS Origin & Destination Facilities */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Origin CFS */}
                  <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-3">
                    <span className="font-bold text-neutral-900 dark:text-white font-sans text-sm flex items-center gap-1.5 border-b border-neutral-100 dark:border-neutral-800 pb-2">
                      <Warehouse className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
                      <span>Origin CFS Warehouse (Packing Hub)</span>
                    </span>

                    <div className="space-y-2.5">
                      <div>
                        <label className="block text-neutral-500 mb-1">Origin CFS Facility Name & Address *</label>
                        <input
                          type="text"
                          required
                          value={cfsOrigin}
                          onChange={e => setCfsOrigin(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-neutral-500 mb-1">Receiving Bay / Gate No</label>
                        <input
                          type="text"
                          value={cfsOriginBay}
                          onChange={e => setCfsOriginBay(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-neutral-500 mb-1">Port of Loading (POL)</label>
                          <input
                            type="text"
                            value={pol}
                            onChange={e => setPol(e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-neutral-500 mb-1">POL LOCODE</label>
                          <input
                            type="text"
                            value={polCode}
                            onChange={e => setPolCode(e.target.value.toUpperCase())}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white font-bold"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Dest CFS */}
                  <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-3">
                    <span className="font-bold text-neutral-900 dark:text-white font-sans text-sm flex items-center gap-1.5 border-b border-neutral-100 dark:border-neutral-800 pb-2">
                      <Warehouse className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
                      <span>Destination CFS Hub (De-consolidation)</span>
                    </span>

                    <div className="space-y-2.5">
                      <div>
                        <label className="block text-neutral-500 mb-1">Destination CFS Bonded Facility *</label>
                        <input
                          type="text"
                          required
                          value={cfsDestination}
                          onChange={e => setCfsDestination(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-neutral-500 mb-1">Port of Discharge (POD)</label>
                          <input
                            type="text"
                            value={pod}
                            onChange={e => setPod(e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-neutral-500 mb-1">POD LOCODE</label>
                          <input
                            type="text"
                            value={podCode}
                            onChange={e => setPodCode(e.target.value.toUpperCase())}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white font-bold"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-neutral-500 mb-1">Target Ocean Carrier</label>
                        <input
                          type="text"
                          value={carrier}
                          onChange={e => setCarrier(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Vessel & Key Timelines */}
                <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-3">
                  <span className="font-bold text-neutral-900 dark:text-white font-sans text-sm block border-b border-neutral-100 dark:border-neutral-800 pb-2">
                    Co-loading Vessel & CFS Gate Cut-Off Timelines
                  </span>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    <div>
                      <label className="block text-neutral-500 mb-1 text-[11px]">Cargo Delivery to CFS</label>
                      <input
                        type="date"
                        value={cargoDeliveryDate}
                        onChange={e => setCargoDeliveryDate(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-500 mb-1 text-[11px]">CFS Receiving Cut-off *</label>
                      <input
                        type="text"
                        value={cfsCutOff}
                        onChange={e => setCfsCutOff(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-500 mb-1 text-[11px]">Vessel ETD *</label>
                      <input
                        type="date"
                        required
                        value={etd}
                        onChange={e => setEtd(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-500 mb-1 text-[11px]">Vessel ETA *</label>
                      <input
                        type="date"
                        required
                        value={eta}
                        onChange={e => setEta(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-500 mb-1 text-[11px]">CFS De-stuffing Ready</label>
                      <input
                        type="text"
                        value={destripDate}
                        onChange={e => setDestripDate(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* TAB 3: CARGO PIECES, DIMENSIONS & REVENUE TONS (W/M) */}
            {/* ========================================================= */}
            {activeTab === 'dimensions' && (
              <div className="space-y-6 animate-fade-in">
                {/* Cargo Dimensions Matrix */}
                <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-2">
                    <div>
                      <h3 className="font-bold text-sm text-neutral-900 dark:text-white font-sans flex items-center gap-1.5">
                        <Package className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
                        <span>LCL Piece-by-Piece Packing Specification</span>
                      </h3>
                      <p className="text-[11px] text-neutral-500">
                        Itemize each pallet, crate, or carton dimension for automatic CBM and Revenue Ton calculation.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={addCargoItem}
                      className="flex items-center gap-1 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-200 dark:text-neutral-900 rounded-lg text-xs font-semibold self-start sm:self-auto cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Cargo Line</span>
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-mono">
                      <thead className="text-[11px] text-neutral-400 border-b border-neutral-200 dark:border-neutral-800">
                        <tr>
                          <th className="py-2 px-2">Description</th>
                          <th className="py-2 px-2">Package Type</th>
                          <th className="py-2 px-2">Qty</th>
                          <th className="py-2 px-2">L (cm)</th>
                          <th className="py-2 px-2">W (cm)</th>
                          <th className="py-2 px-2">H (cm)</th>
                          <th className="py-2 px-2">Vol (CBM)</th>
                          <th className="py-2 px-2">Gross Wt (kg)</th>
                          <th className="py-2 px-2 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                        {cargoItems.map((item, index) => {
                          const itemCbm = parseFloat(((item.lengthCm * item.widthCm * item.heightCm / 1000000) * item.quantity).toFixed(3));
                          return (
                            <tr key={item.id}>
                              <td className="py-2.5 px-2">
                                <input
                                  type="text"
                                  value={item.description}
                                  onChange={e => {
                                    const val = e.target.value;
                                    setCargoItems(prev => prev.map(i => i.id === item.id ? { ...i, description: val } : i));
                                  }}
                                  className="w-48 px-2 py-1 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                                />
                              </td>

                              <td className="py-2.5 px-2">
                                <select
                                  value={item.packageType}
                                  onChange={e => {
                                    const val = e.target.value;
                                    setCargoItems(prev => prev.map(i => i.id === item.id ? { ...i, packageType: val } : i));
                                  }}
                                  className="px-2 py-1 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs"
                                >
                                  <option>Wooden Crates (ISPM-15)</option>
                                  <option>Euro Pallets (120x80)</option>
                                  <option>Standard Pallets (120x100)</option>
                                  <option>Heavy Cartons on Pallets</option>
                                  <option>Corrugated Boxes</option>
                                  <option>Steel Drums</option>
                                  <option>Bales / Bundles</option>
                                </select>
                              </td>

                              <td className="py-2.5 px-2">
                                <input
                                  type="number"
                                  min={1}
                                  value={item.quantity}
                                  onChange={e => {
                                    const q = parseInt(e.target.value) || 1;
                                    setCargoItems(prev => prev.map(i => i.id === item.id ? { ...i, quantity: q } : i));
                                  }}
                                  className="w-16 px-1.5 py-1 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-center font-bold"
                                />
                              </td>

                              <td className="py-2.5 px-2">
                                <input
                                  type="number"
                                  value={item.lengthCm}
                                  onChange={e => {
                                    const l = parseInt(e.target.value) || 1;
                                    setCargoItems(prev => prev.map(i => i.id === item.id ? { ...i, lengthCm: l } : i));
                                  }}
                                  className="w-16 px-1.5 py-1 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-center"
                                />
                              </td>

                              <td className="py-2.5 px-2">
                                <input
                                  type="number"
                                  value={item.widthCm}
                                  onChange={e => {
                                    const w = parseInt(e.target.value) || 1;
                                    setCargoItems(prev => prev.map(i => i.id === item.id ? { ...i, widthCm: w } : i));
                                  }}
                                  className="w-16 px-1.5 py-1 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-center"
                                />
                              </td>

                              <td className="py-2.5 px-2">
                                <input
                                  type="number"
                                  value={item.heightCm}
                                  onChange={e => {
                                    const h = parseInt(e.target.value) || 1;
                                    setCargoItems(prev => prev.map(i => i.id === item.id ? { ...i, heightCm: h } : i));
                                  }}
                                  className="w-16 px-1.5 py-1 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-center"
                                />
                              </td>

                              <td className="py-2.5 px-2 font-bold text-neutral-900 dark:text-white">
                                {itemCbm} CBM
                              </td>

                              <td className="py-2.5 px-2">
                                <input
                                  type="number"
                                  value={item.grossWeightKg}
                                  onChange={e => {
                                    const wt = parseInt(e.target.value) || 1;
                                    setCargoItems(prev => prev.map(i => i.id === item.id ? { ...i, grossWeightKg: wt } : i));
                                  }}
                                  className="w-24 px-2 py-1 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 font-bold"
                                />
                              </td>

                              <td className="py-2.5 px-2 text-right">
                                {cargoItems.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => removeCargoItem(item.id)}
                                    className="text-neutral-400 hover:text-rose-600 p-1 cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Auto W/M Revenue Ton Calculation Summary Box */}
                <div className="p-4 rounded-xl border border-neutral-900 dark:border-white bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-700 dark:border-neutral-200 pb-2">
                    <div className="flex items-center gap-2">
                      <Calculator className="w-5 h-5 text-emerald-400 dark:text-emerald-600" />
                      <span className="font-bold text-sm font-sans">
                        International Maritime Revenue Ton (W/M) Determination
                      </span>
                    </div>

                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-neutral-800 text-neutral-200 dark:bg-neutral-100 dark:text-neutral-900">
                      Standard Rule: 1 CBM = 1,000 KG (1 MT)
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                    <div className="p-2.5 rounded-lg bg-neutral-800/80 dark:bg-neutral-100">
                      <span className="text-[10px] text-neutral-400 dark:text-neutral-500 block">Total Volume</span>
                      <span className="text-lg font-bold">{totalVolumeCbm} CBM</span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-neutral-800/80 dark:bg-neutral-100">
                      <span className="text-[10px] text-neutral-400 dark:text-neutral-500 block">Total Gross Weight</span>
                      <span className="text-lg font-bold">{totalGrossWeightKg.toLocaleString()} KG ({totalGrossWeightMt} MT)</span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-neutral-800/80 dark:bg-neutral-100">
                      <span className="text-[10px] text-neutral-400 dark:text-neutral-500 block">Calculated Revenue Ton (W/M)</span>
                      <span className="text-lg font-bold text-emerald-400 dark:text-emerald-600">{revenueTons} RT</span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-neutral-800/80 dark:bg-neutral-100">
                      <span className="text-[10px] text-neutral-400 dark:text-neutral-500 block">Tariff Applied On</span>
                      <span className="text-sm font-bold uppercase">{revenueTonBasis}</span>
                    </div>
                  </div>
                </div>

                {/* Marks, HS Code & Cargo Handling */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-3">
                    <span className="font-bold text-neutral-900 dark:text-white font-sans text-sm block border-b border-neutral-100 dark:border-neutral-800 pb-2">
                      Shipping Marks & Numbers (Stenciled on Packages)
                    </span>
                    <div>
                      <label className="block text-neutral-500 mb-1">Marks & Numbers Labeling *</label>
                      <textarea
                        rows={3}
                        required
                        value={shippingMarks}
                        onChange={e => setShippingMarks(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-3">
                    <span className="font-bold text-neutral-900 dark:text-white font-sans text-sm block border-b border-neutral-100 dark:border-neutral-800 pb-2">
                      Customs HS Tariff & Warehouse Stacking
                    </span>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-neutral-500 mb-1">Harmonized HS Code *</label>
                        <input
                          type="text"
                          required
                          value={hsCode}
                          onChange={e => setHsCode(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white font-bold"
                        />
                      </div>
                      <div className="space-y-2 pt-5">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isStackable}
                            onChange={e => setIsStackable(e.target.checked)}
                          />
                          <span>Cargo Stackable</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={forkliftRequired}
                            onChange={e => setForkliftRequired(e.target.checked)}
                          />
                          <span>Forkliftable Base</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* TAB 4: GROUPAGE LOT & MASTER CONTAINER ALLOCATION */}
            {/* ========================================================= */}
            {activeTab === 'groupage' && (
              <div className="space-y-6 animate-fade-in">
                <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-4">
                  <span className="font-bold text-neutral-900 dark:text-white font-sans text-sm block border-b border-neutral-100 dark:border-neutral-800 pb-2">
                    LCL Consolidation Master Box & Groupage Lot Details
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-neutral-500 mb-1">CFS Groupage Lot No *</label>
                      <input
                        type="text"
                        required
                        value={groupageLotNo}
                        onChange={e => setGroupageLotNo(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-neutral-500 mb-1">Master Consolidation Container No</label>
                      <input
                        type="text"
                        value={masterContainerNo}
                        onChange={e => setMasterContainerNo(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-neutral-500 mb-1">Master Ocean B/L (MBL) Ref</label>
                      <input
                        type="text"
                        value={masterBlNo}
                        onChange={e => setMasterBlNo(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block text-neutral-500 mb-1">Destination CFS Free Storage Period (Days)</label>
                      <input
                        type="number"
                        value={freeStorageDaysCfs}
                        onChange={e => setFreeStorageDaysCfs(parseInt(e.target.value) || 5)}
                        className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white font-bold"
                      />
                      <span className="text-[10px] text-neutral-400">Warehouse demurrage applies following free days</span>
                    </div>

                    <div>
                      <label className="block text-neutral-500 mb-1">De-stuffing / CFS Strip Handling Protocol</label>
                      <input
                        type="text"
                        value={destuffingNotes}
                        onChange={e => setDestuffingNotes(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* TAB 5: LCL RATING, INCOTERMS & HBL */}
            {/* ========================================================= */}
            {activeTab === 'freight' && (
              <div className="space-y-6 animate-fade-in">
                {/* Incoterms & Payment */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                  <div>
                    <label className="block text-neutral-500 mb-1">Incoterms 2020 *</label>
                    <select
                      value={incoterms}
                      onChange={e => setIncoterms(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white font-bold"
                    >
                      <option>FOB (Free On Board)</option>
                      <option>CFR (Cost and Freight)</option>
                      <option>CIF (Cost, Insurance &amp; Freight)</option>
                      <option>EXW (Ex Works)</option>
                      <option>FCA (Free Carrier)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-neutral-500 mb-1">Payment Terms *</label>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <label className={`p-2 rounded-lg border flex items-center justify-center cursor-pointer ${
                        freightTerms === 'FREIGHT PREPAID' ? 'border-neutral-900 bg-neutral-100 dark:border-white dark:bg-neutral-800 font-bold' : 'border-neutral-200 dark:border-neutral-800'
                      }`}>
                        <input
                          type="radio"
                          name="freightTermLcl"
                          checked={freightTerms === 'FREIGHT PREPAID'}
                          onChange={() => setFreightTerms('FREIGHT PREPAID')}
                          className="sr-only"
                        />
                        <span>Prepaid</span>
                      </label>
                      <label className={`p-2 rounded-lg border flex items-center justify-center cursor-pointer ${
                        freightTerms === 'FREIGHT COLLECT' ? 'border-neutral-900 bg-neutral-100 dark:border-white dark:bg-neutral-800 font-bold' : 'border-neutral-200 dark:border-neutral-800'
                      }`}>
                        <input
                          type="radio"
                          name="freightTermLcl"
                          checked={freightTerms === 'FREIGHT COLLECT'}
                          onChange={() => setFreightTerms('FREIGHT COLLECT')}
                          className="sr-only"
                        />
                        <span>Collect</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-neutral-500 mb-1">Currency</label>
                    <select
                      value={currency}
                      onChange={e => setCurrency(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 font-bold"
                    >
                      <option>USD</option>
                      <option>EUR</option>
                      <option>PKR</option>
                    </select>
                  </div>
                </div>

                {/* Rating Itemized Grid */}
                <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-3">
                  <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-2">
                    <span className="font-bold text-neutral-900 dark:text-white font-sans text-sm flex items-center gap-1.5">
                      <DollarSign className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
                      <span>Itemized LCL Groupage Tariff Breakdown ({revenueTons} Revenue Tons)</span>
                    </span>

                    <span className="text-base font-bold text-neutral-900 dark:text-white font-mono">
                      Total: ${totalFreightAmount.toLocaleString()} {currency}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-neutral-500 mb-1">Ocean Base Rate / RT ($/w/m)</label>
                      <input
                        type="number"
                        value={baseRatePerRt}
                        onChange={e => setBaseRatePerRt(parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white font-bold"
                      />
                      <span className="text-[10px] text-neutral-400">Subtotal: ${oceanBaseFreight.toLocaleString()}</span>
                    </div>

                    <div>
                      <label className="block text-neutral-500 mb-1">CFS Receiving Fee / CBM</label>
                      <input
                        type="number"
                        value={cfsReceivingFeePerCbm}
                        onChange={e => setCfsReceivingFeePerCbm(parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                      />
                      <span className="text-[10px] text-neutral-400">Subtotal: ${totalCfsReceiving.toLocaleString()}</span>
                    </div>

                    <div>
                      <label className="block text-neutral-500 mb-1">CFS De-stuffing / CBM</label>
                      <input
                        type="number"
                        value={cfsDestripFeePerCbm}
                        onChange={e => setCfsDestripFeePerCbm(parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                      />
                      <span className="text-[10px] text-neutral-400">Subtotal: ${totalCfsDestrip.toLocaleString()}</span>
                    </div>

                    <div>
                      <label className="block text-neutral-500 mb-1">Doc & EDI Filing Fee</label>
                      <input
                        type="number"
                        value={docFee + customsEdiFee}
                        onChange={e => setDocFee(parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                      />
                      <span className="text-[10px] text-neutral-400">Fixed documentation fee</span>
                    </div>
                  </div>
                </div>

                {/* House B/L Instructions */}
                <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-3">
                  <span className="font-bold text-neutral-900 dark:text-white font-sans text-sm block border-b border-neutral-100 dark:border-neutral-800 pb-2">
                    House Bill of Lading (HBL) & Arrival Notice Setup
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-neutral-500 mb-1">Requested HBL Release Type</label>
                      <select
                        value={blType}
                        onChange={e => setBlType(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white font-semibold"
                      >
                        <option>Express Release Cargo Waybill (No Originals)</option>
                        <option>Original Negotiable House B/L (3/3 Originals)</option>
                        <option>Telex Surrender at Origin CFS</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-neutral-500 mb-1">Cargo Arrival Notice Distribution List</label>
                      <input
                        type="text"
                        value={canNotifyEmail}
                        onChange={e => setCanNotifyEmail(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Controls & Navigation */}
          <div className="p-4 sm:p-5 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSaveDraft}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-semibold cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save as Draft</span>
              </button>

              <span className="text-[11px] text-neutral-400 hidden sm:inline">
                Tab: {tabs.find(t => t.id === activeTab)?.label}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {activeTab !== 'parties' && (
                <button
                  type="button"
                  onClick={() => {
                    const currentIndex = tabs.findIndex(t => t.id === activeTab);
                    if (currentIndex > 0) setActiveTab(tabs[currentIndex - 1].id);
                  }}
                  className="flex items-center gap-1 px-3.5 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 cursor-pointer font-semibold"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>
              )}

              {activeTab !== 'freight' ? (
                <button
                  type="button"
                  onClick={() => {
                    const currentIndex = tabs.findIndex(t => t.id === activeTab);
                    if (currentIndex < tabs.length - 1) setActiveTab(tabs[currentIndex + 1].id);
                  }}
                  className="flex items-center gap-1 px-4 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-200 dark:text-neutral-950 font-bold cursor-pointer"
                >
                  <span>Next Step</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2 rounded-lg bg-neutral-950 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-200 dark:text-neutral-950 font-bold cursor-pointer shadow-md text-xs font-sans"
                >
                  <Check className="w-4 h-4" />
                  <span>Confirm & Issue LCL Booking (${totalFreightAmount.toLocaleString()} USD)</span>
                </button>
              )}
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
