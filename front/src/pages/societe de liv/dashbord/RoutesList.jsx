import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

function RoutesList() {
  const [routes, setRoutes] = useState([]);
  const [filterDate, setFilterDate] = useState(
    format(new Date(), "yyyy-MM-dd")
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoutes = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("jwtToken");
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/company/routes`,
          {
            headers: { Authorization: `Bearer ${token}` },
            params: { date: filterDate },
          }
        );
        setRoutes(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        setError("Erreur lors du chargement des trajets.");
      } finally {
        setLoading(false);
      }
    };

    fetchRoutes();
  }, [filterDate]);

  return (
    <div className="container">
      <h3 className="mb-4">📋 Liste des Trajets</h3>

      <div className="mb-3">
        <label className="form-label">Sélectionner une date :</label>
        <input
          type="date"
          className="form-control"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
        />
      </div>

      {loading ? (
        <p>Chargement...</p>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : (
        <ul className="list-group">
          {routes.map((route) => (
            <li
              key={route.driverId}
              className="list-group-item list-group-item-action"
              style={{ cursor: "pointer" }}
              onClick={() =>
                navigate(`/company/routes/${route.driverId}?date=${filterDate}`)
              }
            >
              <strong>{route.driverName}</strong>
              <br />
              {route.numberOfDeliveries} colis –{" "}
              {route.totalWeightKg?.toFixed(2)} kg
              <br />
              {format(new Date(route.routeDate), "dd MMMM yyyy", {
                locale: fr,
              })}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default RoutesList;
