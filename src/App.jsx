import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { RoleProvider } from "./context/RoleContext";
import { AuthProvider } from "./context/AuthContext";
import { Layout } from "./components/layout/Layout";

// Public Pages
import LandingPage from "./pages/public/LandingPage";
import FranchiseApplication from "./pages/public/FranchiseApplication";

// Auth Pages
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";

// Admin Dashboard Routes
import AdminOverview from "./pages/admin/AdminOverview";
import AdminHousing from "./pages/admin/AdminHousing";
import AdminProcurement from "./pages/admin/AdminProcurement";
import AdminAcademy from "./pages/admin/AdminAcademy";
import AdminClimate from "./pages/admin/AdminClimate";

// Admin Management Routes
import HouseManagement from "./pages/admin/HouseManagement";
import RulesEngine from "./pages/admin/RulesEngine";
import RegionManagement from "./pages/admin/RegionManagement";
import UserManagement from "./pages/admin/UserManagement";
import OrderManagement from "./pages/admin/OrderManagement";
import ComponentRegistry from "./pages/admin/ComponentRegistry";
import ApplicationManagement from "./pages/admin/ApplicationManagement";

// Accountant Routes
import PendingPayments from "./pages/accountant/PendingPayments";
import PaymentHistory from "./pages/accountant/PaymentHistory";

// Investor Routes
import InvestorOverview from "./pages/investor/InvestorOverview";
import InvestorHousing from "./pages/investor/InvestorHousing";
import InvestmentOpportunities from "./pages/investor/InvestmentOpportunities";
import MyInvestments from "./pages/investor/MyInvestments";

// Government Routes
import GovernmentOverview from "./pages/government/GovernmentOverview";
import GovernmentHousing from "./pages/government/GovernmentHousing";
import ComplianceReview from "./pages/government/ComplianceReview";

// Franchisee Routes
import FranchiseeOverview from "./pages/franchisee/FranchiseeOverview";
import HouseCatalog from "./pages/franchisee/HouseCatalog";
import OrderBOQ from "./pages/franchisee/OrderBOQ";
import PaymentUpload from "./pages/franchisee/PaymentUpload";
import MyOrders from "./pages/franchisee/MyOrders";
import FranchiseeProcurement from "./pages/franchisee/FranchiseeProcurement";
import FranchiseeAcademy from "./pages/franchisee/FranchiseeAcademy";

// Academy Routes
import CourseLibrary from "./pages/academy/CourseLibrary";
import TraineeManagement from "./pages/academy/TraineeManagement";
import CertificationTracker from "./pages/academy/CertificationTracker";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* ═══ Public Routes (no layout) ═══ */}
          <Route path="/" element={<Navigate to="/admin/overview" replace />} />
          <Route path="/apply/franchise" element={<FranchiseApplication />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* ═══ Dashboard Routes (with sidebar layout) ═══ */}
          <Route element={<RoleProvider><Layout /></RoleProvider>}>

            {/* Admin — Dashboards */}
            <Route path="/admin/overview" element={<AdminOverview />} />
            <Route path="/admin/housing" element={<AdminHousing />} />
            <Route path="/admin/procurement" element={<AdminProcurement />} />
            <Route path="/admin/academy" element={<AdminAcademy />} />
            <Route path="/admin/climate" element={<AdminClimate />} />

            {/* Admin — Management */}
            <Route path="/admin/houses" element={<HouseManagement />} />
            <Route path="/admin/rules" element={<RulesEngine />} />
            <Route path="/admin/regions" element={<RegionManagement />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/orders" element={<OrderManagement />} />
            <Route path="/admin/components" element={<ComponentRegistry />} />
            <Route path="/admin/applications" element={<ApplicationManagement />} />

            {/* Accountant */}
            <Route path="/accountant/payments" element={<PendingPayments />} />
            <Route path="/accountant/history" element={<PaymentHistory />} />

            {/* Investor */}
            <Route path="/investor/overview" element={<InvestorOverview />} />
            <Route path="/investor/housing" element={<InvestorHousing />} />
            <Route path="/investor/climate" element={<AdminClimate />} />
            <Route path="/investor/opportunities" element={<InvestmentOpportunities />} />
            <Route path="/investor/investments" element={<MyInvestments />} />

            {/* Government */}
            <Route path="/government/overview" element={<GovernmentOverview />} />
            <Route path="/government/housing" element={<GovernmentHousing />} />
            <Route path="/government/climate" element={<AdminClimate />} />
            <Route path="/government/compliance" element={<ComplianceReview />} />

            {/* Franchisee */}
            <Route path="/franchisee/overview" element={<FranchiseeOverview />} />
            <Route path="/franchisee/catalog" element={<HouseCatalog />} />
            <Route path="/franchisee/order-boq" element={<OrderBOQ />} />
            <Route path="/franchisee/payment" element={<PaymentUpload />} />
            <Route path="/franchisee/orders" element={<MyOrders />} />
            <Route path="/franchisee/procurement" element={<FranchiseeProcurement />} />
            <Route path="/franchisee/academy" element={<FranchiseeAcademy />} />

            {/* Academy */}
            <Route path="/academy/courses" element={<CourseLibrary />} />
            <Route path="/academy/trainees" element={<TraineeManagement />} />
            <Route path="/academy/certifications" element={<CertificationTracker />} />

          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
