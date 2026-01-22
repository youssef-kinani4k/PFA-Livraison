import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
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

function DepotLocationPicker({ defaultPosition, onLocationChange, isSaving }) {
  const [position, setPosition] = useState(defaultPosition);
  const mapRef = useRef(null);

  useEffect(() => {
    if (defaultPosition) {
      setPosition(defaultPosition);
      if (mapRef.current) {
        mapRef.current.setView(defaultPosition, mapRef.current.getZoom());
      }
    }
  }, [defaultPosition]);

  const MapEvents = () => {
    useMapEvents({
      click(e) {
        setPosition(e.latlng);
        onLocationChange(e.latlng);
      },
    });
    return null;
  };

  return (
    <div
      className="map-container mb-3"
      style={{
        height: "400px",
        width: "100%",
        borderRadius: "8px",
        overflow: "hidden",
        filter: isSaving ? "grayscale(100%)" : "none",
        transition: "filter 0.3s ease-in-out",
      }}
    >
      <MapContainer
        center={position || [33.5731, -7.5898]}
        zoom={13}
        whenCreated={(mapInstance) => {
          mapRef.current = mapInstance;
        }}
        className="h-100"
        style={{ zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapEvents />
        {position && <Marker position={position} icon={depotIcon} />}
      </MapContainer>
      {position && (
        <p className="mt-2 text-muted">
          Nouvelles coordonnées: {position.lat?.toFixed(6)},{" "}
          {position.lng?.toFixed(6)}
        </p>
      )}
    </div>
  );
}

function CompanyDepotDetails() {
  const [companyName, setCompanyName] = useState("");
  const [depotLocation, setDepotLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchDepotDetails = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("jwtToken");
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/company/depot`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCompanyName(response.data.companyName);
        if (response.data.depotLatitude && response.data.depotLongitude) {
          setDepotLocation({
            lat: response.data.depotLatitude,
            lng: response.data.depotLongitude,
          });
        }
      } catch (err) {
        console.error("Error fetching depot details:", err);
        setError("Failed to load depot details.");
      } finally {
        setLoading(false);
      }
    };
    fetchDepotDetails();
  }, []);

  const handleLocationChange = (newLatlng) => {
    setDepotLocation(newLatlng);
    setSuccess("");
  };

  const handleSaveDepot = async () => {
    if (!depotLocation) {
      setError("Veuillez sélectionner un emplacement de dépôt sur la carte.");
      return;
    }
    setIsSaving(true);
    setError("");
    setSuccess("");
    try {
      const token = localStorage.getItem("jwtToken");
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/company/depot`,
        {
          newDepotLat: depotLocation.lat,
          newDepotLng: depotLocation.lng,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSuccess("Emplacement du dépôt mis à jour avec succès !");
    } catch (err) {
      console.error("Error updating depot location:", err);
      setError(
        err.response?.data?.message ||
          "Échec de la mise à jour de l'emplacement du dépôt."
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error && !depotLocation) {
    return <div className="alert alert-danger text-center">{error}</div>;
  }

  return (
    <div className="container-fluid">
      <h3 className="mb-4">📍 Détails du Dépôt de {companyName}</h3>

      <div className="card shadow-sm mb-4">
        <div className="card-header bg-primary text-white">
          Modifier l'emplacement du dépôt
        </div>
        <div className="card-body">
          {error && <div className="alert alert-danger mb-3">{error}</div>}
          {success && <div className="alert alert-success mb-3">{success}</div>}

          <p className="text-muted">
            Cliquez sur la carte pour sélectionner le nouvel emplacement du
            dépôt.
          </p>
          <DepotLocationPicker
            defaultPosition={depotLocation}
            onLocationChange={handleLocationChange}
            isSaving={isSaving}
          />
          <button
            className="btn btn-primary w-100"
            onClick={handleSaveDepot}
            disabled={isSaving || !depotLocation}
          >
            {isSaving ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Enregistrement...
              </>
            ) : (
              "Enregistrer le Nouvel Emplacement"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CompanyDepotDetails;
