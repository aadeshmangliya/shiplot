import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Container, ContainerCommercialPurpose, ContainerConditionGrade } from '../types';
import { getPhotosForContainer } from '../mock/containerPhotos';
import {
  Box,
  Ship,
  Anchor,
  Warehouse,
  BookmarkCheck,
  Plus,
  Search,
  Filter,
  ArrowRight,
  Check,
  X,
  FileCheck2,
  Ticket,
  Scale,
  MapPin,
  Clock,
  Layers,
  Image,
  DollarSign,
  Tag,
  CheckCircle2,
  Upload,
  Camera,
  Eye,
  Calendar,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ContainersPage: React.FC = () => {
  const {
    containers,
    addContainer,
    updateContainerLocation,
    updateContainerCommercialStatus,
    sellContainer,
    updateContainerImages,
    currentCompany
  } = useApp();
  const navigate = useNavigate();

  // Primary Filter: Commercial Purpose
  const [commercialFilter, setCommercialFilter] = useState<'All' | 'Self-Use' | 'For-Booking' | 'For-Sale' | 'Leased-In' | 'Sold'>('All');
  
  // Secondary Location Filter
  const [locationFilter, setLocationFilter] = useState<'All' | 'Booked' | 'At Sea' | 'At Port' | 'In Warehouse'>('All');
  const [search, setSearch] = useState('');
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [draftSavedMsg, setDraftSavedMsg] = useState<string | null>(null);

  // Photo Viewer Modal
  const [activePhotoModalContainer, setActivePhotoModalContainer] = useState<Container | null>(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState<number>(0);

  // Photo Edit / Upload Modal
  const [activePhotoEditContainer, setActivePhotoEditContainer] = useState<Container | null>(null);
  const [editImage1, setEditImage1] = useState('');
  const [editImage2, setEditImage2] = useState('');
  const [editImage3, setEditImage3] = useState('');

  // Commercial Action Modals
  const [saleModalContainer, setSaleModalContainer] = useState<Container | null>(null);
  const [salePriceInput, setSalePriceInput] = useState<number>(2200);
  const [saleGradeInput, setSaleGradeInput] = useState<ContainerConditionGrade>('Cargo Worthy (CW)');

  const [sellRecordModalContainer, setSellRecordModalContainer] = useState<Container | null>(null);
  const [buyerNameInput, setBuyerNameInput] = useState('Global Logistics Traders Ltd');
  const [transactedPriceInput, setTransactedPriceInput] = useState<number>(2200);

  const [leaseModalContainer, setLeaseModalContainer] = useState<Container | null>(null);
  const [leaseRateInput, setLeaseRateInput] = useState<number>(22);

  // New Container Form State
  const [newContainerNo, setNewContainerNo] = useState(`PCXU${Math.floor(1000000 + Math.random() * 9000000)}`);
  const [newSealNo, setNewSealNo] = useState(`SL-${Math.floor(100000 + Math.random() * 900000)}`);
  const [newType, setNewType] = useState('40HC');
  const [newOwnership, setNewOwnership] = useState<'SOC' | 'COC'>('COC');
  const [newPurpose, setNewPurpose] = useState<ContainerCommercialPurpose>('Self-Use');
  const [newStatus, setNewStatus] = useState<Container['locationStatus']>('In Warehouse');
  const [newLocation, setNewLocation] = useState('Pacific Crest Central Warehouse, Bay 4');
  const [newClientOwner, setNewClientOwner] = useState(currentCompany.name);
  const [newTareWeight, setNewTareWeight] = useState(3820);
  const [newMaxPayload, setNewMaxPayload] = useState(28600);
  const [newGrossWeight, setNewGrossWeight] = useState(12500);
  const [newCscPlate, setNewCscPlate] = useState(`CSC-BV-${Math.floor(1000 + Math.random() * 9000)}`);
  const [newBuildYear, setNewBuildYear] = useState(2023);
  const [newManufacturer, setNewManufacturer] = useState('CIMC Container Holdings');
  const [newYardSlot, setNewYardSlot] = useState('Bay 04, Row 02, Tier 1');
  const [newFloorType, setNewFloorType] = useState<Container['floorType']>('Marine Hardwood');
  const [newSalePrice, setNewSalePrice] = useState(2400);
  const [newLeaseRate, setNewLeaseRate] = useState(25);
  const [newPhoto1, setNewPhoto1] = useState('');
  const [newPhoto2, setNewPhoto2] = useState('');
  const [newPhoto3, setNewPhoto3] = useState('');

  // Counts
  const totalCount = containers.length;
  const selfUseCount = containers.filter(c => !c.isSold && (c.commercialPurpose === 'Self-Use' || !c.commercialPurpose)).length;
  const forBookingCount = containers.filter(c => !c.isSold && c.commercialPurpose === 'For-Booking').length;
  const forSaleCount = containers.filter(c => !c.isSold && c.commercialPurpose === 'For-Sale').length;
  const leasedInCount = containers.filter(c => !c.isSold && c.commercialPurpose === 'Leased-In').length;
  const soldCount = containers.filter(c => c.isSold).length;

  // Filtered Containers
  const filteredContainers = containers.filter(c => {
    // Commercial filter
    if (commercialFilter === 'Sold') {
      if (!c.isSold) return false;
    } else if (commercialFilter === 'Self-Use') {
      if (c.isSold || (c.commercialPurpose && c.commercialPurpose !== 'Self-Use')) return false;
    } else if (commercialFilter !== 'All') {
      if (c.isSold || c.commercialPurpose !== commercialFilter) return false;
    }

    // Location filter
    if (locationFilter !== 'All' && c.locationStatus !== locationFilter) return false;

    // Search query
    if (search) {
      const q = search.toLowerCase();
      return (
        c.containerNo.toLowerCase().includes(q) ||
        c.sealNo.toLowerCase().includes(q) ||
        (c.currentLocation && c.currentLocation.toLowerCase().includes(q)) ||
        (c.clientOwner && c.clientOwner.toLowerCase().includes(q)) ||
        c.vesselName.toLowerCase().includes(q) ||
        (c.cscPlateNumber && c.cscPlateNumber.toLowerCase().includes(q)) ||
        (c.sourceProvider && c.sourceProvider.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleSaveDraft = () => {
    const time = new Date().toLocaleTimeString();
    try {
      localStorage.setItem('shiplot_container_draft', JSON.stringify({
        newContainerNo,
        newType,
        newOwnership,
        newPurpose,
        newLocation
      }));
    } catch {}
    setDraftSavedMsg(`Container draft saved at ${time}`);
    setTimeout(() => setDraftSavedMsg(null), 3000);
  };

  const handleCreateContainer = (e: React.FormEvent) => {
    e.preventDefault();
    const defaultPhotos = getPhotosForContainer(newType, newContainerNo);
    const finalPhotos: [string, string, string] = [
      newPhoto1 || defaultPhotos[0],
      newPhoto2 || defaultPhotos[1],
      newPhoto3 || defaultPhotos[2]
    ];

    const newCnt: Container = {
      id: `cnt_${Date.now()}`,
      containerNo: newContainerNo.toUpperCase(),
      sealNo: newSealNo,
      type: newType,
      vesselName: newStatus === 'At Sea' ? 'MSC Oscar' : newLocation,
      voyage: 'INV-2026',
      pol: 'Port of Los Angeles (USLAX)',
      pod: 'Port of Shanghai (CNSHA)',
      status: newStatus === 'At Sea' ? 'In Transit' : newStatus === 'At Port' ? 'Discharged' : 'Gated Out',
      demurrageFreeDays: 14,
      daysRemaining: 14,
      demurrageRisk: 'safe',
      grossWeightKg: Number(newGrossWeight),
      vgmKg: Number(newGrossWeight) + Number(newTareWeight),
      locationStatus: newStatus,
      ownership: newOwnership,
      currentLocation: newLocation,
      tareWeightKg: Number(newTareWeight),
      maxPayloadKg: Number(newMaxPayload),
      clientOwner: newClientOwner,
      commercialPurpose: newPurpose,
      conditionGrade: 'IICL-5',
      images: finalPhotos,
      imageCaptions: ['Front / Door & CSC Plate', 'Exterior Side Profile', 'Interior Clean Floor'],
      cscPlateNumber: newCscPlate,
      manufactureYear: Number(newBuildYear),
      manufacturer: newManufacturer,
      yardSlot: newYardSlot,
      floorType: newFloorType,
      sourceProvider: newOwnership === 'COC' ? 'Company Owned (Direct Asset Title)' : 'Shipper Owned (SOC)',
      salePriceUsd: newPurpose === 'For-Sale' ? Number(newSalePrice) : undefined,
      leaseDailyRateUsd: newPurpose === 'For-Booking' ? Number(newLeaseRate) : undefined
    };

    addContainer(newCnt);
    setIsAddFormOpen(false);
  };

  const handleOpenPhotoEdit = (container: Container) => {
    setActivePhotoEditContainer(container);
    const imgs = container.images || getPhotosForContainer(container.type, container.id);
    setEditImage1(imgs[0] || '');
    setEditImage2(imgs[1] || '');
    setEditImage3(imgs[2] || '');
  };

  const handleSaveEditedPhotos = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePhotoEditContainer) return;
    const defaultPhotos = getPhotosForContainer(activePhotoEditContainer.type, activePhotoEditContainer.id);
    const updated = [
      editImage1 || defaultPhotos[0],
      editImage2 || defaultPhotos[1],
      editImage3 || defaultPhotos[2]
    ];
    updateContainerImages(activePhotoEditContainer.id, updated);
    setActivePhotoEditContainer(null);
  };

  // Convert uploaded image file to Data URL
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, slot: 1 | 2 | 3) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (slot === 1) setEditImage1(result);
        if (slot === 2) setEditImage2(result);
        if (slot === 3) setEditImage3(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirmListForSale = (e: React.FormEvent) => {
    e.preventDefault();
    if (!saleModalContainer) return;
    updateContainerCommercialStatus(saleModalContainer.id, 'For-Sale', {
      salePriceUsd: Number(salePriceInput),
      conditionGrade: saleGradeInput
    });
    setSaleModalContainer(null);
  };

  const handleConfirmSell = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sellRecordModalContainer) return;
    sellContainer(sellRecordModalContainer.id, buyerNameInput, Number(transactedPriceInput));
    setSellRecordModalContainer(null);
  };

  const handleConfirmLease = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaseModalContainer) return;
    updateContainerCommercialStatus(leaseModalContainer.id, 'For-Booking', {
      leaseDailyRateUsd: Number(leaseRateInput)
    });
    setLeaseModalContainer(null);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto font-sans text-neutral-900 dark:text-neutral-100 select-text">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 flex items-center gap-1.5">
              <Box className="w-3.5 h-3.5" />
              CONTAINER FLEET &amp; COMMERCIAL ASSETS
            </span>
            <span className="text-xs text-neutral-400 font-mono">
              Self-Use · Sub-Lease Booking · Container Sales
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight mt-1.5">
            NVOCC Container Fleet Asset Management
          </h1>
          <p className="text-xs text-neutral-500 font-mono mt-0.5">
            Manage company-owned container equipment, 3-point visual condition surveys, booking allocations, trading sales, and 3rd party leased-in boxes.
          </p>
        </div>

        <button
          onClick={() => setIsAddFormOpen(!isAddFormOpen)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-mono font-bold transition-all shadow-xs self-start sm:self-auto cursor-pointer ${
            isAddFormOpen
              ? 'bg-neutral-200 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700'
              : 'bg-neutral-950 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-200 dark:text-neutral-950'
          }`}
        >
          {isAddFormOpen ? (
            <>
              <X className="w-4 h-4" />
              <span>Close Form</span>
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              <span>+ Register Container Asset</span>
            </>
          )}
        </button>
      </div>

      {/* 5 KPI Cards for Commercial Inventory */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 font-mono text-xs">
        <div className="p-3.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <div className="flex items-center justify-between text-neutral-400 text-[11px]">
            <span>Total Fleet</span>
            <Box className="w-3.5 h-3.5" />
          </div>
          <div className="text-xl font-bold mt-1 text-neutral-900 dark:text-white">{totalCount}</div>
          <div className="text-[10px] text-neutral-500">Active tracked assets</div>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <div className="flex items-center justify-between text-neutral-400 text-[11px]">
            <span>Company Self-Use</span>
            <Ship className="w-3.5 h-3.5 text-blue-500" />
          </div>
          <div className="text-xl font-bold mt-1 text-blue-600 dark:text-blue-400">{selfUseCount}</div>
          <div className="text-[10px] text-neutral-500">Allocated to liner bookings</div>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <div className="flex items-center justify-between text-neutral-400 text-[11px]">
            <span>Available for Lease</span>
            <Calendar className="w-3.5 h-3.5 text-indigo-500" />
          </div>
          <div className="text-xl font-bold mt-1 text-indigo-600 dark:text-indigo-400">{forBookingCount}</div>
          <div className="text-[10px] text-neutral-500">Sub-lease / charter ready</div>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <div className="flex items-center justify-between text-neutral-400 text-[11px]">
            <span>Listed for Sale</span>
            <Tag className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <div className="text-xl font-bold mt-1 text-emerald-600 dark:text-emerald-400">{forSaleCount}</div>
          <div className="text-[10px] text-neutral-500">Secondary trading inventory</div>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <div className="flex items-center justify-between text-neutral-400 text-[11px]">
            <span>Sold Assets</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-neutral-400" />
          </div>
          <div className="text-xl font-bold mt-1 text-neutral-700 dark:text-neutral-300">{soldCount}</div>
          <div className="text-[10px] text-neutral-500">Transacted off-fleet</div>
        </div>
      </div>

      {/* On-Page Inline Container Registration Form */}
      {isAddFormOpen && (
        <div className="rounded-2xl border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xl overflow-hidden font-mono text-xs">
          <div className="bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Box className="w-4 h-4" />
              <span className="font-bold text-sm">
                Register New Container Equipment &amp; Upload 3 Condition Images
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSaveDraft}
                className="px-2.5 py-1 rounded border border-neutral-700 dark:border-neutral-300 text-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-neutral-100 flex items-center gap-1 cursor-pointer"
              >
                <BookmarkCheck className="w-3.5 h-3.5" />
                <span>Save Draft</span>
              </button>
              <button
                type="button"
                onClick={() => setIsAddFormOpen(false)}
                className="p-1 hover:bg-neutral-800 dark:hover:bg-neutral-200 rounded cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {draftSavedMsg && (
            <div className="bg-neutral-100 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 px-5 py-1.5 flex items-center justify-between text-neutral-900 dark:text-white">
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-500" /> {draftSavedMsg}
              </span>
            </div>
          )}

          <form onSubmit={handleCreateContainer} className="p-5 sm:p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="block text-neutral-500 mb-1">Container Number (ISO 6346) *</label>
                <input
                  type="text"
                  required
                  value={newContainerNo}
                  onChange={e => setNewContainerNo(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-neutral-500 mb-1">Size / ISO Type *</label>
                <select
                  value={newType}
                  onChange={e => setNewType(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white font-bold"
                >
                  <option>20GP (20' Standard Dry)</option>
                  <option>40GP (40' Standard Dry)</option>
                  <option>40HC (40' High Cube)</option>
                  <option>45HC (45' High Cube)</option>
                  <option>20RF (20' Reefer)</option>
                  <option>40RF (40' High Cube Reefer)</option>
                  <option>20FR (20' Flat Rack)</option>
                  <option>40FR (40' Flat Rack)</option>
                  <option>20OT (20' Open Top)</option>
                  <option>40OT (40' Open Top)</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-500 mb-1">Commercial Purpose / Intent *</label>
                <select
                  value={newPurpose}
                  onChange={e => setNewPurpose(e.target.value as ContainerCommercialPurpose)}
                  className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white font-bold"
                >
                  <option value="Self-Use">🏢 Self-Use (Active Liner Fleet)</option>
                  <option value="For-Booking">📅 Available for Booking / Sub-Lease</option>
                  <option value="For-Sale">🏷️ Listed for Sale (Container Trading)</option>
                  <option value="Leased-In">🔄 Leased-In / Sourced from 3rd Party</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-500 mb-1">Ownership Type</label>
                <select
                  value={newOwnership}
                  onChange={e => setNewOwnership(e.target.value as 'SOC' | 'COC')}
                  className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                >
                  <option value="COC">COC (Carrier Owned Container)</option>
                  <option value="SOC">SOC (Shipper Owned Container)</option>
                </select>
              </div>
            </div>

            {/* Technical Specifications */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40">
              <div>
                <label className="block text-neutral-500 mb-1">CSC Plate Number</label>
                <input
                  type="text"
                  value={newCscPlate}
                  onChange={e => setNewCscPlate(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-[11px]"
                />
              </div>

              <div>
                <label className="block text-neutral-500 mb-1">Year Built</label>
                <input
                  type="number"
                  value={newBuildYear}
                  onChange={e => setNewBuildYear(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-[11px]"
                />
              </div>

              <div>
                <label className="block text-neutral-500 mb-1">Tare Weight (KG)</label>
                <input
                  type="number"
                  value={newTareWeight}
                  onChange={e => setNewTareWeight(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-[11px]"
                />
              </div>

              <div>
                <label className="block text-neutral-500 mb-1">Max Payload (KG)</label>
                <input
                  type="number"
                  value={newMaxPayload}
                  onChange={e => setNewMaxPayload(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-[11px]"
                />
              </div>
            </div>

            {/* Pricing if For-Sale or For-Booking */}
            {newPurpose === 'For-Sale' && (
              <div className="p-3.5 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50/60 dark:bg-emerald-950/20 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-emerald-800 dark:text-emerald-300 font-bold mb-1">
                    Asking Sale Price ($ USD)
                  </label>
                  <input
                    type="number"
                    value={newSalePrice}
                    onChange={e => setNewSalePrice(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg border border-emerald-300 dark:border-emerald-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-emerald-800 dark:text-emerald-300 mb-1">
                    Condition Grading
                  </label>
                  <div className="text-[11px] text-neutral-600 dark:text-neutral-400 pt-2 font-mono">
                    IICL-5 Certified · Cargo Worthy (CW) for international ocean voyages
                  </div>
                </div>
              </div>
            )}

            {newPurpose === 'For-Booking' && (
              <div className="p-3.5 rounded-xl border border-indigo-300 dark:border-indigo-800 bg-indigo-50/60 dark:bg-indigo-950/20 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-indigo-800 dark:text-indigo-300 font-bold mb-1">
                    Daily Sub-Lease Rental Rate ($/day)
                  </label>
                  <input
                    type="number"
                    value={newLeaseRate}
                    onChange={e => setNewLeaseRate(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg border border-indigo-300 dark:border-indigo-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-indigo-800 dark:text-indigo-300 mb-1">
                    Rental Terms
                  </label>
                  <div className="text-[11px] text-neutral-600 dark:text-neutral-400 pt-2 font-mono">
                    Available for one-way or round-trip charter to shippers &amp; freight forwarders
                  </div>
                </div>
              </div>
            )}

            {/* 3 Photos URL Inputs / Uploads */}
            <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-2">
              <span className="font-bold text-neutral-900 dark:text-white text-xs block">
                3 Condition Survey Photos (Front / Door, Side Profile, Interior Floor)
              </span>
              <p className="text-[11px] text-neutral-400 font-sans">
                Leave blank to automatically apply official ISO maritime survey photos, or provide direct image URLs.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div>
                  <label className="block text-neutral-500 text-[10px] mb-1">Photo 1: Front / Door &amp; CSC Plate</label>
                  <input
                    type="text"
                    placeholder="Auto-populated or paste URL"
                    value={newPhoto1}
                    onChange={e => setNewPhoto1(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-[11px]"
                  />
                </div>

                <div>
                  <label className="block text-neutral-500 text-[10px] mb-1">Photo 2: Exterior Side Profile</label>
                  <input
                    type="text"
                    placeholder="Auto-populated or paste URL"
                    value={newPhoto2}
                    onChange={e => setNewPhoto2(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-[11px]"
                  />
                </div>

                <div>
                  <label className="block text-neutral-500 text-[10px] mb-1">Photo 3: Interior Floor &amp; Ceiling</label>
                  <input
                    type="text"
                    placeholder="Auto-populated or paste URL"
                    value={newPhoto3}
                    onChange={e => setNewPhoto3(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-[11px]"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-200 dark:border-neutral-800">
              <button
                type="button"
                onClick={() => setIsAddFormOpen(false)}
                className="px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 font-bold hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors cursor-pointer"
              >
                Register Container Asset
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Commercial Purpose Filter Tabs */}
      <div className="flex border-b border-neutral-200 dark:border-neutral-800 gap-1 overflow-x-auto scrollbar-none font-mono text-xs">
        {[
          { id: 'All', label: `All Fleet (${totalCount})` },
          { id: 'Self-Use', label: `🏢 Company Self-Use (${selfUseCount})` },
          { id: 'For-Booking', label: `📅 Available for Booking (${forBookingCount})` },
          { id: 'For-Sale', label: `🏷️ Listed for Sale (${forSaleCount})` },
          { id: 'Leased-In', label: `🔄 Leased-In / 3rd Party (${leasedInCount})` },
          { id: 'Sold', label: `✅ Sold Off (${soldCount})` }
        ].map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setCommercialFilter(tab.id as any)}
            className={`px-4 py-3 font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              commercialFilter === tab.id
                ? 'border-neutral-900 text-neutral-900 dark:border-white dark:text-white font-bold bg-neutral-100/60 dark:bg-neutral-900/60'
                : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search Toolbar with Location Status Filter */}
      <div className="p-3.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs flex flex-col md:flex-row gap-3 font-mono text-xs">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search container number, seal, CSC plate, depot location, or owner..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-neutral-400 text-[11px] whitespace-nowrap">Location Status:</span>
          <select
            value={locationFilter}
            onChange={e => setLocationFilter(e.target.value as any)}
            className="px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
          >
            <option value="All">All Locations</option>
            <option value="In Warehouse">In Warehouse / Depot</option>
            <option value="At Port">At Port Terminal</option>
            <option value="At Sea">At Sea (On Voyage)</option>
            <option value="Booked">Booked / Allocated</option>
          </select>
        </div>
      </div>

      {/* Containers Fleet Table */}
      <div className="rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs overflow-hidden font-mono text-xs">
        <div className="px-4 py-3 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <span className="font-bold text-neutral-900 dark:text-white">
            Container Fleet Inventory ({filteredContainers.length} Units)
          </span>
          <span className="text-[11px] text-neutral-400">
            Click thumbnails to open 3-point visual inspection
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="bg-neutral-50 dark:bg-neutral-800/60 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 text-[11px]">
                <th className="py-3 px-4">Container # / ISO Type</th>
                <th className="py-3 px-4">3 Survey Photos</th>
                <th className="py-3 px-4">Commercial Purpose</th>
                <th className="py-3 px-4">Current Location</th>
                <th className="py-3 px-4">Tare / Payload / CSC</th>
                <th className="py-3 px-4">Commercial Value</th>
                <th className="py-3 px-4 text-center">Location Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {filteredContainers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-neutral-400 font-sans">
                    <Box className="w-8 h-8 mx-auto text-neutral-300 dark:text-neutral-600 mb-2" />
                    <p className="font-semibold text-neutral-700 dark:text-neutral-300">No containers matching this filter</p>
                    <p className="text-xs text-neutral-400 mt-1">Try switching tabs or resetting the search query.</p>
                  </td>
                </tr>
              ) : (
                filteredContainers.map(container => {
                  const photos = container.images || getPhotosForContainer(container.type, container.id);
                  const purpose = container.commercialPurpose || 'Self-Use';

                  return (
                    <tr key={container.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors">
                      {/* Container # & Type */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-neutral-900 dark:text-white text-sm">
                          {container.containerNo}
                        </div>
                        <div className="text-[10px] text-neutral-400">
                          {container.type} · <span className="font-semibold text-neutral-700 dark:text-neutral-300">{container.ownership || 'COC'}</span>
                        </div>
                        <div className="text-[10px] text-neutral-500 truncate max-w-[150px]">
                          {container.sourceProvider || 'Company Owned'}
                        </div>
                      </td>

                      {/* 3 Photos Strip */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          {photos.map((imgUrl, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => {
                                setActivePhotoModalContainer(container);
                                setActivePhotoIndex(idx);
                              }}
                              className="relative w-11 h-11 rounded-lg border border-neutral-300 dark:border-neutral-700 overflow-hidden group cursor-pointer hover:border-neutral-950 dark:hover:border-white transition-all shadow-2xs"
                              title={`View Photo ${idx + 1}: ${idx === 0 ? 'Door/CSC' : idx === 1 ? 'Side' : 'Interior'}`}
                            >
                              <img
                                src={imgUrl}
                                alt={`Container ${container.containerNo} view ${idx + 1}`}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                              />
                              <span className="absolute bottom-0 right-0 px-1 py-0.2 bg-black/70 text-white text-[8px] font-mono rounded-tl">
                                {idx + 1}
                              </span>
                            </button>
                          ))}

                          <button
                            type="button"
                            onClick={() => handleOpenPhotoEdit(container)}
                            className="p-1.5 rounded-lg border border-dashed border-neutral-300 dark:border-neutral-700 hover:border-neutral-900 dark:hover:border-white text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
                            title="Upload or change photos"
                          >
                            <Camera className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="text-[9px] text-neutral-400 mt-1">
                          1: Door · 2: Side · 3: Inside
                        </div>
                      </td>

                      {/* Commercial Purpose Badge */}
                      <td className="py-3.5 px-4">
                        {container.isSold ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-200 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-300">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                            Sold to {container.soldToParty}
                          </span>
                        ) : purpose === 'For-Sale' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                            <Tag className="w-3 h-3" />
                            Listed for Sale
                          </span>
                        ) : purpose === 'For-Booking' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                            <Calendar className="w-3 h-3" />
                            Available for Lease
                          </span>
                        ) : purpose === 'Leased-In' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                            <RotateCcw className="w-3 h-3" />
                            Leased-In (3rd Party)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                            <Ship className="w-3 h-3" />
                            Self-Use (Active Fleet)
                          </span>
                        )}
                        <div className="text-[10px] text-neutral-400 mt-0.5">
                          Grade: {container.conditionGrade || 'IICL-5'}
                        </div>
                      </td>

                      {/* Current Location */}
                      <td className="py-3.5 px-4 max-w-[180px]">
                        <div className="font-semibold text-neutral-900 dark:text-white truncate">
                          {container.currentLocation || container.vesselName}
                        </div>
                        {container.yardSlot && (
                          <div className="text-[10px] text-neutral-400 font-mono">
                            Slot: {container.yardSlot}
                          </div>
                        )}
                      </td>

                      {/* Technical Specs */}
                      <td className="py-3.5 px-4">
                        <div className="text-neutral-900 dark:text-white">
                          Tare: {container.tareWeightKg?.toLocaleString() || 3820} KG
                        </div>
                        <div className="text-[10px] text-neutral-400">
                          Payload: {container.maxPayloadKg?.toLocaleString() || 28600} KG
                        </div>
                        {container.cscPlateNumber && (
                          <div className="text-[9px] text-neutral-400 truncate max-w-[120px]">
                            CSC: {container.cscPlateNumber}
                          </div>
                        )}
                      </td>

                      {/* Commercial Value */}
                      <td className="py-3.5 px-4 font-bold">
                        {container.isSold ? (
                          <div className="text-neutral-500">
                            Sold: ${container.soldPriceUsd?.toLocaleString()} USD
                          </div>
                        ) : purpose === 'For-Sale' ? (
                          <div className="text-emerald-600 dark:text-emerald-400 text-sm">
                            ${container.salePriceUsd?.toLocaleString() || 2250} USD
                          </div>
                        ) : purpose === 'For-Booking' ? (
                          <div className="text-indigo-600 dark:text-indigo-400 text-sm">
                            ${container.leaseDailyRateUsd || 24}/day
                          </div>
                        ) : (
                          <div className="text-neutral-500 text-[11px]">
                            Active Booked Value
                          </div>
                        )}
                      </td>

                      {/* Location Status Badge */}
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            container.locationStatus === 'In Warehouse'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                              : container.locationStatus === 'At Sea'
                              ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                              : container.locationStatus === 'At Port'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                              : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          }`}
                        >
                          {container.locationStatus}
                        </span>
                      </td>

                      {/* Commercial Actions */}
                      <td className="py-3.5 px-4 text-right space-x-1 whitespace-nowrap">
                        {!container.isSold && (
                          <>
                            {purpose !== 'For-Sale' && (
                              <button
                                type="button"
                                onClick={() => {
                                  setSaleModalContainer(container);
                                  setSalePriceInput(container.salePriceUsd || 2200);
                                  setSaleGradeInput(container.conditionGrade || 'Cargo Worthy (CW)');
                                }}
                                className="px-2 py-1 rounded border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-[11px] font-semibold cursor-pointer"
                                title="List for commercial sale"
                              >
                                Put For Sale
                              </button>
                            )}

                            {purpose === 'For-Sale' && (
                              <button
                                type="button"
                                onClick={() => {
                                  setSellRecordModalContainer(container);
                                  setTransactedPriceInput(container.salePriceUsd || 2200);
                                }}
                                className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold cursor-pointer"
                                title="Record sale to buyer"
                              >
                                Sell Container
                              </button>
                            )}

                            {purpose !== 'For-Booking' && (
                              <button
                                type="button"
                                onClick={() => {
                                  setLeaseModalContainer(container);
                                  setLeaseRateInput(container.leaseDailyRateUsd || 22);
                                }}
                                className="px-2 py-1 rounded border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-[11px] font-semibold cursor-pointer"
                                title="Make available for sub-lease booking"
                              >
                                Lease Out
                              </button>
                            )}

                            {purpose !== 'Self-Use' && (
                              <button
                                type="button"
                                onClick={() => updateContainerCommercialStatus(container.id, 'Self-Use')}
                                className="px-2 py-1 rounded bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 text-[11px] font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-200 cursor-pointer"
                                title="Reclaim for company self use"
                              >
                                Self-Use
                              </button>
                            )}
                          </>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            setActivePhotoModalContainer(container);
                            setActivePhotoIndex(0);
                          }}
                          className="px-2 py-1 rounded border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-[11px] font-semibold cursor-pointer"
                        >
                          Photos
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

      {/* ========================================================================= */}
      {/* 3-PHOTO HIGH-RES INSPECTION VIEWER MODAL */}
      {/* ========================================================================= */}
      {activePhotoModalContainer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl max-w-3xl w-full p-6 space-y-4 shadow-2xl my-auto font-mono text-xs">
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
              <div>
                <span className="text-[10px] text-neutral-400 font-bold uppercase">
                  Container Physical Survey · 3 Viewpoints
                </span>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white mt-0.5">
                  {activePhotoModalContainer.containerNo} ({activePhotoModalContainer.type})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActivePhotoModalContainer(null)}
                className="text-neutral-400 hover:text-neutral-700 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Photo Preview Tabs */}
            <div className="flex border-b border-neutral-200 dark:border-neutral-800 gap-2">
              {['1. Door & CSC Plate', '2. Side Profile', '3. Interior Chamber'].map((label, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActivePhotoIndex(idx)}
                  className={`px-3 py-1.5 font-bold border-b-2 transition-all cursor-pointer ${
                    activePhotoIndex === idx
                      ? 'border-neutral-950 text-neutral-950 dark:border-white dark:text-white'
                      : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-300'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Active Photo High Res Display */}
            {(() => {
              const currentPhotos = activePhotoModalContainer.images || getPhotosForContainer(activePhotoModalContainer.type, activePhotoModalContainer.id);
              const captions = [
                'Front Double Doors, Locking Rods & CSC Safety Approval Plate',
                'Exterior Full-Length Corrugated Sidewalls & ISO Lifting Castings',
                'Interior Clean Dry Chamber, Timber Planking & Lashing Rings'
              ];
              return (
                <div className="space-y-3">
                  <div className="w-full h-80 sm:h-96 rounded-xl overflow-hidden bg-neutral-950 border border-neutral-300 dark:border-neutral-800 flex items-center justify-center">
                    <img
                      src={currentPhotos[activePhotoIndex]}
                      alt={`Container view ${activePhotoIndex + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 text-[11px]">
                    <div>
                      <span className="font-bold text-neutral-900 dark:text-white block">
                        {captions[activePhotoIndex]}
                      </span>
                      <span className="text-neutral-500 text-[10px]">
                        Location: {activePhotoModalContainer.currentLocation || 'Depot Bay'} · CSC Plate: {activePhotoModalContainer.cscPlateNumber || 'Certified'}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        handleOpenPhotoEdit(activePhotoModalContainer);
                        setActivePhotoModalContainer(null);
                      }}
                      className="px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white font-bold hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Edit / Upload Photos</span>
                    </button>
                  </div>
                </div>
              );
            })()}

            <div className="flex justify-end pt-2 border-t border-neutral-200 dark:border-neutral-800">
              <button
                type="button"
                onClick={() => setActivePhotoModalContainer(null)}
                className="px-4 py-2 rounded-lg bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 font-bold cursor-pointer"
              >
                Close Viewer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PHOTO EDIT / FILE UPLOAD MODAL */}
      {/* ========================================================================= */}
      {activePhotoEditContainer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl my-auto font-mono text-xs">
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
              <div>
                <span className="text-[10px] text-neutral-400 font-bold uppercase">
                  Update Container Photos
                </span>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white mt-0.5">
                  {activePhotoEditContainer.containerNo}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActivePhotoEditContainer(null)}
                className="text-neutral-400 hover:text-neutral-700 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditedPhotos} className="space-y-4">
              {/* Slot 1 */}
              <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40 space-y-2">
                <span className="font-bold text-neutral-900 dark:text-white text-[11px] block">
                  Photo 1: Front Double Doors &amp; CSC Plate
                </span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter image URL"
                    value={editImage1}
                    onChange={e => setEditImage1(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-[11px]"
                  />
                  <label className="px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer flex items-center gap-1 text-[11px]">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload</span>
                    <input type="file" accept="image/*" onChange={e => handleFileUpload(e, 1)} className="hidden" />
                  </label>
                </div>
              </div>

              {/* Slot 2 */}
              <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40 space-y-2">
                <span className="font-bold text-neutral-900 dark:text-white text-[11px] block">
                  Photo 2: Exterior Full-Length Side View
                </span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter image URL"
                    value={editImage2}
                    onChange={e => setEditImage2(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-[11px]"
                  />
                  <label className="px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer flex items-center gap-1 text-[11px]">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload</span>
                    <input type="file" accept="image/*" onChange={e => handleFileUpload(e, 2)} className="hidden" />
                  </label>
                </div>
              </div>

              {/* Slot 3 */}
              <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40 space-y-2">
                <span className="font-bold text-neutral-900 dark:text-white text-[11px] block">
                  Photo 3: Interior Floor &amp; Ceiling Deck
                </span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter image URL"
                    value={editImage3}
                    onChange={e => setEditImage3(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-[11px]"
                  />
                  <label className="px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer flex items-center gap-1 text-[11px]">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload</span>
                    <input type="file" accept="image/*" onChange={e => handleFileUpload(e, 3)} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setActivePhotoEditContainer(null)}
                  className="px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 font-bold cursor-pointer"
                >
                  Save Photo Updates
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: LIST FOR SALE */}
      {/* ========================================================================= */}
      {saleModalContainer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl my-auto font-mono text-xs">
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
              <div>
                <span className="text-[10px] text-neutral-400 font-bold uppercase">Container Asset Trading</span>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white mt-0.5">
                  List Container #{saleModalContainer.containerNo} for Sale
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSaleModalContainer(null)}
                className="text-neutral-400 hover:text-neutral-700 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmListForSale} className="space-y-4">
              <div>
                <label className="block text-neutral-500 mb-1">Asking Sale Price ($ USD) *</label>
                <input
                  type="number"
                  required
                  min={500}
                  value={salePriceInput}
                  onChange={e => setSalePriceInput(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white font-bold text-sm"
                />
              </div>

              <div>
                <label className="block text-neutral-500 mb-1">Condition Grading *</label>
                <select
                  value={saleGradeInput}
                  onChange={e => setSaleGradeInput(e.target.value as ContainerConditionGrade)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white font-bold"
                >
                  <option value="IICL-5">IICL-5 (Top International Lease Standard)</option>
                  <option value="Cargo Worthy (CW)">Cargo Worthy (CW - Ocean Seaworthy Valid)</option>
                  <option value="Wind & Water Tight (WWT)">Wind &amp; Water Tight (WWT - Storage Grade)</option>
                  <option value="As-Is">As-Is / Needs Refurbishment</option>
                </select>
              </div>

              <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 text-[11px] text-neutral-500">
                Listing this container for sale will display it in the NVOCC secondary container sales directory.
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setSaleModalContainer(null)}
                  className="px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer"
                >
                  Confirm Sale Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: RECORD FINAL CONTAINER SALE TO BUYER */}
      {/* ========================================================================= */}
      {sellRecordModalContainer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl my-auto font-mono text-xs">
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
              <div>
                <span className="text-[10px] text-neutral-400 font-bold uppercase">Execute Container Sale</span>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white mt-0.5">
                  Sell #{sellRecordModalContainer.containerNo}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSellRecordModalContainer(null)}
                className="text-neutral-400 hover:text-neutral-700 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmSell} className="space-y-4">
              <div>
                <label className="block text-neutral-500 mb-1">Purchaser / Buyer Entity *</label>
                <input
                  type="text"
                  required
                  value={buyerNameInput}
                  onChange={e => setBuyerNameInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white font-bold font-sans"
                />
              </div>

              <div>
                <label className="block text-neutral-500 mb-1">Final Transacted Price ($ USD) *</label>
                <input
                  type="number"
                  required
                  value={transactedPriceInput}
                  onChange={e => setTransactedPriceInput(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white font-bold text-sm"
                />
              </div>

              <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-[11px] text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                This transaction will mark container #{sellRecordModalContainer.containerNo} as sold, record commercial revenue into accounting audit logs, and retire it from the active operating fleet.
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setSellRecordModalContainer(null)}
                  className="px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer"
                >
                  Execute Sale &amp; Transfer Title
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: SET FOR SUB-LEASE / BOOKING */}
      {/* ========================================================================= */}
      {leaseModalContainer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl my-auto font-mono text-xs">
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
              <div>
                <span className="text-[10px] text-neutral-400 font-bold uppercase">Charter &amp; Sub-Leasing</span>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white mt-0.5">
                  Make #{leaseModalContainer.containerNo} Available for Lease
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setLeaseModalContainer(null)}
                className="text-neutral-400 hover:text-neutral-700 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmLease} className="space-y-4">
              <div>
                <label className="block text-neutral-500 mb-1">Daily Charter / Lease Rate ($/day) *</label>
                <input
                  type="number"
                  required
                  min={5}
                  value={leaseRateInput}
                  onChange={e => setLeaseRateInput(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white font-bold text-sm"
                />
              </div>

              <div className="p-3 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 text-[11px] text-indigo-800 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800">
                This container will appear as available equipment in the FCL &amp; LCL booking allocation matrix for rental to forwarders or clients.
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setLeaseModalContainer(null)}
                  className="px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold cursor-pointer"
                >
                  Set as Available for Lease
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
