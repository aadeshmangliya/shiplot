import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Booking, Shipment, Container } from '../../types';
import {
  Ship,
  Box,
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
  Thermometer,
  ShieldAlert,
  Scale,
  Plus,
  Trash2,
  Building2,
  User,
  Phone,
  Mail,
  MapPin,
  Clock,
  Ticket
} from 'lucide-react';

interface FclBookingFormProps {
  onClose?: () => void;
  onBookingCreated?: (booking: Booking) => void;
}

interface ContainerSlot {
  id: string;
  type: string;
  quantity: number;
  ownership: 'COC' | 'SOC';
  tareWeightKg: number;
  maxPayloadKg: number;
  grossWeightPerUnitKg: number;
}

export const FclBookingForm: React.FC<FclBookingFormProps> = ({ onClose, onBookingCreated }) => {
  const { currentCompany, addBooking, addShipment, addContainer, addAuditLog, currentUser, vessels } = useApp();

  type FclTab = 'parties' | 'voyage' | 'equipment' | 'cargo' | 'freight';
  const [activeTab, setActiveTab] = useState<FclTab>('parties');
  const [draftSavedMessage, setDraftSavedMessage] = useState<string | null>(null);
  const [bookingSubmitted, setBookingSubmitted] = useState<Booking | null>(null);

  // ==========================================
  // TAB 1: COMMERCIAL PARTIES & SERVICE CONTRACT
  // ==========================================
  const [bookingNo, setBookingNo] = useState(`FCL-BK-2026-${Math.floor(1000 + Math.random() * 9000)}`);
  const [requestDate, setRequestDate] = useState(new Date().toISOString().substring(0, 10));
  const [shipperRef, setShipperRef] = useState('PO-USA-99210');
  const [serviceContractNo, setServiceContractNo] = useState('FMC-SC-2026-8819');
  const [quotationRef, setQuotationRef] = useState('QTN-INDUS-4402');
  const [tradeLane, setTradeLane] = useState('Trans-Pacific Eastbound (Asia -> North America)');

  // Shipper Details
  const [shipperName, setShipperName] = useState('Pacific Precision Electronics Inc.');
  const [shipperTaxId, setShipperTaxId] = useState('US-EIN-94-3829104');
  const [shipperContact, setShipperContact] = useState('Sarah Jenkins (Export Logistics Mgr)');
  const [shipperPhone, setShipperPhone] = useState('+1-949-555-0199');
  const [shipperEmail, setShipperEmail] = useState('logistics@pacificprecision.com');
  const [shipperAddress, setShipperAddress] = useState('9200 Irvine Center Drive, Suite 400');
  const [shipperCity, setShipperCity] = useState('Irvine');
  const [shipperCountry, setShipperCountry] = useState('United States');

  // Consignee Details
  const [consigneeName, setConsigneeName] = useState('Shenzhen Quantum Microelectronics Ltd.');
  const [consigneeTaxId, setConsigneeTaxId] = useState('CN-USCC-91440300MA5EX7');
  const [consigneeContact, setConsigneeContact] = useState('Mr. Zhang Wei (Inbound Supply Lead)');
  const [consigneePhone, setConsigneePhone] = useState('+86-755-8839-2000');
  const [consigneeEmail, setConsigneeEmail] = useState('inbound@quantummicro.cn');
  const [consigneeAddress, setConsigneeAddress] = useState('Tower B, Hi-Tech Industrial Park, Nanshan District, Shenzhen, China');

  // Notify Party
  const [notifySameAsConsignee, setNotifySameAsConsignee] = useState(true);
  const [notifyName, setNotifyName] = useState('China Oceanic Global Logistics Agency (Shenzhen)');
  const [notifyAddress, setNotifyAddress] = useState('Yantian Port Logistics Center 5F, Shenzhen, Guangdong, China');
  const [notifyPhone, setNotifyPhone] = useState('+86-755-2527-8811');

  // ==========================================
  // TAB 2: OCEAN ROUTING & SCHEDULE
  // ==========================================
  const [carrier, setCarrier] = useState('Mediterranean Shipping Company (MSC)');
  const [vesselName, setVesselName] = useState('MSC Oscar');
  const [imoNumber, setImoNumber] = useState('9703291');
  const [voyageNo, setVoyageNo] = useState('MS-2640W');
  const [callSign, setCallSign] = useState('3FFA4');
  const [isTransshipment, setIsTransshipment] = useState(false);
  const [transshipmentPort, setTransshipmentPort] = useState('Singapore (SGSIN)');

  const [pol, setPol] = useState('Port of Los Angeles (Pier 400)');
  const [polCode, setPolCode] = useState('USLAX');
  const [pod, setPod] = useState('Port of Shanghai (Yangshan Phase IV)');
  const [podCode, setPodCode] = useState('CNSHA');
  const [placeOfReceipt, setPlaceOfReceipt] = useState('Los Angeles Harbor Pier 400 (Factory Staging)');
  const [placeOfDelivery, setPlaceOfDelivery] = useState('Waigaoqiao Logistics Park / Customer Bonded Hub');

  const [etd, setEtd] = useState('2026-10-18');
  const [eta, setEta] = useState('2026-11-04');
  const [cargoCutOff, setCargoCutOff] = useState('2026-10-16 17:00');
  const [siCutOff, setSiCutOff] = useState('2026-10-15 12:00');
  const [vgmCutOff, setVgmCutOff] = useState('2026-10-16 12:00');

  // ==========================================
  // TAB 3: EQUIPMENT, CONTAINERS & HAULAGE
  // ==========================================
  const [containerSlots, setContainerSlots] = useState<ContainerSlot[]>([
    {
      id: 'slot_1',
      type: '40HC',
      quantity: 2,
      ownership: 'COC',
      tareWeightKg: 3820,
      maxPayloadKg: 28680,
      grossWeightPerUnitKg: 22400
    }
  ]);

  const [emptyDepot, setEmptyDepot] = useState('APM Terminals Depot 4, Pier 400, Los Angeles');
  const [emptyReleaseRef, setEmptyReleaseRef] = useState('REL-APM-LAX-9941');
  const [fullReturnTerminal, setFullReturnTerminal] = useState('APM Terminals Pier 400 (Berth 401-404)');
  const [demurrageOriginFreeDays, setDemurrageOriginFreeDays] = useState(7);
  const [demurrageDestFreeDays, setDemurrageDestFreeDays] = useState(21);
  const [detentionFreeDays, setDetentionFreeDays] = useState(14);
  const [haulageMode, setHaulageMode] = useState<'Merchant' | 'Carrier'>('Merchant');

  // Reefer Settings
  const [isReefer, setIsReefer] = useState(false);
  const [reeferTemp, setReeferTemp] = useState('+4.0°C');
  const [reeferVent, setReeferVent] = useState('25 cbm/hr');
  const [reeferHumidity, setReeferHumidity] = useState('85%');
  const [gensetRequired, setGensetRequired] = useState(false);

  // Dangerous Goods (DG)
  const [isDangerousGoods, setIsDangerousGoods] = useState(false);
  const [dgImoClass, setDgImoClass] = useState('Class 9 (Miscellaneous)');
  const [dgUnNumber, setDgUnNumber] = useState('UN 3481');
  const [dgPackingGroup, setDgPackingGroup] = useState('II');
  const [dgFlashPoint, setDgFlashPoint] = useState('N/A (Battery Assemblies)');
  const [dgEmergencyPhone, setDgEmergencyPhone] = useState('+1-800-535-5053 (CHEMTREC)');

  // ==========================================
  // TAB 4: CARGO PARTICULARS & SOLAS VGM
  // ==========================================
  const [cargoDesc, setCargoDesc] = useState('Industrial electronic circuit board assemblies, microcontroller chips & robotics accessories. Dry export pack on heat-treated ISPM-15 wooden pallets.');
  const [hsCode, setHsCode] = useState('8542.31.00');
  const [packagesCount, setPackagesCount] = useState('96 Pallets / 2,400 Master Cartons');
  const [cargoGrossWeightKg, setCargoGrossWeightKg] = useState(44800);
  const [totalTareWeightKg, setTotalTareWeightKg] = useState(7640);
  const [solasVgmMethod, setSolasVgmMethod] = useState<'Method 1 (Weighbridge)' | 'Method 2 (Calculated Component)'>('Method 1 (Weighbridge)');
  const [weighingStationName, setWeighingStationName] = useState('Port of Los Angeles Certified Scale #77');
  const [scaleCertNo, setScaleCertNo] = useState('CAL-CERT-LAX-2026-0812');
  const [vgmSignatoryName, setVgmSignatoryName] = useState('Marcus Vance (Certified Weighmaster)');
  const [declaredValueUsd, setDeclaredValueUsd] = useState(385000);
  const [marineInsurance, setMarineInsurance] = useState(true);

  // ==========================================
  // TAB 5: FREIGHT CHARGES, INCOTERMS & B/L
  // ==========================================
  const [incoterms, setIncoterms] = useState('FOB (Free On Board)');
  const [freightTerms, setFreightTerms] = useState<'FREIGHT PREPAID' | 'FREIGHT COLLECT'>('FREIGHT PREPAID');
  const [paymentLocation, setPaymentLocation] = useState('Origin (Los Angeles, CA)');
  const [currency, setCurrency] = useState('USD');

  // Rates
  const [baseRatePerBox, setBaseRatePerBox] = useState(2450);
  const [bafPerBox, setBafPerBox] = useState(320);
  const [thcOriginPerBox, setThcOriginPerBox] = useState(280);
  const [thcDestPerBox, setThcDestPerBox] = useState(240);
  const [documentationFee, setDocumentationFee] = useState(85);
  const [sealSecurityFee, setSealSecurityFee] = useState(35);

  // B/L Instructions
  const [blType, setBlType] = useState('Negotiable FIATA Ocean House Bill of Lading (3/3 Originals)');
  const [consigneeStyle, setConsigneeStyle] = useState<'Direct' | 'To Order'>('To Order');
  const [orderOfEntity, setOrderOfEntity] = useState('TO THE ORDER OF SHENZHEN INDUSTRIAL BANK');
  const [carrierClauses, setCarrierClauses] = useState('CLEAN ON BOARD OCEAN VESSEL. SHIPPER LOAD, STOW, WEIGHT AND COUNT. CARGO SECURED AGAINST MARITIME STRESS.');

  // Total container count
  const totalContainersCount = containerSlots.reduce((sum, s) => sum + s.quantity, 0);

  // Auto-calculated Total Freight
  const totalOceanBase = baseRatePerBox * totalContainersCount;
  const totalBaf = bafPerBox * totalContainersCount;
  const totalThcOrigin = thcOriginPerBox * totalContainersCount;
  const totalThcDest = thcDestPerBox * totalContainersCount;
  const totalFreightAmount = totalOceanBase + totalBaf + totalThcOrigin + totalThcDest + documentationFee + sealSecurityFee;

  // Auto-calculated SOLAS Total VGM
  const calculatedTotalVgmKg = cargoGrossWeightKg + totalTareWeightKg;

  // Load Draft from LocalStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('shiplot_draft_fcl_booking');
      if (saved) {
        const d = JSON.parse(saved);
        if (d.shipperName) setShipperName(d.shipperName);
        if (d.consigneeName) setConsigneeName(d.consigneeName);
        if (d.vesselName) setVesselName(d.vesselName);
        if (d.pol) setPol(d.pol);
        if (d.pod) setPod(d.pod);
        if (d.cargoDesc) setCargoDesc(d.cargoDesc);
        if (d.baseRatePerBox) setBaseRatePerBox(d.baseRatePerBox);
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
      carrier,
      vesselName,
      imoNumber,
      voyageNo,
      pol,
      polCode,
      pod,
      podCode,
      placeOfReceipt,
      placeOfDelivery,
      etd,
      eta,
      cargoCutOff,
      containerSlots,
      emptyDepot,
      demurrageDestFreeDays,
      detentionFreeDays,
      isReefer,
      isDangerousGoods,
      cargoDesc,
      hsCode,
      packagesCount,
      cargoGrossWeightKg,
      totalTareWeightKg,
      incoterms,
      freightTerms,
      baseRatePerBox,
      totalFreightAmount,
      blType,
      updatedAt: new Date().toLocaleTimeString()
    };

    try {
      localStorage.setItem('shiplot_draft_fcl_booking', JSON.stringify(draftPayload));
    } catch {}

    setDraftSavedMessage(`Draft saved locally at ${new Date().toLocaleTimeString()} UTC`);
    setTimeout(() => setDraftSavedMessage(null), 3000);
  };

  // Add container slot row
  const addContainerSlot = () => {
    setContainerSlots(prev => [
      ...prev,
      {
        id: `slot_${Date.now()}`,
        type: '20GP',
        quantity: 1,
        ownership: 'COC',
        tareWeightKg: 2280,
        maxPayloadKg: 28200,
        grossWeightPerUnitKg: 14000
      }
    ]);
  };

  // Remove container slot row
  const removeContainerSlot = (id: string) => {
    if (containerSlots.length <= 1) return;
    setContainerSlots(prev => prev.filter(s => s.id !== id));
  };

  // Submit Final FCL Booking
  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();

    const newBooking: Booking = {
      id: `bk_${Date.now()}`,
      bookingNo,
      requestDate,
      shipper: shipperName,
      consignee: consigneeName,
      type: 'FCL',
      direction: 'Export',
      pol: `${pol} (${polCode})`,
      pod: `${pod} (${podCode})`,
      containerType: containerSlots.map(s => `${s.quantity}x${s.type}`).join(', '),
      containerQty: totalContainersCount,
      cargoDesc,
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
      contractNo: serviceContractNo,
      tradeLane,
      placeOfReceipt,
      placeOfDelivery,
      targetEta: eta,
      cargoCutOff,
      siCutOff,
      vgmCutOff,
      grossWeightKg: cargoGrossWeightKg,
      tareWeightKg: totalTareWeightKg,
      vgmKg: calculatedTotalVgmKg,
      vgmMethod: solasVgmMethod,
      packagesCount,
      hsCode,
      incoterms,
      freightTerms,
      demurrageFreeDays: demurrageDestFreeDays,
      detentionFreeDays,
      emptyDepot,
      isDangerousGoods,
      dgDetails: isDangerousGoods ? `${dgImoClass}, ${dgUnNumber}, PG ${dgPackingGroup}` : undefined,
      isReefer,
      reeferDetails: isReefer ? `Temp: ${reeferTemp}, Vent: ${reeferVent}, Hum: ${reeferHumidity}` : undefined,
      blType,
      specialInstructions: carrierClauses
    };

    // Add to AppContext bookings
    addBooking(newBooking);

    // Also auto-generate active Shipment record for NVOCC tracking
    const newShipment: Shipment = {
      id: `shp_${Date.now()}`,
      shipmentNo: `SHP-${bookingNo.replace('FCL-BK-', '')}`,
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
      carrierCode: carrier.includes('MSC') ? 'MSCU' : 'MAEU',
      vesselName,
      voyageNo,
      type: 'FCL',
      direction: 'Export',
      status: 'Booking Confirmed',
      containersCount: totalContainersCount,
      weightKg: cargoGrossWeightKg,
      cargoDesc
    };
    addShipment(newShipment);

    // Auto-generate Equipment Container records
    containerSlots.forEach((slot, sIdx) => {
      for (let i = 0; i < slot.quantity; i++) {
        const prefix = carrier.includes('MSC') ? 'MSCU' : 'PCXU';
        const randomNum = Math.floor(1000000 + Math.random() * 9000000);
        const newCnt: Container = {
          id: `cnt_${Date.now()}_${sIdx}_${i}`,
          containerNo: `${prefix}${randomNum}`,
          sealNo: `SL-${Math.floor(100000 + Math.random() * 900000)}`,
          type: slot.type,
          vesselName,
          voyage: voyageNo,
          pol: `${pol} (${polCode})`,
          pod: `${pod} (${podCode})`,
          status: 'Loaded',
          demurrageFreeDays: demurrageDestFreeDays,
          daysRemaining: demurrageDestFreeDays,
          demurrageRisk: 'safe',
          grossWeightKg: slot.grossWeightPerUnitKg,
          vgmKg: slot.grossWeightPerUnitKg + slot.tareWeightKg,
          locationStatus: 'Booked',
          ownership: slot.ownership,
          currentLocation: emptyDepot
        };
        addContainer(newCnt);
      }
    });

    // Clear Draft
    try {
      localStorage.removeItem('shiplot_draft_fcl_booking');
    } catch {}

    setBookingSubmitted(newBooking);
    if (onBookingCreated) {
      onBookingCreated(newBooking);
    }
  };

  const tabs: { id: FclTab; label: string; icon: React.ElementType }[] = [
    { id: 'parties', label: '1. Parties & Contract', icon: Building2 },
    { id: 'voyage', label: '2. Routing & Schedule', icon: Ship },
    { id: 'equipment', label: '3. Equipment & Haulage', icon: Box },
    { id: 'cargo', label: '4. Cargo & SOLAS VGM', icon: Scale },
    { id: 'freight', label: '5. Freight & B/L Terms', icon: DollarSign }
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
              FCL Ocean Freight Booking Confirmed
            </h2>
            <p className="text-xs text-neutral-500 mt-1">
              Booking Ref #{bookingSubmitted.bookingNo} allocated to vessel {bookingSubmitted.targetVessel}
            </p>
          </div>

          <div className="max-w-md mx-auto p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 text-xs text-left space-y-1.5">
            <div className="flex justify-between">
              <span className="text-neutral-400">Shipper:</span>
              <span className="font-bold text-neutral-900 dark:text-white">{bookingSubmitted.shipper}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Route:</span>
              <span className="font-bold text-neutral-900 dark:text-white">{bookingSubmitted.pol} → {bookingSubmitted.pod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Containers:</span>
              <span className="font-bold text-neutral-900 dark:text-white">{bookingSubmitted.containerQty} Boxes ({bookingSubmitted.containerType})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Total Freight:</span>
              <span className="font-bold text-neutral-900 dark:text-white">${bookingSubmitted.totalFreightUsd.toLocaleString()} USD</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Status:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">Slot Allocated & Equipment Reserved</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setBookingSubmitted(null);
                setBookingNo(`FCL-BK-2026-${Math.floor(1000 + Math.random() * 9000)}`);
              }}
              className="px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              + Create Another FCL Booking
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
                  FCL SPECIFICATION FORM
                </span>
                <span className="text-xs font-mono font-bold text-neutral-900 dark:text-white">
                  Ref #{bookingNo}
                </span>
                <span className="text-[11px] font-mono text-neutral-400 hidden sm:inline">
                  Carrier: {currentCompany.name}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white tracking-tight mt-1 font-sans">
                Full Container Load (FCL) Ocean Freight Master Booking Order
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
            {/* TAB 1: PARTIES & SERVICE CONTRACT */}
            {/* ========================================================= */}
            {activeTab === 'parties' && (
              <div className="space-y-6 animate-fade-in">
                {/* Header Meta */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40">
                  <div>
                    <label className="block text-neutral-500 mb-1 text-[11px]">Booking Order Reference *</label>
                    <input
                      type="text"
                      required
                      value={bookingNo}
                      onChange={e => setBookingNo(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-500 mb-1 text-[11px]">Booking Request Date</label>
                    <input
                      type="date"
                      value={requestDate}
                      onChange={e => setRequestDate(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-500 mb-1 text-[11px]">Shipper Commercial PO / Ref</label>
                    <input
                      type="text"
                      placeholder="e.g. PO-USA-99210"
                      value={shipperRef}
                      onChange={e => setShipperRef(e.target.value)}
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
                        <span>Shipper / Exporter (Origin)</span>
                      </span>
                      <span className="text-[10px] text-neutral-400 font-mono">Principal Consignor</span>
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
                          <label className="block text-neutral-500 mb-1">Tax ID / NTN / EIN</label>
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
                        <label className="block text-neutral-500 mb-1">Address & City, Country</label>
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
                        <span>Consignee / Importer (Destination)</span>
                      </span>
                      <span className="text-[10px] text-neutral-400 font-mono">Cargo Receiver</span>
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
                          <label className="block text-neutral-500 mb-1">USCC / EORI / Tax ID</label>
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
                        <label className="block text-neutral-500 mb-1">Destination Physical Address</label>
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

                {/* Notify Party & Service Contract */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Notify Box */}
                  <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-3">
                    <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-2">
                      <span className="font-bold text-neutral-900 dark:text-white font-sans text-sm">
                        Notify Party (Arrival Notice Receiver)
                      </span>
                      <label className="flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-400 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifySameAsConsignee}
                          onChange={e => setNotifySameAsConsignee(e.target.checked)}
                          className="rounded border-neutral-300 dark:border-neutral-700"
                        />
                        <span>Same as Consignee</span>
                      </label>
                    </div>

                    {!notifySameAsConsignee && (
                      <div className="space-y-2.5">
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
                        Carrier Arrival Notice will be dispatched directly to Consignee ({consigneeName}).
                      </p>
                    )}
                  </div>

                  {/* Contract Details */}
                  <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-3">
                    <span className="font-bold text-neutral-900 dark:text-white font-sans text-sm block border-b border-neutral-100 dark:border-neutral-800 pb-2">
                      FMC Service Contract & Trade Route
                    </span>

                    <div className="space-y-2.5">
                      <div>
                        <label className="block text-neutral-500 mb-1">FMC Service Contract / Bullet Ref</label>
                        <input
                          type="text"
                          value={serviceContractNo}
                          onChange={e => setServiceContractNo(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-neutral-500 mb-1">Spot Quotation Reference</label>
                        <input
                          type="text"
                          value={quotationRef}
                          onChange={e => setQuotationRef(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-neutral-500 mb-1">Trade Lane / Geographical Corridor</label>
                        <select
                          value={tradeLane}
                          onChange={e => setTradeLane(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                        >
                          <option>Trans-Pacific Eastbound (Asia -&gt; North America)</option>
                          <option>Trans-Pacific Westbound (North America -&gt; Asia)</option>
                          <option>Asia - Europe / Mediterranean</option>
                          <option>Trans-Atlantic (Europe &lt;-&gt; North America)</option>
                          <option>Far East - Arabian Gulf &amp; Subcontinent</option>
                          <option>Intra-Asia Feeder Network</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* TAB 2: ROUTING & VESSEL SCHEDULE */}
            {/* ========================================================= */}
            {activeTab === 'voyage' && (
              <div className="space-y-6 animate-fade-in">
                {/* Vessel & Carrier Specs */}
                <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-4">
                  <h3 className="font-bold text-sm text-neutral-900 dark:text-white font-sans flex items-center gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-2">
                    <Ship className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
                    <span>Liner Carrier & Ocean Vessel Specifications</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-neutral-500 mb-1">Ocean Carrier / Shipping Line *</label>
                      <select
                        value={carrier}
                        onChange={e => setCarrier(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                      >
                        <option>Mediterranean Shipping Company (MSC)</option>
                        <option>Maersk Line</option>
                        <option>CMA CGM Group</option>
                        <option>COSCO Shipping Lines</option>
                        <option>Hapag-Lloyd</option>
                        <option>Ocean Network Express (ONE)</option>
                        <option>Evergreen Marine Corp</option>
                        <option>Yang Ming Line</option>
                        <option>HMM (Hyundai Merchant Marine)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-neutral-500 mb-1">Mother Vessel Name *</label>
                      <input
                        type="text"
                        required
                        value={vesselName}
                        onChange={e => setVesselName(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-neutral-500 mb-1">IMO Number</label>
                      <input
                        type="text"
                        value={imoNumber}
                        onChange={e => setImoNumber(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-neutral-500 mb-1">Voyage No / Service Loop</label>
                      <input
                        type="text"
                        value={voyageNo}
                        onChange={e => setVoyageNo(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Ports & Rotation */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* POL */}
                  <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-3">
                    <span className="font-bold text-neutral-900 dark:text-white font-sans text-sm flex items-center gap-1.5 border-b border-neutral-100 dark:border-neutral-800 pb-2">
                      <Anchor className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
                      <span>Port of Loading (POL - Origin)</span>
                    </span>

                    <div className="space-y-2.5">
                      <div>
                        <label className="block text-neutral-500 mb-1">Port Name & Terminal *</label>
                        <input
                          type="text"
                          required
                          value={pol}
                          onChange={e => setPol(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-neutral-500 mb-1">UN/LOCODE</label>
                          <input
                            type="text"
                            value={polCode}
                            onChange={e => setPolCode(e.target.value.toUpperCase())}
                            className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-neutral-500 mb-1">Inland Place of Receipt</label>
                          <input
                            type="text"
                            value={placeOfReceipt}
                            onChange={e => setPlaceOfReceipt(e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* POD */}
                  <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-3">
                    <span className="font-bold text-neutral-900 dark:text-white font-sans text-sm flex items-center gap-1.5 border-b border-neutral-100 dark:border-neutral-800 pb-2">
                      <Anchor className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
                      <span>Port of Discharge (POD - Destination)</span>
                    </span>

                    <div className="space-y-2.5">
                      <div>
                        <label className="block text-neutral-500 mb-1">Port Name & Terminal *</label>
                        <input
                          type="text"
                          required
                          value={pod}
                          onChange={e => setPod(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-neutral-500 mb-1">UN/LOCODE</label>
                          <input
                            type="text"
                            value={podCode}
                            onChange={e => setPodCode(e.target.value.toUpperCase())}
                            className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-neutral-500 mb-1">Final Place of Delivery</label>
                          <input
                            type="text"
                            value={placeOfDelivery}
                            onChange={e => setPlaceOfDelivery(e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Key Operational Cut-Offs & Schedule */}
                <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-3">
                  <span className="font-bold text-neutral-900 dark:text-white font-sans text-sm block border-b border-neutral-100 dark:border-neutral-800 pb-2">
                    Vessel Schedule & Critical Terminal Cut-Off Deadlines
                  </span>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    <div>
                      <label className="block text-neutral-500 mb-1 text-[11px]">Estimated Departure (ETD) *</label>
                      <input
                        type="date"
                        required
                        value={etd}
                        onChange={e => setEtd(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-500 mb-1 text-[11px]">Estimated Arrival (ETA) *</label>
                      <input
                        type="date"
                        required
                        value={eta}
                        onChange={e => setEta(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-500 mb-1 text-[11px]">Cargo Gate-In Cut-off</label>
                      <input
                        type="text"
                        value={cargoCutOff}
                        onChange={e => setCargoCutOff(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-500 mb-1 text-[11px]">SI Documentation Cut-off</label>
                      <input
                        type="text"
                        value={siCutOff}
                        onChange={e => setSiCutOff(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-500 mb-1 text-[11px]">SOLAS VGM Cut-off</label>
                      <input
                        type="text"
                        value={vgmCutOff}
                        onChange={e => setVgmCutOff(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* TAB 3: EQUIPMENT, CONTAINERS & HAULAGE */}
            {/* ========================================================= */}
            {activeTab === 'equipment' && (
              <div className="space-y-6 animate-fade-in">
                {/* Equipment Configuration Table */}
                <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-3">
                  <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-2">
                    <div>
                      <h3 className="font-bold text-sm text-neutral-900 dark:text-white font-sans">
                        FCL Container Allocation Matrix ({totalContainersCount} Containers)
                      </h3>
                      <p className="text-[11px] text-neutral-500">
                        Specify equipment dimensions, container ownership, tare specifications, and expected gross payload.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={addContainerSlot}
                      className="flex items-center gap-1 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-200 dark:text-neutral-900 rounded-lg text-xs font-semibold cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Equipment Size</span>
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-mono">
                      <thead className="text-[11px] text-neutral-400 border-b border-neutral-200 dark:border-neutral-800">
                        <tr>
                          <th className="py-2 px-2">Equipment Type</th>
                          <th className="py-2 px-2">Quantity</th>
                          <th className="py-2 px-2">Ownership</th>
                          <th className="py-2 px-2">Tare Weight (kg)</th>
                          <th className="py-2 px-2">Max Payload (kg)</th>
                          <th className="py-2 px-2">Est. Gross / Unit (kg)</th>
                          <th className="py-2 px-2 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                        {containerSlots.map((slot, index) => (
                          <tr key={slot.id}>
                            <td className="py-2.5 px-2">
                              <select
                                value={slot.type}
                                onChange={e => {
                                  const val = e.target.value;
                                  const is20 = val.includes('20');
                                  setContainerSlots(prev => prev.map(s => s.id === slot.id ? {
                                    ...s,
                                    type: val,
                                    tareWeightKg: is20 ? 2280 : 3820,
                                    maxPayloadKg: is20 ? 28200 : 28680
                                  } : s));
                                }}
                                className="px-2.5 py-1 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 font-bold"
                              >
                                <option value="20GP">20&#39; Standard General Purpose (20GP)</option>
                                <option value="40GP">40&#39; Standard General Purpose (40GP)</option>
                                <option value="40HC">40&#39; High Cube Dry (40HC)</option>
                                <option value="45HC">45&#39; High Cube Dry (45HC)</option>
                                <option value="20RF">20&#39; Reefer (Refrigerated)</option>
                                <option value="40HR">40&#39; High Cube Reefer (40HR)</option>
                                <option value="20OT">20&#39; Open Top</option>
                                <option value="40FR">40&#39; Flat Rack</option>
                                <option value="20TK">20&#39; ISO Tank Container</option>
                              </select>
                            </td>

                            <td className="py-2.5 px-2">
                              <input
                                type="number"
                                min={1}
                                max={100}
                                value={slot.quantity}
                                onChange={e => {
                                  const q = parseInt(e.target.value) || 1;
                                  setContainerSlots(prev => prev.map(s => s.id === slot.id ? { ...s, quantity: q } : s));
                                }}
                                className="w-16 px-2 py-1 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-center font-bold"
                              />
                            </td>

                            <td className="py-2.5 px-2">
                              <select
                                value={slot.ownership}
                                onChange={e => {
                                  const own = e.target.value as 'COC' | 'SOC';
                                  setContainerSlots(prev => prev.map(s => s.id === slot.id ? { ...s, ownership: own } : s));
                                }}
                                className="px-2 py-1 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                              >
                                <option value="COC">COC (Carrier Owned)</option>
                                <option value="SOC">SOC (Shipper Owned)</option>
                              </select>
                            </td>

                            <td className="py-2.5 px-2">
                              <input
                                type="number"
                                value={slot.tareWeightKg}
                                onChange={e => {
                                  const val = parseInt(e.target.value) || 0;
                                  setContainerSlots(prev => prev.map(s => s.id === slot.id ? { ...s, tareWeightKg: val } : s));
                                }}
                                className="w-24 px-2 py-1 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
                              />
                            </td>

                            <td className="py-2.5 px-2 text-neutral-500">
                              {slot.maxPayloadKg.toLocaleString()} kg
                            </td>

                            <td className="py-2.5 px-2">
                              <input
                                type="number"
                                value={slot.grossWeightPerUnitKg}
                                onChange={e => {
                                  const val = parseInt(e.target.value) || 0;
                                  setContainerSlots(prev => prev.map(s => s.id === slot.id ? { ...s, grossWeightPerUnitKg: val } : s));
                                }}
                                className="w-28 px-2 py-1 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 font-bold"
                              />
                            </td>

                            <td className="py-2.5 px-2 text-right">
                              {containerSlots.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeContainerSlot(slot.id)}
                                  className="text-neutral-400 hover:text-rose-600 p-1 cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Depot & Free Time Terms */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Depots */}
                  <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-3">
                    <span className="font-bold text-neutral-900 dark:text-white font-sans text-sm block border-b border-neutral-100 dark:border-neutral-800 pb-2">
                      Empty Pick-up & Full Return Terminal Facilities
                    </span>
                    <div>
                      <label className="block text-neutral-500 mb-1">Empty Container Release Depot *</label>
                      <input
                        type="text"
                        value={emptyDepot}
                        onChange={e => setEmptyDepot(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-500 mb-1">Empty Release Authorization Ref</label>
                      <input
                        type="text"
                        value={emptyReleaseRef}
                        onChange={e => setEmptyReleaseRef(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-500 mb-1">Full Container Return CY Terminal *</label>
                      <input
                        type="text"
                        value={fullReturnTerminal}
                        onChange={e => setFullReturnTerminal(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Free-Time Agreement */}
                  <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-3">
                    <span className="font-bold text-neutral-900 dark:text-white font-sans text-sm block border-b border-neutral-100 dark:border-neutral-800 pb-2">
                      Contractual Demurrage & Detention Free-Time
                    </span>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-neutral-500 mb-1 text-[11px]">Origin Free Days</label>
                        <input
                          type="number"
                          value={demurrageOriginFreeDays}
                          onChange={e => setDemurrageOriginFreeDays(parseInt(e.target.value) || 7)}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-center font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-neutral-500 mb-1 text-[11px]">Destination Free</label>
                        <input
                          type="number"
                          value={demurrageDestFreeDays}
                          onChange={e => setDemurrageDestFreeDays(parseInt(e.target.value) || 14)}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-center font-bold text-emerald-600 dark:text-emerald-400"
                        />
                      </div>
                      <div>
                        <label className="block text-neutral-500 mb-1 text-[11px]">Detention Days</label>
                        <input
                          type="number"
                          value={detentionFreeDays}
                          onChange={e => setDetentionFreeDays(parseInt(e.target.value) || 10)}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-center font-bold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-neutral-500 mb-1">Haulage Drayage Mode</label>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <label className={`p-2 rounded-lg border flex items-center gap-2 cursor-pointer ${
                          haulageMode === 'Merchant' ? 'border-neutral-900 bg-neutral-100 dark:border-white dark:bg-neutral-800 font-bold' : 'border-neutral-200 dark:border-neutral-800'
                        }`}>
                          <input
                            type="radio"
                            name="haulage"
                            checked={haulageMode === 'Merchant'}
                            onChange={() => setHaulageMode('Merchant')}
                          />
                          <span>Merchant Haulage</span>
                        </label>
                        <label className={`p-2 rounded-lg border flex items-center gap-2 cursor-pointer ${
                          haulageMode === 'Carrier' ? 'border-neutral-900 bg-neutral-100 dark:border-white dark:bg-neutral-800 font-bold' : 'border-neutral-200 dark:border-neutral-800'
                        }`}>
                          <input
                            type="radio"
                            name="haulage"
                            checked={haulageMode === 'Carrier'}
                            onChange={() => setHaulageMode('Carrier')}
                          />
                          <span>Carrier Haulage</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Special Cargo: Reefer & Dangerous Goods (DG) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Reefer Controls */}
                  <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-3">
                    <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-2">
                      <span className="font-bold text-neutral-900 dark:text-white font-sans text-sm flex items-center gap-1.5">
                        <Thermometer className="w-4 h-4 text-blue-500" />
                        <span>Reefer Cargo Controls</span>
                      </span>
                      <label className="flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-400 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isReefer}
                          onChange={e => setIsReefer(e.target.checked)}
                          className="rounded border-neutral-300 dark:border-neutral-700"
                        />
                        <span>Temperature Controlled</span>
                      </label>
                    </div>

                    {isReefer ? (
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <label className="block text-neutral-500 mb-1">Temp Setpoint</label>
                          <input
                            type="text"
                            value={reeferTemp}
                            onChange={e => setReeferTemp(e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-neutral-500 mb-1">Ventilation</label>
                          <input
                            type="text"
                            value={reeferVent}
                            onChange={e => setReeferVent(e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-neutral-500 mb-1">Humidity</label>
                          <input
                            type="text"
                            value={reeferHumidity}
                            onChange={e => setReeferHumidity(e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                          />
                        </div>
                        <div className="flex items-center pt-5">
                          <label className="flex items-center gap-1.5 text-xs cursor-pointer">
                            <input
                              type="checkbox"
                              checked={gensetRequired}
                              onChange={e => setGensetRequired(e.target.checked)}
                            />
                            <span>Genset Required</span>
                          </label>
                        </div>
                      </div>
                    ) : (
                      <p className="text-neutral-400 text-xs italic">
                        Standard Dry Cargo. Ambient sea temperature voyage.
                      </p>
                    )}
                  </div>

                  {/* Dangerous Goods (DG) */}
                  <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-3">
                    <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-2">
                      <span className="font-bold text-neutral-900 dark:text-white font-sans text-sm flex items-center gap-1.5">
                        <ShieldAlert className="w-4 h-4 text-amber-500" />
                        <span>Hazardous / DG Declaration</span>
                      </span>
                      <label className="flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-400 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isDangerousGoods}
                          onChange={e => setIsDangerousGoods(e.target.checked)}
                          className="rounded border-neutral-300 dark:border-neutral-700"
                        />
                        <span>Dangerous Goods (DG)</span>
                      </label>
                    </div>

                    {isDangerousGoods ? (
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <label className="block text-neutral-500 mb-1">IMO Class</label>
                          <input
                            type="text"
                            value={dgImoClass}
                            onChange={e => setDgImoClass(e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-neutral-500 mb-1">UN Number</label>
                          <input
                            type="text"
                            value={dgUnNumber}
                            onChange={e => setDgUnNumber(e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white font-bold"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-neutral-500 mb-1">24-Hour Emergency Response Hotline</label>
                          <input
                            type="text"
                            value={dgEmergencyPhone}
                            onChange={e => setDgEmergencyPhone(e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                          />
                        </div>
                      </div>
                    ) : (
                      <p className="text-neutral-400 text-xs italic">
                        Certified Non-Hazardous Cargo (No IMDG classification required).
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* TAB 4: CARGO PARTICULARS & SOLAS VGM */}
            {/* ========================================================= */}
            {activeTab === 'cargo' && (
              <div className="space-y-6 animate-fade-in">
                {/* Cargo Details */}
                <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-3">
                  <span className="font-bold text-neutral-900 dark:text-white font-sans text-sm block border-b border-neutral-100 dark:border-neutral-800 pb-2">
                    Commercial Commodity & Packing Description
                  </span>

                  <div>
                    <label className="block text-neutral-500 mb-1">Commodity / Cargo Description *</label>
                    <textarea
                      rows={3}
                      required
                      value={cargoDesc}
                      onChange={e => setCargoDesc(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white font-sans"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-neutral-500 mb-1">Harmonized HS Tariff Code *</label>
                      <input
                        type="text"
                        required
                        value={hsCode}
                        onChange={e => setHsCode(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-500 mb-1">Packages Count & Type</label>
                      <input
                        type="text"
                        value={packagesCount}
                        onChange={e => setPackagesCount(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-500 mb-1">Declared Commercial Value ($ USD)</label>
                      <input
                        type="number"
                        value={declaredValueUsd}
                        onChange={e => setDeclaredValueUsd(parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white font-bold"
                      />
                    </div>
                  </div>
                </div>

                {/* SOLAS VGM Declaration */}
                <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-4">
                  <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-2">
                    <div>
                      <h3 className="font-bold text-sm text-neutral-900 dark:text-white font-sans flex items-center gap-1.5">
                        <Scale className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
                        <span>SOLAS Verified Gross Mass (VGM) Compliance Statement</span>
                      </h3>
                      <p className="text-[11px] text-neutral-500">
                        Mandatory under IMO SOLAS Chapter VI Regulation 2. Carrier will not load unverified containers.
                      </p>
                    </div>

                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded border border-emerald-200 dark:border-emerald-800">
                      Total VGM: {calculatedTotalVgmKg.toLocaleString()} KG
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-neutral-500 mb-1">Net Cargo Gross Weight (kg) *</label>
                      <input
                        type="number"
                        required
                        value={cargoGrossWeightKg}
                        onChange={e => setCargoGrossWeightKg(parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-neutral-500 mb-1">Total Container Tare (kg)</label>
                      <input
                        type="number"
                        value={totalTareWeightKg}
                        onChange={e => setTotalTareWeightKg(parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-neutral-500 mb-1">SOLAS VGM Verification Method</label>
                      <select
                        value={solasVgmMethod}
                        onChange={e => setSolasVgmMethod(e.target.value as any)}
                        className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white font-semibold"
                      >
                        <option>Method 1 (Weighbridge)</option>
                        <option>Method 2 (Calculated Component)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block text-neutral-500 mb-1">Certified Scale Station / Scale ID</label>
                      <input
                        type="text"
                        value={weighingStationName}
                        onChange={e => setWeighingStationName(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-500 mb-1">Authorized Weighmaster / Signatory Person</label>
                      <input
                        type="text"
                        value={vgmSignatoryName}
                        onChange={e => setVgmSignatoryName(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white font-bold"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* TAB 5: FREIGHT CHARGES, INCOTERMS & B/L INSTRUCTIONS */}
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
                      <option>DAP (Delivered at Place)</option>
                      <option>DDP (Delivered Duty Paid)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-neutral-500 mb-1">Freight Payment Terms *</label>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <label className={`p-2 rounded-lg border flex items-center justify-center cursor-pointer ${
                        freightTerms === 'FREIGHT PREPAID' ? 'border-neutral-900 bg-neutral-100 dark:border-white dark:bg-neutral-800 font-bold' : 'border-neutral-200 dark:border-neutral-800'
                      }`}>
                        <input
                          type="radio"
                          name="freightTerm"
                          checked={freightTerms === 'FREIGHT PREPAID'}
                          onChange={() => setFreightTerms('FREIGHT PREPAID')}
                          className="sr-only"
                        />
                        <span>Prepaid (Origin)</span>
                      </label>
                      <label className={`p-2 rounded-lg border flex items-center justify-center cursor-pointer ${
                        freightTerms === 'FREIGHT COLLECT' ? 'border-neutral-900 bg-neutral-100 dark:border-white dark:bg-neutral-800 font-bold' : 'border-neutral-200 dark:border-neutral-800'
                      }`}>
                        <input
                          type="radio"
                          name="freightTerm"
                          checked={freightTerms === 'FREIGHT COLLECT'}
                          onChange={() => setFreightTerms('FREIGHT COLLECT')}
                          className="sr-only"
                        />
                        <span>Collect (Dest)</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-neutral-500 mb-1">Payable At Location / Currency</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={paymentLocation}
                        onChange={e => setPaymentLocation(e.target.value)}
                        className="flex-1 px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                      />
                      <select
                        value={currency}
                        onChange={e => setCurrency(e.target.value)}
                        className="w-20 px-2 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 font-bold"
                      >
                        <option>USD</option>
                        <option>EUR</option>
                        <option>PKR</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Rating Itemized Grid */}
                <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-3">
                  <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-2">
                    <span className="font-bold text-neutral-900 dark:text-white font-sans text-sm flex items-center gap-1.5">
                      <DollarSign className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
                      <span>Itemized Commercial Freight Tariff ({totalContainersCount} Containers)</span>
                    </span>

                    <span className="text-base font-bold text-neutral-900 dark:text-white font-mono">
                      Total: ${totalFreightAmount.toLocaleString()} {currency}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-neutral-500 mb-1">Ocean Freight Base / Box</label>
                      <input
                        type="number"
                        value={baseRatePerBox}
                        onChange={e => setBaseRatePerBox(parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white font-bold"
                      />
                      <span className="text-[10px] text-neutral-400">Subtotal: ${totalOceanBase.toLocaleString()}</span>
                    </div>

                    <div>
                      <label className="block text-neutral-500 mb-1">Bunker BAF / Box</label>
                      <input
                        type="number"
                        value={bafPerBox}
                        onChange={e => setBafPerBox(parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                      />
                      <span className="text-[10px] text-neutral-400">Subtotal: ${totalBaf.toLocaleString()}</span>
                    </div>

                    <div>
                      <label className="block text-neutral-500 mb-1">THC Origin / Box</label>
                      <input
                        type="number"
                        value={thcOriginPerBox}
                        onChange={e => setThcOriginPerBox(parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                      />
                      <span className="text-[10px] text-neutral-400">Subtotal: ${totalThcOrigin.toLocaleString()}</span>
                    </div>

                    <div>
                      <label className="block text-neutral-500 mb-1">THC Destination / Box</label>
                      <input
                        type="number"
                        value={thcDestPerBox}
                        onChange={e => setThcDestPerBox(parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                      />
                      <span className="text-[10px] text-neutral-400">Subtotal: ${totalThcDest.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Ocean B/L Instructions */}
                <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-3">
                  <span className="font-bold text-neutral-900 dark:text-white font-sans text-sm block border-b border-neutral-100 dark:border-neutral-800 pb-2">
                    Bill of Lading (B/L) Issuance & Clauses
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-neutral-500 mb-1">Requested B/L Format</label>
                      <select
                        value={blType}
                        onChange={e => setBlType(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white font-semibold"
                      >
                        <option>Negotiable FIATA Ocean House Bill of Lading (3/3 Originals)</option>
                        <option>Sea Waybill / Express Release (No Originals Required)</option>
                        <option>Telex Release (Surrender at Origin)</option>
                        <option>Electronic Title Transfer (DCSA eBL)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-neutral-500 mb-1">Consignee Style on B/L Header</label>
                      <select
                        value={consigneeStyle}
                        onChange={e => setConsigneeStyle(e.target.value as any)}
                        className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                      >
                        <option value="Direct">Direct Named Consignee</option>
                        <option value="To Order">To Order of Shipper / Bank</option>
                      </select>
                    </div>

                    <div className="col-span-2">
                      <label className="block text-neutral-500 mb-1">Carrier Shipping Clauses & Remarks</label>
                      <input
                        type="text"
                        value={carrierClauses}
                        onChange={e => setCarrierClauses(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Controls & Next/Prev Navigation */}
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
                  <span>Confirm & Issue FCL Booking (${totalFreightAmount.toLocaleString()} USD)</span>
                </button>
              )}
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
