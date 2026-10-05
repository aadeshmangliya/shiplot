import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CompanyUser, CompanyUserRole } from '../types';
import {
  Lock,
  Shield,
  Check,
  X,
  Users,
  Plus,
  Search,
  Eye,
  EyeOff,
  UserCheck,
  UserX,
  KeyRound,
  ShieldAlert,
  Building2,
  Trash2,
  Edit2,
  Filter
} from 'lucide-react';

export const UsersRolesPage: React.FC = () => {
  const {
    roles,
    togglePermission,
    currentCompany,
    companyUsers,
    addCompanyUser,
    updateCompanyUser,
    deleteCompanyUser
  } = useApp();

  type PageTab = 'users' | 'roles';
  const [activeTab, setActiveTab] = useState<PageTab>('users');

  // Search & Filter for Users
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  // Modal / Form state for creating a user
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPassword, setFormPassword] = useState('Welcome@2026');
  const [formRole, setFormRole] = useState<CompanyUserRole>('freight_forwarder');
  const [formDepartment, setFormDepartment] = useState('Freight Operations');
  const [formPhone, setFormPhone] = useState('+92-300-1234567');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // RBAC Roles State
  const [selectedRoleId, setSelectedRoleId] = useState(roles[0]?.roleId || 'nvocc_admin');
  const currentRole = roles.find(r => r.roleId === selectedRoleId) || roles[0];

  const roleTitleMap: Record<CompanyUserRole, string> = {
    freight_forwarder: 'Freight Forwarding Partner',
    importer: 'Importer / Consignee Portal',
    exporter: 'Shipper / Exporter Portal',
    finance: 'Finance & Accounts Officer',
    operations: 'Port & Drayage Operations',
    documentation: 'B/L & Documentation Officer',
    nvocc_admin: 'NVOCC Carrier Administrator'
  };

  const roleBadgeColors: Record<CompanyUserRole, string> = {
    freight_forwarder: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300',
    importer: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300',
    exporter: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
    finance: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
    operations: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300',
    documentation: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300',
    nvocc_admin: 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-bold'
  };

  const permissionLabels: Record<string, { label: string; desc: string }> = {
    aisTracking: {
      label: 'Live AIS Satellite Vessel Telemetry',
      desc: 'Access live ship coordinates, GPS fixes, nautical speed knots, and sea state conditions'
    },
    demurrageOverride: {
      label: 'Demurrage Tariff & Free-Time Override',
      desc: 'Authority to extend container free-time or waive terminal detention charges'
    },
    mblManagement: {
      label: 'Ocean Carrier Master B/L (MBL) Editing',
      desc: 'Edit carrier-level Master Bills of Lading and direct EDI transmissions via INTTRA'
    },
    hblGeneration: {
      label: 'Negotiable Ocean House B/L (HBL) Issuance',
      desc: 'Generate, sign, and issue FMC-compliant negotiable FIATA House Bills of Lading'
    },
    profitMargins: {
      label: 'Carrier Cost & Commercial Profit Margins',
      desc: 'View buy/sell ocean freight spreads, carrier contract base rates, and net margin %'
    },
    cfsConsolidation: {
      label: 'CFS Groupage Lot & Stuffing Authorization',
      desc: 'Assign LCL cargo packages to shared ocean containers and authorize CFS stuffing'
    },
    customsHolds: {
      label: 'Customs Examination & 1B Hold Resolution',
      desc: 'Coordinate CBP exam stations (CES), file duty releases, and mark 1B clearance'
    },
    carrierContracts: {
      label: 'Ocean Carrier Annual Service Contracts',
      desc: 'Manage service contract tiers with MSC, Maersk, CMA CGM, ONE, and Hapag-Lloyd'
    },
    ledgerInvoicing: {
      label: 'Freight Receivables Ledger & Invoicing',
      desc: 'Create, issue, and reconcile commercial ocean freight invoices and payment receipts'
    },
    extraTelemetry: {
      label: 'Extended Port Congestion & AIS Raw Feeds',
      desc: 'Access terminal berthing wait times, pilotage boarding times, and weather telemetry'
    },
    ledgerAccess: {
      label: 'General Ledger & Disbursement Access',
      desc: 'Access Double-entry general ledger, Trial Balance, and PDA/FDA accounts'
    },
    igmEgmAccess: {
      label: 'Customs Manifest (IGM/EGM) Management',
      desc: 'Create and file inward and outward manifests with customs authorities'
    },
    canGenerateDeliveryOrder: {
      label: 'Delivery Order (D.O.) Issuance Authority',
      desc: 'Generate and sign official cargo delivery orders for port terminals'
    }
  };

  const handleTogglePermission = (permKey: string) => {
    togglePermission(currentRole.roleId, permKey);
    const nextVal = !currentRole.permissions[permKey as keyof typeof currentRole.permissions];
    setToastMessage(`Updated: "${permissionLabels[permKey]?.label || permKey}" is now ${nextVal ? 'ENABLED' : 'DISABLED'} for ${currentRole.roleName}`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const togglePasswordVisibility = (userId: string) => {
    setVisiblePasswords(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingUserId) {
      updateCompanyUser(editingUserId, {
        name: formName,
        email: formEmail,
        password: formPassword,
        role: formRole,
        roleTitle: roleTitleMap[formRole],
        department: formDepartment,
        phone: formPhone
      });
      setToastMessage(`User "${formName}" updated successfully!`);
    } else {
      const newUser: CompanyUser = {
        id: `usr_${Date.now()}`,
        name: formName,
        email: formEmail,
        password: formPassword,
        role: formRole,
        roleTitle: roleTitleMap[formRole],
        department: formDepartment,
        phone: formPhone,
        status: 'Active',
        createdAt: new Date().toISOString().split('T')[0],
        lastLogin: 'Never logged in',
        companyId: currentCompany.id
      };
      addCompanyUser(newUser);
      setToastMessage(`New user "${formName}" (${roleTitleMap[formRole]}) created with login credentials!`);
    }

    // Reset Form
    setIsCreateUserOpen(false);
    setEditingUserId(null);
    setFormName('');
    setFormEmail('');
    setFormPassword('Welcome@2026');
    setFormRole('freight_forwarder');
    setFormDepartment('Freight Operations');
    setFormPhone('+92-300-1234567');
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleEditClick = (user: CompanyUser) => {
    setEditingUserId(user.id);
    setFormName(user.name);
    setFormEmail(user.email);
    setFormPassword(user.password || 'Welcome@2026');
    setFormRole(user.role);
    setFormDepartment(user.department);
    setFormPhone(user.phone || '');
    setIsCreateUserOpen(true);
  };

  const handleToggleStatus = (user: CompanyUser) => {
    const nextStatus = user.status === 'Active' ? 'Suspended' : 'Active';
    updateCompanyUser(user.id, { status: nextStatus });
    setToastMessage(`User "${user.name}" status changed to ${nextStatus}`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDeleteUser = (user: CompanyUser) => {
    if (window.confirm(`Are you sure you want to delete user account "${user.name}"?`)) {
      deleteCompanyUser(user.id);
      setToastMessage(`User "${user.name}" deleted.`);
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const filteredUsers = companyUsers.filter(u => {
    if (roleFilter !== 'All' && u.role !== roleFilter) return false;
    if (userSearch) {
      const q = userSearch.toLowerCase();
      return (
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.department.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">
              COMPANY USER DIRECTORY & ACCESS CONTROL
            </span>
            <span className="text-xs text-neutral-400 font-mono">
              {currentCompany.name}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white tracking-tight mt-1">
            User Accounts, Logins & Role Permissions
          </h1>
          <p className="text-xs text-neutral-500 font-mono mt-0.5">
            Create logins for Freight Forwarders, Importers, Exporters, and Finance staff with passwords and custom permission flags
          </p>
        </div>

        {activeTab === 'users' && (
          <button
            onClick={() => {
              setEditingUserId(null);
              setFormName('');
              setFormEmail('');
              setFormPassword('Welcome@2026');
              setFormRole('freight_forwarder');
              setFormDepartment('Freight Forwarding');
              setFormPhone('+92-300-1234567');
              setIsCreateUserOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-950 font-mono text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>+ Create New User</span>
          </button>
        )}
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-mono flex items-center gap-2 shadow-xs transition-all">
          <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Tabs Switcher */}
      <div className="flex border-b border-neutral-200 dark:border-neutral-800 space-x-4 text-xs font-mono">
        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 py-3 px-4 font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'users'
              ? 'border-neutral-900 text-neutral-900 dark:border-white dark:text-white'
              : 'border-transparent text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>User Accounts & Logins ({companyUsers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('roles')}
          className={`flex items-center gap-2 py-3 px-4 font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'roles'
              ? 'border-neutral-900 text-neutral-900 dark:border-white dark:text-white'
              : 'border-transparent text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>Role Permissions Matrix (RBAC)</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: USER ACCOUNTS & LOGINS DIRECTORY                   */}
      {/* ======================================================== */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          {/* Search & Filter Bar */}
          <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search user by name, login email, role, or department..."
                value={userSearch}
                onChange={e => setUserSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-neutral-100 dark:bg-neutral-800 border border-transparent focus:border-neutral-300 dark:focus:border-neutral-700 rounded-lg text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-hidden font-mono"
              />
            </div>

            <select
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
              className="px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 text-xs font-mono text-neutral-700 dark:text-neutral-300"
            >
              <option value="All">All User Roles</option>
              <option value="freight_forwarder">Freight Forwarder</option>
              <option value="importer">Importer / Consignee</option>
              <option value="exporter">Exporter / Shipper</option>
              <option value="finance">Finance & Accounts</option>
              <option value="operations">Operations & Drayage</option>
              <option value="documentation">Documentation Officer</option>
              <option value="nvocc_admin">NVOCC Administrator</option>
            </select>
          </div>

          {/* Users Table */}
          <div className="rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="bg-neutral-50 dark:bg-neutral-800/60 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 text-[11px]">
                    <th className="py-3 px-4">User Name</th>
                    <th className="py-3 px-4">Login Email / Username</th>
                    <th className="py-3 px-4">Assigned Role</th>
                    <th className="py-3 px-4">Department / Desk</th>
                    <th className="py-3 px-4">Login Password</th>
                    <th className="py-3 px-4">Contact Phone</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                  {filteredUsers.map(user => {
                    const isVisible = visiblePasswords[user.id];
                    return (
                      <tr key={user.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-neutral-900 dark:text-white">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center font-bold text-[11px] text-neutral-700 dark:text-neutral-300">
                              {user.name.charAt(0)}
                            </div>
                            <div>
                              <div>{user.name}</div>
                              <div className="text-[10px] text-neutral-400 font-normal">Added: {user.createdAt}</div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 font-mono text-neutral-800 dark:text-neutral-200">
                          {user.email}
                        </td>

                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${roleBadgeColors[user.role]}`}>
                            {user.roleTitle}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-neutral-600 dark:text-neutral-400">
                          {user.department}
                        </td>

                        <td className="py-3.5 px-4 font-mono">
                          <div className="flex items-center gap-2">
                            <span className="text-neutral-800 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded">
                              {isVisible ? user.password : '••••••••••••'}
                            </span>
                            <button
                              onClick={() => togglePasswordVisibility(user.id)}
                              className="text-neutral-400 hover:text-neutral-600 dark:hover:text-white cursor-pointer"
                              title={isVisible ? 'Hide password' : 'View password'}
                            >
                              {isVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-neutral-500 text-[11px]">
                          {user.phone || '—'}
                        </td>

                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              user.status === 'Active'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            }`}
                          >
                            {user.status.toUpperCase()}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleToggleStatus(user)}
                              className="p-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-white cursor-pointer"
                              title={user.status === 'Active' ? 'Suspend account' : 'Activate account'}
                            >
                              {user.status === 'Active' ? <UserX className="w-4 h-4 text-amber-500" /> : <UserCheck className="w-4 h-4 text-emerald-500" />}
                            </button>

                            <button
                              onClick={() => handleEditClick(user)}
                              className="p-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-white cursor-pointer"
                              title="Edit user"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleDeleteUser(user)}
                              className="p-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 hover:text-rose-600 cursor-pointer"
                              title="Delete user"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: ROLE PERMISSION MATRIX (RBAC)                      */}
      {/* ======================================================== */}
      {activeTab === 'roles' && (
        <div className="space-y-6">
          {/* Role Selector Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {roles.map(r => (
              <button
                key={r.roleId}
                onClick={() => setSelectedRoleId(r.roleId)}
                className={`px-3 py-2 rounded-lg text-xs font-mono font-medium transition-all whitespace-nowrap cursor-pointer ${
                  selectedRoleId === r.roleId
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-bold shadow-xs'
                    : 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                {r.roleName}
              </button>
            ))}
          </div>

          {/* Current Role Details & Permission Flags */}
          <div className="p-6 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-100 dark:border-neutral-800">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base text-neutral-900 dark:text-white">
                    {currentRole.roleName}
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-semibold">
                    {currentRole.roleCategory}
                  </span>
                </div>
                <p className="text-xs text-neutral-500 font-mono mt-0.5">
                  {currentRole.description}
                </p>
              </div>

              <div className="text-xs font-mono text-neutral-500">
                Active Permissions:{' '}
                <strong className="text-emerald-600 dark:text-emerald-400">
                  {Object.values(currentRole.permissions).filter(Boolean).length} / {Object.keys(currentRole.permissions).length}
                </strong>
              </div>
            </div>

            {/* Permission Toggles List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(currentRole.permissions).map(([permKey, isEnabled]) => {
                const meta = permissionLabels[permKey] || {
                  label: permKey,
                  desc: 'System authorized permission capability'
                };
                return (
                  <div
                    key={permKey}
                    onClick={() => handleTogglePermission(permKey)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                      isEnabled
                        ? 'border-neutral-900 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800/40'
                        : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 opacity-60'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="font-bold text-xs text-neutral-900 dark:text-white flex items-center gap-2">
                        {meta.label}
                      </div>
                      <p className="text-[11px] text-neutral-500 font-mono leading-relaxed">
                        {meta.desc}
                      </p>
                    </div>

                    <div className="pt-0.5">
                      <div
                        className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 ease-in-out ${
                          isEnabled
                            ? 'bg-neutral-900 dark:bg-white'
                            : 'bg-neutral-300 dark:bg-neutral-700'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full transition-transform duration-200 ease-in-out ${
                            isEnabled
                              ? 'translate-x-4 bg-white dark:bg-neutral-950'
                              : 'translate-x-0 bg-white'
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* CREATE / EDIT USER MODAL                                 */}
      {/* ======================================================== */}
      {isCreateUserOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xl max-w-xl w-full p-6 font-mono text-xs space-y-5">
            <div className="flex justify-between items-center border-b border-neutral-200 dark:border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-neutral-900 dark:text-white" />
                <span className="font-bold text-sm text-neutral-900 dark:text-white">
                  {editingUserId ? 'Edit User Credentials' : 'Create New Company User'}
                </span>
              </div>
              <button
                onClick={() => setIsCreateUserOpen(false)}
                className="p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-neutral-700 dark:text-neutral-300 mb-1 font-semibold">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tariq Mehmood"
                    value={formName}
                    onChange={e => setFormName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 mb-1 font-semibold">
                    Login Email / Username *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="user@example.com"
                    value={formEmail}
                    onChange={e => setFormEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 mb-1 font-semibold">
                    Login Password *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="Enter login password"
                      value={formPassword}
                      onChange={e => setFormPassword(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={() => setFormPassword(`Indus#${Math.floor(1000 + Math.random() * 9000)}`)}
                      className="absolute right-2 top-2 text-[10px] text-blue-600 hover:underline cursor-pointer"
                    >
                      Generate
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 mb-1 font-semibold">
                    User Role *
                  </label>
                  <select
                    value={formRole}
                    onChange={e => setFormRole(e.target.value as CompanyUserRole)}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-hidden"
                  >
                    <option value="freight_forwarder">Freight Forwarder Partner</option>
                    <option value="importer">Importer / Consignee</option>
                    <option value="exporter">Exporter / Shipper</option>
                    <option value="finance">Finance & Accounts Officer</option>
                    <option value="operations">Port Operations Officer</option>
                    <option value="documentation">Documentation Officer</option>
                    <option value="nvocc_admin">NVOCC Carrier Administrator</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 mb-1 font-semibold">
                    Department / Organization
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Accounts Desk / Client Co"
                    value={formDepartment}
                    onChange={e => setFormDepartment(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-hidden"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-neutral-700 dark:text-neutral-300 mb-1">
                    Phone / Mobile Number
                  </label>
                  <input
                    type="text"
                    placeholder="+92-300-1234567"
                    value={formPhone}
                    onChange={e => setFormPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsCreateUserOpen(false)}
                  className="px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-950 font-bold cursor-pointer"
                >
                  {editingUserId ? 'Save Changes' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
