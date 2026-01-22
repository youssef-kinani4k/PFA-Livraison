import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useNavigate } from "react-router-dom";

function CompanyDeliveries() {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterDate, setFilterDate] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDeliveries = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("jwtToken");
        const config = {
          headers: { Authorization: `Bearer ${token}` },
          params: {},
        };

        if (filterDate) {
          config.params.date = filterDate;
        }

        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/company/deliveries`,
          config
        );
        setDeliveries(response.data);
      } catch (err) {
        console.error("Error fetching company deliveries:", err);
        setError("Failed to load deliveries.");
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveries();
  }, [filterDate]);

  const getStatusDisplay = (status) => {
    switch (status) {
      case "EN_ATTENTE":
        return { text: "En attente", color: "warning" };
      case "RECUPERE":
        return { text: "Récupéré", color: "info" };
      case "LIVRE":
        return { text: "Livré", color: "success" };
      default:
        return { text: status, color: "secondary" };
    }
  };

  const handleDetailClick = (deliveryId) => {
    navigate(`/company/deliveries/${deliveryId}`);
  };

  return (
    <div className="container-fluid">
      <h3 className="mb-4">📋 Vos Livraisons</h3>

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="row align-items-end">
            <div className="col-md-6">
              <label htmlFor="filterDate" className="form-label fw-semibold">
                Filtrer par Date de Livraison:
              </label>
              <input
                type="date"
                id="filterDate"
                className="form-control"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
              />
            </div>
            <div className="col-md-6 text-end">
              <button
                className="btn btn-outline-secondary"
                onClick={() => setFilterDate("")}
              >
                Reset Date Filter
              </button>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : error ? (
        <div className="alert alert-danger text-center">{error}</div>
      ) : deliveries.length === 0 ? (
        <div className="alert alert-info text-center">
          Aucune livraison trouvée pour la date sélectionnée ou pas de
          livraisons enregistrées.
        </div>
      ) : (
        <div className="card shadow-sm">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>ID Livraison</th>
                    <th>Client Email</th>
                    <th>Poids (kg)</th>
                    <th>Date Livraison</th>
                    <th>Prix</th>
                    <th>Statut</th>
                    <th>Créé le</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {deliveries.map((delivery) => {
                    const { text, color } = getStatusDisplay(delivery.status);
                    return (
                      <tr key={delivery.id}>
                        <td>{delivery.id}</td>
                        <td>{delivery.clientEmail}</td>
                        <td>{delivery.packageWeight} kg</td>
                        <td>
                          {format(
                            new Date(delivery.deliveryDate),
                            "dd MMMM yyyy",
                            { locale: fr }
                          )}
                        </td>
                        <td>{delivery.deliveryPrice} DH</td>
                        <td>
                          <span className={`badge bg-${color}`}>{text}</span>
                        </td>
                        <td>
                          {format(
                            new Date(delivery.createdAt),
                            "dd/MM/yyyy HH:mm",
                            { locale: fr }
                          )}
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleDetailClick(delivery.id)}
                          >
                            Détails
                          </button>
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
    </div>
  );
}

export default CompanyDeliveries;
