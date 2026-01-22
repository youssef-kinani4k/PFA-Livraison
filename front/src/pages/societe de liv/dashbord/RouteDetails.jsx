import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useSearchParams, Link } from "react-router-dom";
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

const createIcon = (colorUrl) =>
  new L.Icon({
    iconUrl: colorUrl,
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

const depotIcon = createIcon(
  "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png"
);
const pickupIcon = createIcon(
  "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png"
);
const deliveryIcon = createIcon(
  "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png"
);

function RouteDetails() {
  const { driverId } = useParams();
  const [searchParams] = useSearchParams();
  const [route, setRoute] = useState(null);
  const [depot, setDepot] = useState(null);
  const [loading, setLoading] = useState(true);

  const date = searchParams.get("date");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const token = localStorage.getItem("jwtToken");
      try {
        const [depotRes, routesRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_URL}/api/company/depot`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${process.env.REACT_APP_API_URL}/api/company/routes`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { date },
          }),
        ]);
        setDepot(depotRes.data);

        const found = routesRes.data.find(
          (r) => r.driverId.toString() === driverId
        );
        setRoute(found || null);
      } catch (err) {
        console.error("Erreur de chargement:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [driverId, date]);

  if (loading) return <p>Chargement...</p>;
  if (!route || !depot) return <p>Aucun trajet trouvé.</p>;

  const path = [];
  const markers = [];

  const depotCoords = [depot.depotLatitude, depot.depotLongitude];
  path.push(depotCoords);
  markers.push({ position: depotCoords, icon: depotIcon, popup: "Dépôt" });

  const stops = Object.values(route.routeStops || {})[0] || [];

  stops.forEach((stop, index) => {
    const coords = [stop.localisation[0], stop.localisation[1]];
    path.push(coords);
    markers.push({
      position: coords,
      icon: stop.type === "recuperation" ? pickupIcon : deliveryIcon,
      popup: `Étape ${index + 1} : ${
        stop.type === "recuperation" ? "Récupération" : "Livraison"
      }\nID: ${stop.id_livraison || stop.idLivraison || "inconnu"}\nType: ${
        stop.type
      }`,
    });
  });

  path.push(depotCoords);

  return (
    <div className="container">
      <Link to="/company/routes" className="btn btn-secondary mb-3">
        ← Retour à la liste
      </Link>
      <h3>🗺️ Trajet de {route.driverName}</h3>
      <p>Colis : {route.numberOfDeliveries}</p>
      <p>Poids total : {route.totalWeightKg.toFixed(2)} kg</p>
      <div style={{ height: "450px", width: "100%" }}>
        <MapContainer
          center={depotCoords}
          zoom={13}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {markers.map((m, i) => (
            <Marker key={i} position={m.position} icon={m.icon}>
              <Popup>
                {m.popup.split("\n").map((line, idx) => (
                  <div key={idx}>{line}</div>
                ))}
              </Popup>
            </Marker>
          ))}
          <Polyline positions={path} color="blue" />
        </MapContainer>
      </div>
    </div>
  );
}

export default RouteDetails;
