import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Settings,
  Building2,
  ShieldCheck,
  Check,
  Save,
  Phone,
  Mail,
  MapPin,
  Globe,
  Landmark,
  PenTool,
  Palette,
  Image,
  FileCheck2,
  RefreshCw
} from 'lucide-react';

export const CompanySettingsPage: React.FC = () => {
  const { currentCompany, updateCompanyProfile } = useApp();

  type SettingsTab = 'general' | 'contact' | 'branding' | 'banking' | 'signatory';
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');

  // Form States initialized from currentCompany
  const [companyName, setCompanyName] = useState(currentCompany.name);
  const [displayName, setDisplayName] = useState(currentCompany.displayName || currentCompany.name);
  const [tagline, setTagline] = useState(currentCompany.tagline || 'Leading Ocean Liner Agency, NVOCC & Terminal Drayage Operator');
  const [regNo, setRegNo] = useState(currentCompany.registrationNo);
  const [ntnNumber, setNtnNumber] = useState(currentCompany.ntnNumber || currentCompany.nationalId || 'NTN #4129840-3 / WeBOC Agency Code #IMS-77');
  const [salesTaxNumber, setSalesTaxNumber] = useState(currentCompany.salesTaxNumber || 'STRN #24-00-4129-840-19');
  const [scacCode, setScacCode] = useState(currentCompany.scacCode || 'PCFL');
  const [blPrefix, setBlPrefix] = useState(currentCompany.blPrefix || 'HBL-2026-');
  const [ediGateway, setEdiGateway] = useState(currentCompany.ediGateway || 'INTTRA EDIFACT 304 Direct');

  // Contact & Location
  const [adminEmail, setAdminEmail] = useState(currentCompany.adminEmail);
  const [billingEmail, setBillingEmail] = useState(currentCompany.billingEmail || currentCompany.email || 'accounts@indusmagna.com');
  const [phone, setPhone] = useState(currentCompany.phone || '+92-21-3568-9900');
  const [emergencyPhone, setEmergencyPhone] = useState(currentCompany.emergencyPhone || '+92-300-8219401');
  const [address, setAddress] = useState(currentCompany.address || 'Suite 802, Trade Tower, Abdullah Haroon Road');
  const [hqCity, setHqCity] = useState(currentCompany.hqCity);
  const [stateProvince, setStateProvince] = useState(currentCompany.stateProvince || 'Sindh');
  const [postalCode, setPostalCode] = useState(currentCompany.postalCode || '74400');
  const [country, setCountry] = useState(currentCompany.country);
  const [website, setWebsite] = useState(currentCompany.website || 'https://www.indusmagna.com');

  // Branding
  const [logoUrl, setLogoUrl] = useState(currentCompany.logoUrl || '');
  const [primaryColor, setPrimaryColor] = useState(currentCompany.primaryColor || '#00665e');
  const [secondaryColor, setSecondaryColor] = useState(currentCompany.secondaryColor || '#0f172a');

  // Banking
  const [bankName, setBankName] = useState(currentCompany.bankName || 'Habib Bank Limited (HBL) - Corporate Branch');
  const [bankAccountTitle, setBankAccountTitle] = useState(currentCompany.bankAccountTitle || currentCompany.name);
  const [bankIban, setBankIban] = useState(currentCompany.bankIban || 'PK36HABB000129840192801');
  const [bankSwift, setBankSwift] = useState(currentCompany.bankSwift || 'HABBPKKA');

  // Signatory
  const [signatoryName, setSignatoryName] = useState(currentCompany.signatoryName || 'Capt. Rehan Siddiqui');
  const [signatoryTitle, setSignatoryTitle] = useState(currentCompany.signatoryTitle || 'Managing Director & Line Representative');

  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    updateCompanyProfile({
      name: companyName,
      displayName,
      tagline,
      registrationNo: regNo,
      ntnNumber,
      nationalId: ntnNumber,
      salesTaxNumber,
      scacCode,
      blPrefix,
      ediGateway,
      adminEmail,
      email: billingEmail,
      billingEmail,
      phone,
      emergencyPhone,
      address,
      hqCity,
      stateProvince,
      postalCode,
      country,
      website,
      logoUrl,
      primaryColor,
      secondaryColor,
      bankName,
      bankAccountTitle,
      bankIban,
      bankSwift,
      signatoryName,
      signatoryTitle
    });

    setSaved(true);
    setTimeout(() => setSaved(false), 3500);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">
              NVOCC CARRIER PROFILE
            </span>
            <span className="text-xs text-neutral-400 font-mono">
              FMC #{currentCompany.registrationNo}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white tracking-tight mt-1">
            Company Profile, Branding & Regulatory Details
          </h1>
          <p className="text-xs text-neutral-500 font-mono mt-0.5">
            Update your official NVOCC entity credentials, registration numbers, communication channels, and banking details
          </p>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          className="flex items-center gap-2 px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-950 font-mono text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>Save All Changes</span>
        </button>
      </div>

      {saved && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-mono flex items-center gap-2 shadow-xs transition-all">
          <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>Company profile updated successfully! Changes have been propagated across all generated B/Ls, Delivery Orders, and Invoices.</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-neutral-200 dark:border-neutral-800 overflow-x-auto space-x-2 text-xs font-mono">
        {[
          { id: 'general', label: 'Entity & License', icon: Building2 },
          { id: 'contact', label: 'Contact & Addresses', icon: Phone },
          { id: 'branding', label: 'Branding & Logo', icon: Palette },
          { id: 'banking', label: 'Banking & Remittance', icon: Landmark },
          { id: 'signatory', label: 'Authorized Signatory', icon: PenTool }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as SettingsTab)}
              className={`flex items-center gap-2 py-3 px-4 font-semibold border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                isActive
                  ? 'border-neutral-900 text-neutral-900 dark:border-white dark:text-white'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} className="p-6 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-6 text-xs font-mono">
        {/* TAB 1: GENERAL & LICENSE */}
        {activeTab === 'general' && (
          <div className="space-y-5">
            <div>
              <h3 className="font-bold text-sm text-neutral-900 dark:text-white font-sans mb-1">
                Legal Entity & Regulatory Identifiers
              </h3>
              <p className="text-neutral-500 text-[11px] mb-4">
                Corporate identification numbers used on Ocean Bills of Lading, Manifests (IGM/EGM), and Customs filings.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 mb-1 font-semibold">
                  Legal Entity Registered Name *
                </label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 mb-1 font-semibold">
                  Trade / Commercial Display Name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-hidden"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-neutral-700 dark:text-neutral-300 mb-1">
                  Tagline / Operating Classification
                </label>
                <input
                  type="text"
                  value={tagline}
                  onChange={e => setTagline(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 mb-1 font-semibold">
                  FMC License / Federal Maritime Registration # *
                </label>
                <input
                  type="text"
                  required
                  value={regNo}
                  onChange={e => setRegNo(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 mb-1 font-semibold">
                  National Tax Number (NTN / WeBOC Agency Code) *
                </label>
                <input
                  type="text"
                  required
                  value={ntnNumber}
                  onChange={e => setNtnNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 mb-1">
                  Sales Tax Registration Number (STRN)
                </label>
                <input
                  type="text"
                  value={salesTaxNumber}
                  onChange={e => setSalesTaxNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 mb-1 font-semibold">
                  Standard Carrier Alpha Code (SCAC)
                </label>
                <input
                  type="text"
                  value={scacCode}
                  onChange={e => setScacCode(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 mb-1">
                  Automated B/L Number Prefix
                </label>
                <input
                  type="text"
                  value={blPrefix}
                  onChange={e => setBlPrefix(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 mb-1">
                  EDIFACT Transmission Gateway
                </label>
                <input
                  type="text"
                  value={ediGateway}
                  onChange={e => setEdiGateway(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-hidden"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CONTACT & ADDRESSES */}
        {activeTab === 'contact' && (
          <div className="space-y-5">
            <div>
              <h3 className="font-bold text-sm text-neutral-900 dark:text-white font-sans mb-1">
                Official Communications & Office Addresses
              </h3>
              <p className="text-neutral-500 text-[11px] mb-4">
                Printed on formal shipping documentation, arrival notices, and customer invoices.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 mb-1 font-semibold">
                  Official Operations Email *
                </label>
                <input
                  type="email"
                  required
                  value={adminEmail}
                  onChange={e => setAdminEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 mb-1 font-semibold">
                  Billing & Accounts Email
                </label>
                <input
                  type="email"
                  value={billingEmail}
                  onChange={e => setBillingEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 mb-1 font-semibold">
                  Head Office Telephone / Helpline *
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 mb-1">
                  24/7 Operations Duty Officer / WhatsApp
                </label>
                <input
                  type="text"
                  value={emergencyPhone}
                  onChange={e => setEmergencyPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-hidden"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-neutral-700 dark:text-neutral-300 mb-1 font-semibold">
                  Headquarters Street Address *
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 mb-1 font-semibold">
                  Principal City / Port Hub *
                </label>
                <input
                  type="text"
                  required
                  value={hqCity}
                  onChange={e => setHqCity(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 mb-1">
                  State / Province & Postal Code
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={stateProvince}
                    onChange={e => setStateProvince(e.target.value)}
                    placeholder="Province/State"
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-hidden"
                  />
                  <input
                    type="text"
                    value={postalCode}
                    onChange={e => setPostalCode(e.target.value)}
                    placeholder="Postal Code"
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 mb-1 font-semibold">
                  Country *
                </label>
                <input
                  type="text"
                  required
                  value={country}
                  onChange={e => setCountry(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 mb-1">
                  Corporate Website URL
                </label>
                <input
                  type="url"
                  value={website}
                  onChange={e => setWebsite(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-hidden"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: BRANDING & LOGO */}
        {activeTab === 'branding' && (
          <div className="space-y-5">
            <div>
              <h3 className="font-bold text-sm text-neutral-900 dark:text-white font-sans mb-1">
                Visual Branding & Document Appearance
              </h3>
              <p className="text-neutral-500 text-[11px] mb-4">
                These colors and logos are used dynamically on Ocean B/L printouts, invoices, and customer portals.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-neutral-700 dark:text-neutral-300 mb-1 font-semibold">
                  Company Logo URL (PNG/SVG with transparent background recommended)
                </label>
                <input
                  type="text"
                  value={logoUrl}
                  onChange={e => setLogoUrl(e.target.value)}
                  placeholder="https://example.com/logo.png"
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 mb-1 font-semibold">
                  Primary Brand Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={e => setPrimaryColor(e.target.value)}
                    className="w-10 h-10 rounded border border-neutral-300 dark:border-neutral-700 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={primaryColor}
                    onChange={e => setPrimaryColor(e.target.value)}
                    className="w-32 px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 mb-1 font-semibold">
                  Secondary Accent Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={secondaryColor}
                    onChange={e => setSecondaryColor(e.target.value)}
                    className="w-10 h-10 rounded border border-neutral-300 dark:border-neutral-700 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={secondaryColor}
                    onChange={e => setSecondaryColor(e.target.value)}
                    className="w-32 px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Live Document Header Preview */}
            <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/40 space-y-2 mt-4">
              <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">
                Live Document Header Preview:
              </span>
              <div className="p-4 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex justify-between items-center">
                <div>
                  <div className="text-base font-bold text-neutral-900 dark:text-white" style={{ color: primaryColor }}>
                    {companyName}
                  </div>
                  <div className="text-[10px] text-neutral-500 font-sans mt-0.5">
                    {tagline}
                  </div>
                  <div className="text-[10px] text-neutral-400 font-mono mt-0.5">
                    {address}, {hqCity} | FMC Reg: {regNo}
                  </div>
                </div>
                <div className="text-right">
                  <span className="px-2 py-1 rounded text-[10px] font-bold text-white" style={{ backgroundColor: primaryColor }}>
                    OFFICIAL NVOCC CARRIER
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: BANKING & REMITTANCE */}
        {activeTab === 'banking' && (
          <div className="space-y-5">
            <div>
              <h3 className="font-bold text-sm text-neutral-900 dark:text-white font-sans mb-1">
                Official Bank Wire & Remittance Details
              </h3>
              <p className="text-neutral-500 text-[11px] mb-4">
                Printed on commercial freight invoices, arrival notices, and customer ledger statements for receiving wire payments.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 mb-1 font-semibold">
                  Bank Name & Branch *
                </label>
                <input
                  type="text"
                  required
                  value={bankName}
                  onChange={e => setBankName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 mb-1 font-semibold">
                  Account Title (Beneficiary Name) *
                </label>
                <input
                  type="text"
                  required
                  value={bankAccountTitle}
                  onChange={e => setBankAccountTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 mb-1 font-semibold">
                  Account Number / IBAN *
                </label>
                <input
                  type="text"
                  required
                  value={bankIban}
                  onChange={e => setBankIban(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 mb-1">
                  SWIFT / BIC Code (For Overseas Wire)
                </label>
                <input
                  type="text"
                  value={bankSwift}
                  onChange={e => setBankSwift(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-hidden"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: AUTHORIZED SIGNATORY */}
        {activeTab === 'signatory' && (
          <div className="space-y-5">
            <div>
              <h3 className="font-bold text-sm text-neutral-900 dark:text-white font-sans mb-1">
                Authorized Signatory & Endorsements
              </h3>
              <p className="text-neutral-500 text-[11px] mb-4">
                Appears on the signature block of generated Bills of Lading, Delivery Orders (D.O.), and Terminal Gate Passes.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 mb-1 font-semibold">
                  Authorized Signatory Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={signatoryName}
                  onChange={e => setSignatoryName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 mb-1 font-semibold">
                  Official Designation / Title *
                </label>
                <input
                  type="text"
                  required
                  value={signatoryTitle}
                  onChange={e => setSignatoryTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-hidden"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/40 space-y-2 mt-4">
              <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">
                Signature Endorsement Stamp Preview:
              </span>
              <div className="w-64 p-4 border border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg text-center bg-white dark:bg-neutral-900">
                <div className="text-[10px] text-neutral-400 uppercase">For and on behalf of the Carrier</div>
                <div className="font-bold text-xs text-neutral-900 dark:text-white mt-1">{companyName}</div>
                <div className="my-3 text-neutral-400 italic text-[11px]">[Digital Signature Affixed]</div>
                <div className="font-bold text-[11px] text-neutral-900 dark:text-white border-t border-neutral-200 dark:border-neutral-800 pt-1.5">
                  {signatoryName}
                </div>
                <div className="text-[10px] text-neutral-500">{signatoryTitle}</div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Save Bar */}
        <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex justify-between items-center">
          <span className="text-[11px] text-neutral-400">
            Last updated: Today &bull; Auto-saves to your active session
          </span>
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-950 font-bold rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};
