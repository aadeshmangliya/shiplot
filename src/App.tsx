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
import { ManifestPage } from './pages/ManifestPage';
import { DeliveryOrderPage } from './pages/DeliveryOrderPage';
import { ShippingAgencyPage } from './pages/ShippingAgencyPage';
import { PublicTrackingPage } from './pages/PublicTrackingPage';
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
    <div className="h-screen w-full flex flex-col overflow-hidden bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 antialiased font-sans transition-colors">
      <Header />
      <div className="flex-1 flex min-h-0 overflow-hidden relative">
        <Sidebar />
        <main className="flex-1 h-full overflow-y-auto min-w-0 overscroll-contain">
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
          {/* Public Standalone Pages */}
          <Route path="/login" element={<AuthPage />} />
          <Route path="/track" element={<PublicTrackingPage />} />
          <Route path="/track/:trackingNo" element={<PublicTrackingPage />} />
          <Route path="/portal/track" element={<PublicTrackingPage />} />

          {/* SaaS Application Shell */}
          <Route element={<AppLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/shipments" element={<ShipmentsPage />} />
            <Route path="/fcl" element={<FclPage />} />
            <Route path="/containers" element={<ContainersPage />} />
            <Route path="/gatepass" element={<GatePassPage />} />
            <Route path="/warehouses" element={<WarehousePage />} />
            <Route path="/warehouse" element={<WarehousePage />} />
            <Route path="/manifest" element={<ManifestPage />} />
            <Route path="/manifests" element={<ManifestPage />} />
            <Route path="/delivery-order" element={<DeliveryOrderPage />} />
            <Route path="/do" element={<DeliveryOrderPage />} />
            <Route path="/agency" element={<ShippingAgencyPage />} />
            <Route path="/shipping-agency" element={<ShippingAgencyPage />} />
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
