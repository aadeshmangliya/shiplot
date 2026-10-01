import React, { useState } from 'react';
import { WorkspaceCompany } from '../../types/shipping';
import { WORKSPACES } from '../../mock/shippingData';
import {
  Ship,
  Building2,
  Truck,
  DollarSign,
  Package,
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  KeyRound,
  Globe,
  Sun,
  Moon,
  AlertCircle,
  X,
} from 'lucide-react';

interface LoginPageProps {
  onLogin: (credentials: {
    email: string;
    role: string;
    workspace: WorkspaceCompany;
    userName: string;
  }) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLogin,
  theme,
  onToggleTheme,
}) => {
  const [email, setEmail] = useState('ops.director@pacificcrest.com');
  const [password, setPassword] = useState('••••••••••••');
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState('COMP-001');
  const [selectedRole, setSelectedRole] = useState('nvocc_admin');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  // Quick 1-Click Persona Profiles for instant testing
  const demoProfiles = [
    {
      role: 'nvocc_admin',
      label: 'NVOCC Admin',
      badge: 'CARRIER',
      name: 'Capt. Ethan Roberts',
      email: 'ops.director@pacificcrest.com',
      workspaceId: 'COMP-001',
      workspaceName: 'Pacific Crest Freight (NVOCC)',
      desc: 'Master B/L, vessel charters, container fleet & portal permissions',
      icon: <Building2 className="w-4 h-4 text-neutral-900 dark:text-white" />,
    },
    {
      role: 'freight_forwarder',
      label: 'Freight Forwarder',
      badge: 'FORWARDER',
      name: 'Sarah Chen',
      email: 'forwarding.desk@pacificcrest.com',
      workspaceId: 'COMP-001',
      workspaceName: 'Pacific Crest Forwarding Branch',
      desc: 'Client cargo bookings, House B/L (HBL), CFS groupage, customs entries',
      icon: <Truck className="w-4 h-4 text-neutral-900 dark:text-white" />,
    },
    {
      role: 'finance_staff',
      label: 'Finance & Ledger',
      badge: 'FINANCE',
      name: 'Marcus Vance',
      email: 'billing@pacificcrest.com',
      workspaceId: 'COMP-001',
      workspaceName: 'Pacific Crest Commercial Desk',
      desc: 'Ocean freight billing, demurrage detention fees, receivables ledger',
      icon: <DollarSign className="w-4 h-4 text-neutral-900 dark:text-white" />,
    },
    {
      role: 'platform_admin',
      label: 'Shiplot SaaS Root',
      badge: 'SAAS ADMIN',
      name: 'System Root Administrator',
      email: 'root@shiplot.io',
      workspaceId: 'COMP-001',
      workspaceName: 'Shiplot Global Provider Plane',
      desc: 'Multi-tenant NVOCC provisioning, plan management, EDI carrier tunnel',
      icon: <ShieldCheck className="w-4 h-4 text-neutral-900 dark:text-white" />,
    },
    {
      role: 'exporter',
      label: 'Exporter / Shipper',
      badge: 'SHIPPER',
      name: 'David Miller',
      email: 'export@precision-electronics.com',
      workspaceId: 'COMP-001',
      workspaceName: 'Pacific Precision Electronics Inc.',
      desc: 'Create booking requests, commercial invoice upload, cargo tracking',
      icon: <Package className="w-4 h-4 text-neutral-900 dark:text-white" />,
    },
    {
      role: 'importer',
      label: 'Importer / Consignee',
      badge: 'CONSIGNEE',
      name: 'Elena Rostova',
      email: 'logistics@cleanenergy.com',
      workspaceId: 'COMP-001',
      workspaceName: 'California Clean Energy Systems',
      desc: 'Track arrival notices, container discharge status, CBP clearance',
      icon: <Ship className="w-4 h-4 text-neutral-900 dark:text-white" />,
    },
  ];

  const handleSelectDemo = (profile: typeof demoProfiles[0]) => {
    setEmail(profile.email);
    setPassword('Shiplot2026!Secure');
    setSelectedRole(profile.role);
    setSelectedWorkspaceId(profile.workspaceId);
    setErrorMsg(null);
  };

  const handleQuickLogin = (profile: typeof demoProfiles[0]) => {
    handleSelectDemo(profile);
    const workspace = WORKSPACES.find((w) => w.id === profile.workspaceId) || WORKSPACES[0];
    setIsLoading(true);
    setTimeout(() => {
      onLogin({
        email: profile.email,
        role: profile.role,
        workspace,
        userName: profile.name,
      });
    }, 400);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMsg('Please enter your company work email.');
      return;
    }

    const matchedProfile = demoProfiles.find((p) => p.email.toLowerCase() === email.toLowerCase());
    const roleToUse = matchedProfile ? matchedProfile.role : selectedRole;
    const userNameToUse = matchedProfile ? matchedProfile.name : email.split('@')[0];
    const workspace = WORKSPACES.find((w) => w.id === selectedWorkspaceId) || WORKSPACES[0];

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin({
        email,
        role: roleToUse,
        workspace,
        userName: userNameToUse,
      });
    }, 500);
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) return;
    setResetSuccess(true);
    setTimeout(() => {
      setIsForgotModalOpen(false);
      setResetSuccess(false);
      setResetEmail('');
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-neutral-100 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 font-sans transition-colors duration-200">
      {/* Top Simple Utility Bar */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center font-mono font-bold text-base shadow-sm">
            S
          </div>
          <div>
            <span className="font-bold tracking-tight text-lg text-neutral-900 dark:text-white">
              Shiplot
            </span>
            <span className="text-[11px] font-mono text-neutral-400 block -mt-0.5">
              NVOCC & Freight Forwarding Cloud
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onToggleTheme}
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs font-mono font-medium hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors shadow-xs"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          >
            {theme === 'dark' ? (
              <>
                <Moon className="w-3.5 h-3.5 text-blue-400" />
                <span>Dark Mode</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span>Light Mode</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Login Area */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10">
        <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Quick 1-Click Role Switcher Profiles for Fast Evaluation */}
          <div className="lg:col-span-5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 shadow-sm flex flex-col justify-between space-y-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">
                  DEMO PORTALS (1-CLICK)
                </span>
              </div>
              <h2 className="text-base font-bold text-neutral-900 dark:text-white mt-1.5 font-sans">
                Instant Multi-Tenant Role Login
              </h2>
              <p className="text-xs text-neutral-500 font-sans mt-0.5 leading-relaxed">
                Click any persona below to auto-populate credentials and immediately launch into that dedicated portal:
              </p>

              {/* Profiles List */}
              <div className="mt-4 space-y-2">
                {demoProfiles.map((p) => {
                  const isSelected = email === p.email;
                  return (
                    <div
                      key={p.role}
                      onClick={() => handleSelectDemo(p)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all text-xs font-sans ${
                        isSelected
                          ? 'border-neutral-900 dark:border-white bg-neutral-50 dark:bg-neutral-800/80 shadow-xs'
                          : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-white dark:bg-neutral-900'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2.5">
                          <div className="p-1.5 rounded bg-neutral-100 dark:bg-neutral-800 shrink-0 mt-0.5">
                            {p.icon}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-neutral-900 dark:text-white">
                                {p.label}
                              </span>
                              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300">
                                {p.badge}
                              </span>
                            </div>
                            <div className="text-[11px] text-neutral-500 font-mono mt-0.5">
                              {p.name} · {p.email}
                            </div>
                            <div className="text-[10px] text-neutral-400 font-sans mt-1 line-clamp-1">
                              {p.desc}
                            </div>
                          </div>
                        </div>

                        {/* Direct 1-Click Launch Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuickLogin(p);
                          }}
                          className="shrink-0 px-2 py-1 rounded bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-[10px] font-mono font-bold hover:opacity-90"
                          title="Instant Launch"
                        >
                          Launch →
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 text-[11px] font-mono text-neutral-400 flex items-center justify-between">
              <span>FMC Licensed Platform</span>
              <span>256-bit AES Encryption</span>
            </div>
          </div>

          {/* Right Column: Standard Corporate Login Form */}
          <div className="lg:col-span-7 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 sm:p-8 shadow-sm flex flex-col justify-between space-y-6">
            <div>
              <div className="pb-4 border-b border-neutral-100 dark:border-neutral-800">
                <h1 className="text-xl font-bold text-neutral-900 dark:text-white font-sans">
                  Sign in to your Shiplot Workspace
                </h1>
                <p className="text-xs text-neutral-500 font-sans mt-1">
                  Enter your freight forwarding credentials or selected tenant domain to access your operations dashboard.
                </p>
              </div>

              {errorMsg && (
                <div className="mt-4 p-3 rounded bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-mono flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs font-mono">
                {/* Workspace Selector */}
                <div>
                  <label className="block text-neutral-500 mb-1 font-semibold uppercase text-[11px]">
                    NVOCC Carrier / Workspace
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <select
                      value={selectedWorkspaceId}
                      onChange={(e) => setSelectedWorkspaceId(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded text-neutral-900 dark:text-white focus:outline-none focus:border-neutral-400"
                    >
                      {WORKSPACES.map((w) => (
                        <option key={w.id} value={w.id}>
                          {w.name} ({w.id})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-neutral-500 mb-1 font-semibold uppercase text-[11px]">
                    Work Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      type="email"
                      required
                      placeholder="name@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded text-neutral-900 dark:text-white focus:outline-none focus:border-neutral-400"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-neutral-500 font-semibold uppercase text-[11px]">
                      Security Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsForgotModalOpen(true)}
                      className="text-[11px] text-neutral-500 dark:text-neutral-400 hover:underline font-sans"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-9 pr-10 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded text-neutral-900 dark:text-white focus:outline-none focus:border-neutral-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me and SSO Options */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer font-sans text-xs text-neutral-600 dark:text-neutral-300 select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-neutral-300 dark:border-neutral-700 text-neutral-900 focus:ring-0"
                    />
                    <span>Remember my active session</span>
                  </label>
                </div>

                {/* Submit Sign-in Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 rounded bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-xs"
                >
                  {isLoading ? (
                    <span>Authenticating Workspace...</span>
                  ) : (
                    <>
                      <span>Sign In to Shiplot</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Single Sign-on Divider */}
              <div className="mt-5 pt-5 border-t border-neutral-100 dark:border-neutral-800">
                <div className="text-center text-[11px] text-neutral-400 font-sans mb-3">
                  Enterprise Single Sign-On (SSO)
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <button
                    type="button"
                    onClick={() => {
                      const profile = demoProfiles[0];
                      handleQuickLogin(profile);
                    }}
                    className="p-2 rounded border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <KeyRound className="w-3.5 h-3.5 text-neutral-500" />
                    <span>Okta / SAML SSO</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const profile = demoProfiles[3];
                      handleQuickLogin(profile);
                    }}
                    className="p-2 rounded border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-neutral-500" />
                    <span>Azure AD Portal</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Compliance Guarantee */}
            <div className="text-[11px] text-neutral-400 font-mono text-center pt-2">
              Shiplot FMC Tariff & EDI Direct Gateway · High Availability Multi-Tenant Cloud
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 py-3.5 px-6 text-xs text-neutral-500 font-mono">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© 2026 Shiplot Logistics Technologies Inc.</span>
          <span>FMC Licensed NVOCC Engine · ISO 27001 Certified</span>
        </div>
      </footer>

      {/* Forgot Password Modal */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg max-w-md w-full p-6 shadow-2xl space-y-4 text-xs font-mono">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
              <span className="font-bold text-sm text-neutral-900 dark:text-white">Reset Workspace Password</span>
              <button onClick={() => setIsForgotModalOpen(false)} className="text-neutral-400 hover:text-neutral-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            {resetSuccess ? (
              <div className="p-3 rounded bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Password reset token dispatched to {resetEmail}. Check your company inbox.</span>
              </div>
            ) : (
              <form onSubmit={handleResetSubmit} className="space-y-3">
                <p className="text-neutral-500 font-sans">
                  Enter your registered work email and your NVOCC tenant administrator will dispatch an instant password reset token.
                </p>
                <div>
                  <label className="block text-neutral-500 mb-1">Company Work Email</label>
                  <input
                    type="email"
                    required
                    placeholder="name@company.com"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded text-neutral-900 dark:text-white focus:outline-none"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsForgotModalOpen(false)}
                    className="px-3 py-1.5 rounded border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 font-sans"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-bold font-sans"
                  >
                    Send Reset Token
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
