import React, { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Card, Alert } from "react-bootstrap";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const Recenter = ({ latlng }) => {
  const map = useMap();
  useEffect(() => {
    if (latlng) {
      map.setView(latlng, 13);
    }
  }, [latlng]);
  return null;
};

const MapComponent = ({ routeEntries, currentStepIndex }) => {
  if (!routeEntries || routeEntries.length === 0) {
    return (
      <Alert variant="info" className="text-center">
        Sélectionnez un trajet pour voir la carte.
      </Alert>
    );
  }

  const allPoints = routeEntries.map((entry) => [
    parseFloat(entry.localisation[0]),
    parseFloat(entry.localisation[1]),
  ]);

  const singlePoint =
    currentStepIndex !== null ? allPoints[currentStepIndex] : allPoints[0];

  const center = singlePoint || [33.58, -7.6];

  return (
    <Card className="h-100">
      <Card.Body className="p-0">
        <MapContainer
          center={center}
          zoom={13}
          style={{ height: "400px", width: "100%", borderRadius: "0.25rem" }}
        >
          <Recenter latlng={center} />
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          {(currentStepIndex === null ? allPoints : [singlePoint]).map(
            (pos, index) => {
              const entry =
                currentStepIndex === null
                  ? routeEntries[index]
                  : routeEntries[currentStepIndex];
              return (
                <Marker key={index} position={pos}>
                  <Popup>
                    <strong>Type:</strong>{" "}
                    {entry.type === "recuperation"
                      ? "Récupération"
                      : "Livraison"}{" "}
                    <br />
                    <strong>ID Livraison:</strong> {entry.idLivraison} <br />
                    <strong>Taille:</strong> {entry.taille} kg
                  </Popup>
                </Marker>
              );
            }
          )}
          {currentStepIndex === null && (
            <Polyline positions={allPoints} color="blue" />
          )}
        </MapContainer>
      </Card.Body>
    </Card>
  );
};

export default MapComponent;
