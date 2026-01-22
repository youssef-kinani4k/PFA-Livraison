import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Accueil from "./pages/public/accueil";
import Features from "./pages/public/features/features";
import Abbout from "./pages/public/about/about";
import ContactPage from "./pages/public/contact/contact";
import Intermediare from "./pages/public/intermediare";
import Politique from "./pages/public/Politique";
import Condition from "./pages/public/Conditions-utilisation";

import LoginClient from "./pages/client/login";
import CreateCompteClient from "./pages/client/cree compte";

import LoginSociete from "./pages/societe de liv/login";
import CreateCompteSociete from "./pages/societe de liv/cree compte";
import InactivePage from "./pages/public/inactif";
import BlockedPage from "./pages/public/blocker";
import DeliveryPersonnelLogin from "./pages/livreur/login";
import DeliveryPersonnelBlockedPage from "./pages/public/blockedLivreur";
import AdminLogin from "./pages/admin/login/index";
import ClientDashboard from "./pages/client/dashbord";
import ProtectedRoute from "./routes/ProtectedRoute";
import CompanyDashboardLayout from "./pages/societe de liv/dashbord/CompanyDashboardLayout";
import CompanyDeliveries from "./pages/societe de liv/dashbord/CompanyDeliveries";
import DeliveryDetail from "./pages/societe de liv/dashbord/DeliveryDetail";
import RoutesList from "./pages/societe de liv/dashbord/RoutesList";
import CompanyPersonnel from "./pages/societe de liv/dashbord/CompanyPersonnel";
import CompanyDepotDetails from "./pages/societe de liv/dashbord/CompanyDepotDetails";
import RouteDetails from "./pages/societe de liv/dashbord/RouteDetails";
import DeliveryPersonnelDashboard from "./pages/livreur/dashbord/DeliveryPersonnelDashboard";
import AdminDashboard from "./pages/admin/dashbord/AdminDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Accueil />} />

        <Route path="/features" element={<Features />} />
        <Route path="/inactif" element={<InactivePage />} />
        <Route path="/blocker" element={<BlockedPage />} />
        <Route
          path="/livreur_blocke"
          element={<DeliveryPersonnelBlockedPage />}
        />
        <Route path="/about" element={<Abbout />} />
        <Route path="/politique" element={<Politique />} />
        <Route path="/conditions" element={<Condition />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/intermedier/:id" element={<Intermediare />} />

        <Route path="/client">
          <Route path="login" element={<LoginClient />} />
          <Route path="signin" element={<CreateCompteClient />} />
          <Route element={<ProtectedRoute allowedRoles={["CLIENT"]} />}>
            <Route path="dashboard" element={<ClientDashboard />} />
          </Route>
        </Route>

        <Route path="/company">
          <Route path="login" element={<LoginSociete />} />
          <Route path="signin" element={<CreateCompteSociete />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["COMPANY"]} />}>
          <Route path="/company" element={<CompanyDashboardLayout />}>
            <Route index element={<Navigate to="deliveries" replace />} />
            <Route path="deliveries" element={<CompanyDeliveries />} />
            <Route path="deliveries/:id" element={<DeliveryDetail />} />
            <Route path="routes" element={<RoutesList />} />
            <Route path="routes/:driverId" element={<RouteDetails />} />
            <Route path="personnel" element={<CompanyPersonnel />} />
            <Route path="depot" element={<CompanyDepotDetails />} />
          </Route>
        </Route>

        <Route path="/livreur">
          <Route path="login" element={<DeliveryPersonnelLogin />} />
          <Route
            element={<ProtectedRoute allowedRoles={["DELIVERY_PERSONNEL"]} />}
          >
            <Route path="dashboard" element={<DeliveryPersonnelDashboard />} />
          </Route>
        </Route>

        <Route path="/admin">
          <Route path="/admin">
            <Route path="login" element={<AdminLogin />} />
            <Route path="dashboard/*" element={<AdminDashboard />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
