import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

function DeliveryHistory() {
  const [deliveries, setDeliveries] = useState([]);
  const [filteredDeliveries, setFilteredDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/client/deliveries/history`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setDeliveries(response.data);
        setFilteredDeliveries(response.data);
      } catch (err) {
        console.error("Erreur lors du chargement :", err);
        setError("Impossible de charger l'historique des livraisons.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  useEffect(() => {
    let filtered = deliveries;

    if (statusFilter) {
      filtered = filtered.filter((d) => d.status === statusFilter);
    }

    if (dateFilter) {
      filtered = filtered.filter(
        (d) => format(new Date(d.deliveryDate), "yyyy-MM-dd") === dateFilter
      );
    }

    setFilteredDeliveries(filtered);
  }, [statusFilter, dateFilter, deliveries]);

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

  return (
    <div className="container py-4">
      <h3 className="mb-4 text-center">📦 Historique de vos livraisons</h3>

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="row gy-3 align-items-end">
            <div className="col-md-4">
              <label className="form-label fw-semibold">
                📅 Date de livraison
              </label>
              <input
                type="date"
                className="form-control"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-semibold">
                📍 Statut de la livraison
              </label>
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Tous les statuts</option>
                <option value="EN_ATTENTE">En attente</option>
                <option value="RECUPERE">Récupéré</option>
                <option value="LIVRE">Livré</option>
              </select>
            </div>
            <div className="col-md-4">
              <button
                className="btn btn-outline-secondary w-100"
                onClick={() => {
                  setDateFilter("");
                  setStatusFilter("");
                }}
              >
                🔄 Réinitialiser les filtres
              </button>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" />
        </div>
      ) : error ? (
        <div className="alert alert-danger text-center">{error}</div>
      ) : filteredDeliveries.length === 0 ? (
        <div className="text-center text-muted">
          Aucune livraison ne correspond aux filtres.
        </div>
      ) : (
        <div className="card shadow-sm">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Société</th>
                    <th>Poids (kg)</th>
                    <th>Date Livraison</th>
                    <th>Prix</th>
                    <th>Statut</th>
                    <th>Créé le</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDeliveries.map((delivery) => {
                    const { text, color } = getStatusDisplay(delivery.status);
                    return (
                      <tr key={delivery.id}>
                        <td>{delivery.id}</td>
                        <td>{delivery.companyName || "Non assigné"}</td>
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

export default DeliveryHistory;
