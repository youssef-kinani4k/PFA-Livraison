import { useState, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { FaMapMarkerAlt, FaCheckCircle } from "react-icons/fa";

import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

const VILLES_LIVRAISON = [
  { id: 1, nom: "Casablanca", position: [33.5731, -7.5898] },
  { id: 2, nom: "Rabat", position: [34.0209, -6.8416] },
  { id: 3, nom: "Marrakech", position: [31.6295, -7.9811] },
  { id: 4, nom: "Fès", position: [34.0181, -5.0078] },
  { id: 5, nom: "Tanger", position: [35.7595, -5.834] },
  { id: 6, nom: "Agadir", position: [30.4278, -9.5981] },
  { id: 7, nom: "Meknès", position: [33.8833, -5.55] },
  { id: 8, nom: "Oujda", position: [34.6816, -1.9077] },
  { id: 9, nom: "Kénitra", position: [34.2541, -6.589] },
  { id: 10, nom: "Tétouan", position: [35.5716, -5.3624] },
  { id: 11, nom: "Safi", position: [32.2833, -9.2333] },
  { id: 12, nom: "El Jadida", position: [33.2333, -8.5] },
  { id: 13, nom: "Nador", position: [35.1667, -2.9333] },
  { id: 14, nom: "Beni Mellal", position: [32.3394, -6.3608] },
  { id: 15, nom: "Khouribga", position: [32.8833, -6.9167] },
  { id: 16, nom: "Taza", position: [34.2167, -4.0167] },
  { id: 17, nom: "Essaouira", position: [31.5131, -9.7697] },
  { id: 18, nom: "Larache", position: [35.1833, -6.15] },
  { id: 19, nom: "Khouribga", position: [32.8833, -6.9167] },
  { id: 20, nom: "Al Hoceïma", position: [35.2497, -3.9372] },
  { id: 21, nom: "Dakhla", position: [23.7136, -15.9408] },
  { id: 22, nom: "Laâyoune", position: [27.1536, -13.2033] },
  { id: 23, nom: "Berkane", position: [34.9167, -2.3167] },
  { id: 24, nom: "Taourirt", position: [34.4167, -2.9] },
  { id: 25, nom: "Settat", position: [33.0023, -7.6198] },
  { id: 26, nom: "Guelmim", position: [28.9833, -10.0667] },
  { id: 27, nom: "Errachidia", position: [31.9319, -4.4244] },
  { id: 28, nom: "Ouarzazate", position: [30.9333, -6.9167] },
  { id: 29, nom: "Ifrane", position: [33.5333, -5.1167] },
  { id: 30, nom: "Azrou", position: [33.4419, -5.2236] },
];

function MapClickHandler({ onCitySelect, selectedCities }) {
  useMapEvents({
    click: (e) => {
      const clickedPosition = [e.latlng.lat, e.latlng.lng];
      let closestCity = null;
      let minDistance = Infinity;

      VILLES_LIVRAISON.forEach((city) => {
        const distance = L.latLng(clickedPosition).distanceTo(
          L.latLng(city.position)
        );
        if (distance < minDistance && distance < 10000) {
          minDistance = distance;
          closestCity = city;
        }
      });

      if (closestCity) {
        onCitySelect(closestCity);
      }
    },
  });

  return null;
}

function VilleSelectionPage() {
  const [selectedCities, setSelectedCities] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCities = useMemo(() => {
    return VILLES_LIVRAISON.filter((city) =>
      city.nom.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handleCitySelect = (city) => {
    setSelectedCities((prev) => {
      const isAlreadySelected = prev.some((c) => c.id === city.id);
      if (isAlreadySelected) {
        return prev.filter((c) => c.id !== city.id);
      } else {
        return [...prev, city];
      }
    });
  };

  const centerPosition = useMemo(() => {
    if (selectedCities.length === 0) return [31.7917, -7.0926];
  }, [selectedCities]);

  return (
    <>
      <div className="container mt-4">
        <h3 className="mb-4">Sélectionnez les villes pour la livraison</h3>

        <div className="row">
          <div className="col-md-4">
            <div className="card mb-4">
              <div className="card-header bg-light">Villes disponibles</div>
              <div className="card-body">
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Rechercher une ville..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div
                  className="list-group"
                  style={{ maxHeight: "400px", overflowY: "auto" }}
                >
                  {filteredCities.map((city) => (
                    <button
                      key={city.id}
                      type="button"
                      className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${
                        selectedCities.some((c) => c.id === city.id)
                          ? "active"
                          : ""
                      }`}
                      onClick={() => handleCitySelect(city)}
                    >
                      {city.nom}
                      {selectedCities.some((c) => c.id === city.id) && (
                        <FaCheckCircle className="text-success" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {selectedCities.length > 0 && (
              <div className="card">
                <div className="card-header bg-light">Villes sélectionnées</div>
                <div className="card-body">
                  <ul className="list-group">
                    {selectedCities.map((city) => (
                      <li
                        key={city.id}
                        className="list-group-item d-flex justify-content-between align-items-center"
                      >
                        {city.nom}
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleCitySelect(city)}
                        >
                          Retirer
                        </button>
                      </li>
                    ))}
                  </ul>
                  <button
                    className="btn btn-primary mt-3 w-100"
                    disabled={selectedCities.length === 0}
                  >
                    Confirmer la sélection ({selectedCities.length})
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="col-md-8">
            <div className="card" style={{ height: "100%" }}>
              <div className="card-header bg-light">
                Carte des zones de livraison
              </div>
              <div className="card-body p-0" style={{ height: "600px" }}>
                <MapContainer
                  center={centerPosition}
                  zoom={selectedCities.length > 0 ? 6 : 5}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />

                  <MapClickHandler
                    onCitySelect={handleCitySelect}
                    selectedCities={selectedCities}
                  />

                  {VILLES_LIVRAISON.map((city) => (
                    <Marker
                      key={city.id}
                      position={city.position}
                      eventHandlers={{
                        click: () => handleCitySelect(city),
                      }}
                      icon={L.icon({
                        iconUrl: selectedCities.some((c) => c.id === city.id)
                          ? "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png"
                          : "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                        popupAnchor: [1, -34],
                      })}
                    >
                      <Popup>
                        <div className="text-center">
                          <FaMapMarkerAlt
                            className={
                              selectedCities.some((c) => c.id === city.id)
                                ? "text-success"
                                : "text-danger"
                            }
                            size={20}
                          />
                          <p className="mb-0">
                            <strong>{city.nom}</strong>
                          </p>
                          <p className="mb-0">
                            {selectedCities.some((c) => c.id === city.id)
                              ? "Sélectionnée"
                              : "Disponible"}
                          </p>
                          <button
                            className="btn btn-sm mt-1 w-100 btn-outline-primary"
                            onClick={() => handleCitySelect(city)}
                          >
                            {selectedCities.some((c) => c.id === city.id)
                              ? "Désélectionner"
                              : "Sélectionner"}
                          </button>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default VilleSelectionPage;
