import React from 'react';
import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { DashboardPage } from './pages/DashboardPage';
import { ShipmentsPage } from './pages/ShipmentsPage';
import { FclPage } from './pages/FclPage';
import { LclPage } from './pages/LclPage';
import { ContainersPage } from './pages/ContainersPage';
import { GatePassPage } from './pages/GatePassPage';
import { WarehousePage } from './pages/WarehousePage';
import { BookingsPage } from './pages/BookingsPage';
import { BillOfLadingPage } from './pages/BillOfLadingPage';
import { DocumentsPage } from './pages/DocumentsPage';
import { TrackingPage } from './pages/TrackingPage';
import { CustomsPage } from './pages/CustomsPage';
import { PortsTerminalsPage } from './pages/PortsTerminalsPage';
import { VesselsPage } from './pages/VesselsPage';
import { FinancePage } from './pages/FinancePage';
import { PartnersPage } from './pages/PartnersPage';
import { ReportsPage } from './pages/ReportsPage';
import { UsersRolesPage } from './pages/UsersRolesPage';
import { CompanySettingsPage } from './pages/CompanySettingsPage';
import { PlatformAdminPage } from './pages/PlatformAdminPage';
import { PortalShipperPage } from './pages/PortalShipperPage';
import { PortalConsigneePage } from './pages/PortalConsigneePage';
import { PortalAgentPage } from './pages/PortalAgentPage';
import { AuthPage } from './pages/AuthPage';
import { ShipmentDetailModal } from './components/modals/ShipmentDetailModal';
import { BillOfLadingModal } from './components/modals/BillOfLadingModal';
import { CreateBookingModal } from './components/modals/CreateBookingModal';

const AppLayout: React.FC = () => {
  const {
    selectedShipmentForDetail,
    setSelectedShipmentForDetail,
    selectedShipmentForBl,
    setSelectedShipmentForBl
  } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 antialiased font-sans transition-colors">
      <Header />
      <div className="flex-1 flex">
        <Sidebar />
        <main className="flex-1 overflow-y-auto min-w-0">
          <Outlet />
        </main>
      </div>

      {/* Global Modals */}
      {selectedShipmentForDetail && (
        <ShipmentDetailModal
          shipment={selectedShipmentForDetail}
          onClose={() => setSelectedShipmentForDetail(null)}
          onOpenBl={() => {
            setSelectedShipmentForBl(selectedShipmentForDetail);
            setSelectedShipmentForDetail(null);
          }}
        />
      )}

      {selectedShipmentForBl && (
        <BillOfLadingModal
          shipment={selectedShipmentForBl}
          onClose={() => setSelectedShipmentForBl(null)}
        />
      )}

      <CreateBookingModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Auth Page */}
          <Route path="/login" element={<AuthPage />} />

          {/* SaaS Application Shell */}
          <Route element={<AppLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/shipments" element={<ShipmentsPage />} />
            <Route path="/fcl" element={<FclPage />} />
            <Route path="/containers" element={<ContainersPage />} />
            <Route path="/gatepass" element={<GatePassPage />} />
            <Route path="/warehouses" element={<WarehousePage />} />
            <Route path="/warehouse" element={<WarehousePage />} />
            <Route path="/lcl" element={<LclPage />} />
            <Route path="/bookings" element={<BookingsPage />} />
            <Route path="/bill-of-lading" element={<BillOfLadingPage />} />
            <Route path="/documents" element={<DocumentsPage />} />
            <Route path="/tracking" element={<TrackingPage />} />
            <Route path="/customs" element={<CustomsPage />} />
            <Route path="/ports" element={<PortsTerminalsPage />} />
            <Route path="/vessels" element={<VesselsPage />} />
            <Route path="/finance" element={<FinancePage />} />
            <Route path="/partners" element={<PartnersPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/users" element={<UsersRolesPage />} />
            <Route path="/settings" element={<CompanySettingsPage />} />

            {/* Platform Admin */}
            <Route path="/platform-admin" element={<PlatformAdminPage />} />
            <Route path="/platform-admin/companies" element={<PlatformAdminPage />} />
            <Route path="/platform-admin/subscriptions" element={<PlatformAdminPage />} />
            <Route path="/platform-admin/audit" element={<PlatformAdminPage />} />

            {/* External Client Portals */}
            <Route path="/portal/shipper" element={<PortalShipperPage />} />
            <Route path="/portal/consignee" element={<PortalConsigneePage />} />
            <Route path="/portal/agent" element={<PortalAgentPage />} />

            {/* Catch-all redirect to Dashboard */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
