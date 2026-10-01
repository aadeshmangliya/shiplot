import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Settings,
  Building2,
  ShieldCheck,
  Check,
  Save,
  Server,
  Layers
} from 'lucide-react';

export const CompanySettingsPage: React.FC = () => {
  const { currentCompany } = useApp();

  const [companyName, setCompanyName] = useState(currentCompany.name);
  const [regNo, setRegNo] = useState(currentCompany.registrationNo);
  const [hqCity, setHqCity] = useState(currentCompany.hqCity);
  const [country, setCountry] = useState(currentCompany.country);
  const [adminEmail, setAdminEmail] = useState(currentCompany.adminEmail);
  const [scacCode, setScacCode] = useState('PCFL');
  const [ediGateway, setEdiGateway] = useState('INTTRA EDIFACT 304 Direct');
  const [blPrefix, setBlPrefix] = useState('HBL-2026-');
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
            NVOCC CARRIER PROFILE
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white tracking-tight mt-1">
          Carrier Profile & Regulatory FMC Settings
        </h1>
        <p className="text-xs text-neutral-500 font-mono mt-0.5">
          Manage corporate registration, SCAC carrier identification, and electronic EDIFACT transmissions
        </p>
      </div>

      {saved && (
        <div className="p-3.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-mono flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Carrier configuration saved successfully!</span>
        </div>
      )}

      {/* Settings Form */}
      <form onSubmit={handleSubmit} className="p-6 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-6 text-xs font-mono">
        <div>
          <h3 className="font-bold text-sm text-neutral-900 dark:text-white font-sans mb-3">
            Company & License Credentials
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-neutral-600 dark:text-neutral-400 mb-1">
                Legal Entity Name
              </label>
              <input
                type="text"
                required
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-neutral-600 dark:text-neutral-400 mb-1">
                FMC License / Registration No
              </label>
              <input
                type="text"
                required
                value={regNo}
                onChange={e => setRegNo(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-neutral-600 dark:text-neutral-400 mb-1">
                Headquarters City
              </label>
              <input
                type="text"
                required
                value={hqCity}
                onChange={e => setHqCity(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-neutral-600 dark:text-neutral-400 mb-1">
                Country
              </label>
              <input
                type="text"
                required
                value={country}
                onChange={e => setCountry(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800">
          <h3 className="font-bold text-sm text-neutral-900 dark:text-white font-sans mb-3">
            EDI Transport & Carrier Identification
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-neutral-600 dark:text-neutral-400 mb-1">
                Standard Carrier Alpha Code (SCAC)
              </label>
              <input
                type="text"
                required
                value={scacCode}
                onChange={e => setScacCode(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-neutral-600 dark:text-neutral-400 mb-1">
                EDI Gateway Provider
              </label>
              <input
                type="text"
                required
                value={ediGateway}
                onChange={e => setEdiGateway(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-neutral-600 dark:text-neutral-400 mb-1">
                House B/L Automated Prefix
              </label>
              <input
                type="text"
                required
                value={blPrefix}
                onChange={e => setBlPrefix(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-neutral-600 dark:text-neutral-400 mb-1">
                Carrier Ops Dispatch Email
              </label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={e => setAdminEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex justify-end">
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
