import React, { useState, useEffect, useRef, useMemo } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { DayPicker } from "react-day-picker";
import LocationRouteMap from "./LocationRouteMap";
import { format, isBefore, addDays } from "date-fns";
import { fr } from "date-fns/locale";
import "react-day-picker/dist/style.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

function LocationPickerMap({ onLocationChange, defaultPosition, label }) {
  const [position, setPosition] = useState(defaultPosition || null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current && defaultPosition) {
      mapRef.current.setView(defaultPosition, mapRef.current.getZoom());
    }
    setPosition(defaultPosition);
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
        height: "300px",
        width: "100%",
        borderRadius: "8px",
        overflow: "hidden",
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
        {position && <Marker position={position} />}
      </MapContainer>
      {position && (
        <p className="mt-2 text-muted">
          {label}: {position.lat.toFixed(6)}, {position.lng.toFixed(6)}
        </p>
      )}
    </div>
  );
}

function CreateDeliveryForm() {
  const [packageWeight, setPackageWeight] = useState("");
  const [pickupLocation, setPickupLocation] = useState(null);
  const [deliveryLocation, setDeliveryLocation] = useState(null);
  const [deliveryDate, setDeliveryDate] = useState(null);
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [companies, setCompanies] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sortOrder, setSortOrder] = useState("asc"); 

  const tomorrow = addDays(new Date(), 1);

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoadingCompanies(true);
      setError("");
      try {
        const token = localStorage.getItem("jwtToken");
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/client/delivery-companies-pricing`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCompanies(response.data);
      } catch (err) {
        console.error(
          "Erreur lors du chargement des sociétés de livraison:",
          err
        );
        setError("Impossible de charger les sociétés de livraison.");
      } finally {
        setLoadingCompanies(false);
      }
    };
    fetchCompanies();
  }, []);

  const sortedAndPricedCompanies = useMemo(() => {
    if (!packageWeight || parseFloat(packageWeight) <= 0) {
      return [];
    }

    const weight = parseFloat(packageWeight);

    const priced = companies.map((company) => {
      const basePrice = parseFloat(company.prixDeBase);
      const pricePerKg = parseFloat(company.prixParKilogramme);
      const calculatedPrice = (
        (isNaN(basePrice) ? 0 : basePrice) +
        (isNaN(pricePerKg) ? 0 : pricePerKg) * weight
      ).toFixed(2);
      return { ...company, calculatedPrice: parseFloat(calculatedPrice) };
    });

    return priced.sort((a, b) => {
      if (sortOrder === "asc") {
        return a.calculatedPrice - b.calculatedPrice;
      } else {
        return b.calculatedPrice - a.calculatedPrice;
      }
    });
  }, [companies, packageWeight, sortOrder]);

  const handleCompanySelect = (companyId) => {
    setSelectedCompanyId(companyId);
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    if (
      !packageWeight ||
      parseFloat(packageWeight) <= 0 ||
      !pickupLocation ||
      !deliveryLocation ||
      !deliveryDate ||
      !selectedCompanyId
    ) {
      setError("Veuillez remplir tous les champs obligatoires et valides.");
      setIsSubmitting(false);
      return;
    }
    if (isBefore(deliveryDate, tomorrow)) {
      setError("La date de livraison doit être au moins à partir de demain.");
      setIsSubmitting(false);
      return;
    }

    try {
      const token = localStorage.getItem("jwtToken");
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/client/deliveries`,
        {
          packageWeight: parseFloat(packageWeight),
          pickupLat: pickupLocation.lat,
          pickupLng: pickupLocation.lng,
          deliveryLat: deliveryLocation.lat,
          deliveryLng: deliveryLocation.lng,
          deliveryDate: format(deliveryDate, "yyyy-MM-dd"),
          companyId: parseInt(selectedCompanyId),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess("Demande de livraison créée avec succès !");
      setPackageWeight("");
      setPickupLocation(null);
      setDeliveryLocation(null);
      setDeliveryDate(null);
      setSelectedCompanyId("");
    } catch (err) {
      console.error(
        "Erreur lors de la création de la livraison:",
        err.response ? err.response.data : err.message
      );
      setError(
        err.response?.data?.message ||
          "Échec de la création de la livraison. Veuillez réessayer."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-delivery-form">
      <h3 className="mb-4 text-center">Créer une Nouvelle Livraison</h3>
      <form onSubmit={handleSubmit}>
        {error && <div className="alert alert-danger mb-3">{error}</div>}

        <div className="d-flex flex-column gap-4">
          <div className="d-flex flex-wrap gap-4 justify-content-around">
            <div
              className="flex-grow-1"
              style={{ minWidth: "300px", maxWidth: "600px" }}
            >
              <div className="mb-3">
                <label htmlFor="packageWeight" className="form-label">
                  Poids du colis (kg)
                </label>
                <div className="input-group">
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    id="packageWeight"
                    value={packageWeight}
                    onChange={(e) => setPackageWeight(e.target.value)}
                    placeholder="Ex: 2.5"
                    required
                  />
                  <span className="input-group-text">kg</span>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="mb-3">Choisir la Société de Livraison</h4>
                {loadingCompanies ? (
                  <p>Chargement des sociétés...</p>
                ) : companies.length === 0 ? (
                  <p className="alert alert-warning text-center">
                    Aucune société de livraison approuvée disponible.
                  </p>
                ) : (
                  <>
                    <div className="mb-3">
                      <label className="form-label me-3 fw-bold">
                        Trier par prix :
                      </label>
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="sortOrder"
                          id="sortAsc"
                          value="asc"
                          checked={sortOrder === "asc"}
                          onChange={handleSortChange}
                        />
                        <label className="form-check-label" htmlFor="sortAsc">
                          Croissant
                        </label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="sortOrder"
                          id="sortDesc"
                          value="desc"
                          checked={sortOrder === "desc"}
                          onChange={handleSortChange}
                        />
                        <label className="form-check-label" htmlFor="sortDesc">
                          Décroissant
                        </label>
                      </div>
                    </div>

                    {parseFloat(packageWeight) <= 0 || !packageWeight ? (
                      <p className="alert alert-info text-center">
                        Veuillez entrer le <strong>poids du colis</strong> pour
                        voir les prix estimés des sociétés de livraison.
                      </p>
                    ) : (
                      <div className="d-flex flex-wrap gap-3">
                        {sortedAndPricedCompanies.map((company) => (
                          <div
                            className={`card company-card shadow-sm p-3 ${
                              selectedCompanyId === String(company.id)
                                ? "border-primary border-2"
                                : "border-light"
                            }`}
                            key={company.id}
                            onClick={() =>
                              handleCompanySelect(String(company.id))
                            }
                            style={{
                              cursor: "pointer",
                              minWidth: "240px",
                              transition: "0.3s",
                            }}
                          >
                            <div className="card-body">
                              <h5 className="card-title text-primary">
                                {company.companyName}
                              </h5>
                              <h6 className="card-subtitle mt-2 text-success">
                                Prix total estimé:{" "}
                                <strong className="fs-5">
                                  {company.calculatedPrice} DH
                                </strong>
                              </h6>
                              {selectedCompanyId === String(company.id) && (
                                <span className="badge bg-primary mt-3">
                                  Sélectionné
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="flex-shrink-0" style={{ minWidth: "280px" }}>
              <div className="p-3 bg-light rounded border">
                <label className="form-label fw-bold">Date de Livraison</label>
                <DayPicker
                  mode="single"
                  selected={deliveryDate}
                  onSelect={setDeliveryDate}
                  locale={fr}
                  disabled={(date) => isBefore(date, tomorrow)}
                  className="rounded p-2 bg-white"
                />
                {deliveryDate && (
                  <p className="mt-2 text-muted">
                    Date sélectionnée:{" "}
                    {format(deliveryDate, "dd MMMM yyyy", { locale: fr })}
                  </p>
                )}
              </div>
            </div>
          </div>

          <LocationRouteMap
            onPickupChange={setPickupLocation}
            onDeliveryChange={setDeliveryLocation}
            defaultPickup={pickupLocation}
            defaultDelivery={deliveryLocation}
          />
        </div>

        <button
          type="submit"
          className="btn btn-success w-100 mt-4 btn-lg"
          disabled={
            isSubmitting ||
            !selectedCompanyId ||
            parseFloat(packageWeight) <= 0 ||
            !pickupLocation ||
            !deliveryLocation ||
            !deliveryDate
          }
        >
          {isSubmitting ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
              Envoi...
            </>
          ) : (
            "Envoyer la Demande"
          )}
        </button>
      </form>
      <br />
      {success && <div className="alert alert-success mb-3">{success}</div>}
    </div>
  );
}

export default CreateDeliveryForm;
