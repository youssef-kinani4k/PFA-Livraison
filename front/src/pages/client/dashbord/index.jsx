import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import DeliveryHistory from "./deliveryhistory";
import CreateDeliveryForm from "./createdeliveryForm";

export default function ClientDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("create");

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      navigate("/client/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    navigate("/client/login");
  };

  return (
    <div className="container-fluid py-4" style={{ minHeight: "100vh" }}>
      <h1 className="mb-4 text-center text-primary">Tableau de Bord Client</h1>
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-white d-flex justify-content-between align-items-center">
          <ul className="nav nav-pills card-header-pills">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "create" ? "active" : ""}`}
                onClick={() => setActiveTab("create")}
              >
                Créer une Nouvelle Livraison
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${
                  activeTab === "history" ? "active" : ""
                }`}
                onClick={() => setActiveTab("history")}
              >
                Historique des Livraisons
              </button>
            </li>
          </ul>

          <button
            className="btn btn-outline-danger"
            onClick={handleLogout}
            style={{ height: "38px" }}
          >
            Déconnexion
          </button>
        </div>

        <div className="card-body">
          {activeTab === "create" && <CreateDeliveryForm />}
          {activeTab === "history" && <DeliveryHistory />}
        </div>
      </div>
    </div>
  );
}
