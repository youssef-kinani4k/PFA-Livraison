import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

export default function LocationMap({
  onPickupChange,
  onDeliveryChange,
  defaultPickup,
  defaultDelivery,
}) {
  const [pickup, setPickup] = useState(defaultPickup || null);
  const [delivery, setDelivery] = useState(defaultDelivery || null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (defaultPickup) setPickup(defaultPickup);
    if (defaultDelivery) setDelivery(defaultDelivery);
  }, [defaultPickup, defaultDelivery]);

  const MapEvents = () => {
    useMapEvents({
      click(e) {
        if (!pickup) {
          setPickup(e.latlng);
          onPickupChange?.(e.latlng);
        } else if (!delivery) {
          setDelivery(e.latlng);
          onDeliveryChange?.(e.latlng);
        } else {
          setPickup(e.latlng);
          setDelivery(null);
          onPickupChange?.(e.latlng);
          onDeliveryChange?.(null);
        }
      },
    });
    return null;
  };

  return (
    <div
      className="map-container mb-3"
      style={{
        height: "350px",
        width: "100%",
        borderRadius: "8px",
        overflow: "hidden",
      }}
    >
      <MapContainer
        center={[33.5731, -7.5898]}
        zoom={13}
        whenCreated={(mapInstance) => (mapRef.current = mapInstance)}
        className="h-100"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapEvents />
        {pickup && <Marker position={pickup} />}
        {delivery && <Marker position={delivery} />}
      </MapContainer>

      <div className="text-muted mt-2">
        {!pickup && <p>🟢 Cliquez pour choisir le point de départ.</p>}
        {pickup && !delivery && (
          <p>📍 Cliquez maintenant pour choisir le point d’arrivée.</p>
        )}
        {pickup && delivery && (
          <p>🔄 Cliquez à nouveau pour recommencer une nouvelle sélection.</p>
        )}
        {pickup && (
          <p>
            <strong>Départ :</strong> {pickup.lat.toFixed(6)},{" "}
            {pickup.lng.toFixed(6)}
          </p>
        )}
        {delivery && (
          <p>
            <strong>Arrivée :</strong> {delivery.lat.toFixed(6)},{" "}
            {delivery.lng.toFixed(6)}
          </p>
        )}
      </div>
    </div>
  );
}
