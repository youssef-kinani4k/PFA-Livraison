import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const pickupIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const deliveryIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const depotIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function DeliveryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [delivery, setDelivery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [companyDepot, setCompanyDepot] = useState(null);
  const [driverId, setDriverId] = useState(null);
  const [routeStops, setRouteStops] = useState([]);

  useEffect(() => {
    const fetchDeliveryDetails = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("jwtToken");

        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/company/deliveries/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setDelivery(response.data);

        if (
          response.data.optimizedRoute &&
          typeof response.data.optimizedRoute === "object" &&
          Object.keys(response.data.optimizedRoute).length > 0
        ) {
          const firstDriver = Object.keys(response.data.optimizedRoute)[0];
          setDriverId(firstDriver);
          setRouteStops(response.data.optimizedRoute[firstDriver] || []);
        }

        const depotResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/company/depot`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCompanyDepot(depotResponse.data);
      } catch (err) {
        console.error("Error fetching delivery details:", err);
        setError("Échec du chargement des détails de la livraison.");
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveryDetails();
  }, [id]);

  const getStatusDisplay = (status) => {
    switch (status) {
      case "EN_ATTENTE":
        return { text: "En attente", color: "warning" };
      case "RECUPERE":
        return { text: "Récupéré", color: "info" };
      case "LIVRE":
        return { text: "Livré", color: "success" };
      case "ANNULE":
        return { text: "Annulé", color: "danger" };
      default:
        return { text: status, color: "secondary" };
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger text-center">{error}</div>;
  }

  if (!delivery) {
    return (
      <div className="alert alert-info text-center">Livraison introuvable.</div>
    );
  }

  const { text, color } = getStatusDisplay(delivery.status);

  const pickupLatlng =
    delivery.pickupLat && delivery.pickupLng
      ? [delivery.pickupLat, delivery.pickupLng]
      : null;

  const deliveryLatlng =
    delivery.deliveryLat && delivery.deliveryLng
      ? [delivery.deliveryLat, delivery.deliveryLng]
      : null;

  const routePath = [];

  if (companyDepot?.depotLatitude && companyDepot?.depotLongitude) {
    routePath.push([companyDepot.depotLatitude, companyDepot.depotLongitude]);
  }

  routeStops.forEach((stop) => {
    if (stop.localisation && stop.localisation.length === 2) {
      routePath.push([stop.localisation[0], stop.localisation[1]]);
    }
  });

  if (companyDepot?.depotLatitude && companyDepot?.depotLongitude) {
    routePath.push([companyDepot.depotLatitude, companyDepot.depotLongitude]);
  }

  const center = pickupLatlng || deliveryLatlng || [33.5731, -7.5898];

  return (
    <div className="container-fluid">
      <button
        className="btn btn-outline-secondary mb-3"
        onClick={() => navigate(-1)}
      >
        ← Retour aux Livraisons
      </button>

      <h3 className="mb-4">Détails de la Livraison #{delivery.id}</h3>

      <div className="card shadow-sm mb-4">
        <div className="card-header bg-primary text-white">
          Informations Générales
        </div>
        <div className="card-body">
          <p>
            <strong>Client Email:</strong> {delivery.clientEmail}
          </p>
          <p>
            <strong>Société de Livraison:</strong> {delivery.companyName}
          </p>
          <p>
            <strong>Poids du Colis:</strong> {delivery.packageWeight} kg
          </p>
          <p>
            <strong>Date de Livraison:</strong>{" "}
            {format(new Date(delivery.deliveryDate), "dd MMMM yyyy", {
              locale: fr,
            })}
          </p>
          <p>
            <strong>Prix de Livraison:</strong> {delivery.deliveryPrice} DH
          </p>
          <p>
            <strong>Statut:</strong>{" "}
            <span className={`badge bg-${color}`}>{text}</span>
          </p>
          <p>
            <strong>Créé le:</strong>{" "}
            {format(new Date(delivery.createdAt), "dd/MM/yyyy HH:mm", {
              locale: fr,
            })}
          </p>
        </div>
      </div>

      <div className="card shadow-sm mb-4">
        <div className="card-header bg-primary text-white">Localisations</div>
        <div className="card-body">
          <p>
            <strong>Lieu de Récupération:</strong> Lat{" "}
            {delivery.pickupLat?.toFixed(6)}, Lng{" "}
            {delivery.pickupLng?.toFixed(6)}
          </p>
          <p>
            <strong>Lieu de Livraison:</strong> Lat{" "}
            {delivery.deliveryLat?.toFixed(6)}, Lng{" "}
            {delivery.deliveryLng?.toFixed(6)}
          </p>
          <div style={{ height: "400px", width: "100%" }}>
            <MapContainer
              center={center}
              zoom={13}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {pickupLatlng && (
                <Marker position={pickupLatlng} icon={pickupIcon}>
                  <Popup>Lieu de Récupération</Popup>
                </Marker>
              )}
              {deliveryLatlng && (
                <Marker position={deliveryLatlng} icon={deliveryIcon}>
                  <Popup>Lieu de Livraison</Popup>
                </Marker>
              )}
              {companyDepot?.depotLatitude &&
                companyDepot?.depotLongitude && (
                  <Marker
                    position={[
                      companyDepot.depotLatitude,
                      companyDepot.depotLongitude,
                    ]}
                    icon={depotIcon}
                  >
                    <Popup>Dépôt de la Société</Popup>
                  </Marker>
                )}
              {routePath.length > 1 && (
                <Polyline positions={routePath} color="blue" weight={5} />
              )}
            </MapContainer>
          </div>
        </div>
      </div>

      {routeStops.length > 0 && (
        <div className="card shadow-sm mb-4">
          <div className="card-header bg-primary text-white">
            Trajet Optimisé (Livreur: {driverId})
          </div>
          <div className="card-body">
            <ul className="list-group">
              {routeStops.map((stop, index) => (
                <li key={index} className="list-group-item">
                  <strong>
                    {stop.type === "recuperation"
                      ? "Récupération"
                      : "Livraison"}
                  </strong>
                  {stop.idLivraison && ` (Livraison ID: ${stop.idLivraison})`}
                  <br />
                  Coordonnées: {stop.localisation[0]?.toFixed(6)},{" "}
                  {stop.localisation[1]?.toFixed(6)}
                  <br />
                  {stop.type === "recuperation"
                    ? `Poids à récupérer: ${stop.taille} kg`
                    : `Poids à livrer: ${Math.abs(stop.taille)} kg`}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default DeliveryDetail;
