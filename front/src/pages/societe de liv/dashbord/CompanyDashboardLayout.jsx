import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

function CompanyDashboardLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    navigate("/company/login");
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <div
        className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark"
        style={{ width: "280px" }}
      >
        <Link
          to="/company/dashboard"
          className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none"
        >
          <i className="fas fa-truck-moving me-2 fs-4 text-white"></i>
          <span className="fs-5 fw-bold text-white">Company Dashboard</span>
        </Link>
        <hr />
        <ul className="nav nav-pills flex-column mb-auto">
          <li className="nav-item">
            <Link to="/company/deliveries" className="nav-link text-white">
              <i className="fas fa-box me-2 text-white"></i>
              Livraisons
            </Link>
          </li>
          <li>
            <Link to="/company/routes" className="nav-link text-white">
              <i className="fas fa-route me-2 text-white"></i>
              Trajets
            </Link>
          </li>
          <li>
            <Link to="/company/personnel" className="nav-link text-white">
              <i className="fas fa-users me-2 text-white"></i>
              Livreurs
            </Link>
          </li>
          <li>
            <Link to="/company/depot" className="nav-link text-white">
              <i className="fas fa-warehouse me-2 text-white"></i>
              Détails Dépôt
            </Link>
          </li>
        </ul>
        <hr />
        <div>
          <button onClick={handleLogout} className="btn btn-danger w-100">
            <i className="fas fa-sign-out-alt me-2 text-white"></i>
            Déconnexion
          </button>
        </div>
      </div>

      <div className="flex-grow-1 p-4 bg-light">
        <Outlet />
      </div>
    </div>
  );
}

export default CompanyDashboardLayout;
