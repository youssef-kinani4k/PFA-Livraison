import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./index.css";
import L from "leaflet";
import { FaBox, FaTruck } from "react-icons/fa";
import { useParams } from "react-router-dom";

import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";
import Header from "../components/headre";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

function DetailsLivraison({ getLivraisonById }) {
  const { id } = useParams();
  const livraison = getLivraisonById(id);

  const positionsColis = [
    { id: 1, nom: "Colis 1", position: [36.7525, 3.04197], statut: "En cours" },
    { id: 2, nom: "Colis 2", position: [36.7625, 3.05197], statut: "Livré" },
    { id: 3, nom: "Colis 3", position: [36.7425, 3.03197], statut: "En cours" },
  ];

  const positionLivreur = [36.7525, 3.04297];

  const trajets = positionsColis.map((colis) => ({
    positions: [positionLivreur, colis.position],
    colisId: colis.id,
  }));

  return (
    <>
      <Header />
      <div className="container mt-4">
        <h3 className="mb-4">Détails de la livraison #{livraison.id}</h3>

        <div className="card mb-4">
          <div className="card-header bg-light">
            Informations sur la livraison
          </div>
          <div className="card-body">
            <p>
              <strong>Livreur:</strong> {livraison.livreur}
            </p>
            <p>
              <strong>Nombre de colis:</strong> {livraison.nbrColis}
            </p>
            <p>
              <strong>Type de véhicule:</strong> {livraison.typeVoiture}
            </p>
            <p>
              <strong>Statut:</strong>{" "}
              <span
                className={`badge ${
                  livraison.statut === "En cours"
                    ? "bg-warning"
                    : livraison.statut === "Terminée"
                    ? "bg-success"
                    : "bg-secondary"
                }`}
              >
                {livraison.statut}
              </span>
            </p>
          </div>
        </div>

        <div className="card">
          <div className="card-header bg-light">
            Position des colis et trajets
          </div>
          <div className="card-body p-0" style={{ height: "500px" }}>
            <MapContainer
              center={positionLivreur}
              zoom={13}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />

              <Marker position={positionLivreur}>
                <Popup>
                  <div className="text-center">
                    <FaTruck className="text-primary" size={20} />
                    <p className="mb-0">
                      <strong>Livreur</strong>
                    </p>
                    <p className="mb-0">{livraison.livreur}</p>
                    <p className="mb-0">{livraison.typeVoiture}</p>
                  </div>
                </Popup>
              </Marker>

              {positionsColis.map((colis) => (
                <Marker
                  key={colis.id}
                  position={colis.position}
                  icon={L.icon({
                    iconUrl: "leaflet/dist/images/marker-icon.png",
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34],
                  })}
                >
                  <Popup>
                    <div className="text-center">
                      <FaBox className="text-warning" size={20} />
                      <p className="mb-0">
                        <strong>{colis.nom}</strong>
                      </p>
                      <p className="mb-0">Statut: {colis.statut}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}

              {trajets.map((trajet, index) => (
                <Polyline
                  key={index}
                  positions={trajet.positions}
                  color={
                    positionsColis.find((c) => c.id === trajet.colisId)
                      ?.statut === "Livré"
                      ? "green"
                      : "blue"
                  }
                  weight={3}
                />
              ))}
            </MapContainer>
          </div>
        </div>
      </div>
    </>
  );
}

export default DetailsLivraison;
