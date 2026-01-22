
import React, { useState, useEffect, useMemo } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Spinner,
  Alert,
  Form,
} from "react-bootstrap";
import axios from "axios";
import { FaEdit, FaBan, FaCheckCircle, FaPlusCircle } from "react-icons/fa";
import { Link, Routes, Route, Outlet } from "react-router-dom";


const API_BASE_URL = `${process.env.REACT_APP_API_URL}/api/admin1/companies`;
const token = localStorage.getItem("jwtToken");


const AddCompanyForm = ({ onCompanyAdded }) => (
  <Alert variant="info" className="mt-3">
    <h4>Ajouter une Nouvelle Compagnie</h4>
    <p>
      Le formulaire d'ajout de compagnie sera implémenté ici. Il devra envoyer
      une requête POST à votre backend. Une fois la compagnie ajoutée avec
      succès, appelez `onCompanyAdded()` pour rafraîchir la liste.
    </p>
    <Button variant="secondary" as={Link} to="../">
      Retour à la liste
    </Button>
  </Alert>
);

const EditCompanyForm = ({ onCompanyUpdated }) => {
  return (
    <Alert variant="info" className="mt-3">
      <h4>Modifier les Informations de la Compagnie</h4>
      <p>
        Le formulaire de modification de compagnie sera implémenté ici. Il devra
        envoyer une requête PUT à votre backend pour la compagnie avec l'ID
        spécifié. Une fois les modifications sauvegardées, appelez
        `onCompanyUpdated()` pour rafraîchir la liste.
      </p>
      <Button variant="secondary" as={Link} to="../">
        Retour à la liste
      </Button>
    </Alert>
  );
};

const CompanyManagement = () => {
  const [allCompanies, setAllCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterBlocked, setFilterBlocked] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchCompanies = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(API_BASE_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllCompanies(response.data);
    } catch (err) {
      console.error("Error fetching companies:", err);
      setError(
        "Échec du chargement des données des compagnies. " +
          (err.response?.data?.message ||
            err.message ||
            "Veuillez vérifier votre connexion et le serveur.")
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleToggleBlocking = async (companyId, currentBlockedStatus) => {
    setLoading(true);
    setError(null);
    try {
      const endpoint = currentBlockedStatus
        ? `${API_BASE_URL}/unblock/${companyId}`
        : `${API_BASE_URL}/block/${companyId}`;

      await axios.put(
        endpoint,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAllCompanies((prevCompanies) =>
        prevCompanies.map((company) =>
          company.id === companyId
            ? { ...company, blocked: !currentBlockedStatus }
            : company
        )
      );
    } catch (err) {
      console.error("Error toggling blocking status:", err);
      setError(
        "Échec de la mise à jour du statut de blocage : " +
          (err.response?.data?.message ||
            err.message ||
            "Erreur de connexion au serveur.")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleToggleApproval = async (companyId, currentApprovedStatus) => {
    setLoading(true);
    setError(null);
    try {
      const endpoint = currentApprovedStatus
        ? `${API_BASE_URL}/reject/${companyId}`
        : `${API_BASE_URL}/approve/${companyId}`;

      await axios.put(
        endpoint,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAllCompanies((prevCompanies) =>
        prevCompanies.map((company) =>
          company.id === companyId
            ? {
                ...company,
                approved: !currentApprovedStatus,
                blocked: currentApprovedStatus ? true : false,
              }
            : company
        )
      );
    } catch (err) {
      console.error("Error toggling approval status:", err);
      setError(
        "Échec de la mise à jour du statut d'approbation : " +
          (err.response?.data?.message ||
            err.message ||
            "Erreur de connexion au serveur.")
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSearchedCompanies = useMemo(() => {
    let currentCompanies = allCompanies;

    if (filterBlocked === "blocked") {
      currentCompanies = currentCompanies.filter(
        (company) => company.blocked === true
      );
    } else if (filterBlocked === "active") {
      currentCompanies = currentCompanies.filter(
        (company) => company.blocked === false
      );
    }

    return currentCompanies.filter(
      (company) =>
        (company.companyName &&
          company.companyName
            .toLowerCase()
            .includes(searchTerm.toLowerCase())) ||
        (company.email &&
          company.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [allCompanies, filterBlocked, searchTerm]);

  return (
    <Container className="my-4">
      <h2>Gestion des Compagnies de Livraison</h2>
      <Card className="mb-4">
        <Card.Body>
          <Row className="align-items-center">
            <Col md={4}>
              <Form.Group className="mb-3 mb-md-0">
                <Form.Label>Filtrer par statut :</Form.Label>
                <Form.Select
                  value={filterBlocked}
                  onChange={(e) => setFilterBlocked(e.target.value)}
                >
                  <option value="all">Toutes</option>
                  <option value="active">Actives</option>
                  <option value="blocked">Bloquées</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3 mb-md-0">
                <Form.Label>Rechercher une compagnie :</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Rechercher par nom ou email"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={4} className="text-end">
              <Button as={Link} to="add" variant="success" className="mt-3">
                <FaPlusCircle className="me-2" /> Ajouter une Compagnie
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {loading && (
        <div className="text-center my-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Chargement...</span>
          </Spinner>
          <p className="mt-2">Chargement des compagnies...</p>
        </div>
      )}

      {error && (
        <Alert variant="danger" className="my-3">
          {error}
        </Alert>
      )}

      {!loading && !error && (
        <Routes>
          <Route
            index
            element={
              <Card>
                <Card.Header>Liste des Compagnies de Livraison</Card.Header>
                <Card.Body>
                  {filteredAndSearchedCompanies.length > 0 ? (
                    <Table
                      striped
                      bordered
                      hover
                      responsive
                      className="text-center align-middle"
                    >
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Nom de la Compagnie</th>
                          <th>Email</th>
                          <th>Téléphone</th>
                          <th>N° Brevet</th>
                          <th>Approbation</th>
                          <th>Statut</th>
                          <th>Prix Base (MAD)</th>
                          <th>Prix/Kg (MAD)</th>
                          <th>Localisation Dépôt</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredAndSearchedCompanies.map((company, index) => (
                          <tr key={company.id}>
                            <td>{index + 1}</td>
                            <td>{company.companyName || "N/A"}</td>
                            <td>{company.email || "N/A"}</td>
                            <td>{company.phone || "N/A"}</td>
                            <td>{company.patentNumber || "N/A"}</td>
                            <td>
                              <Button
                                variant={
                                  company.approved
                                    ? "outline-danger"
                                    : "outline-success"
                                }
                                size="sm"
                                onClick={() =>
                                  handleToggleApproval(
                                    company.id,
                                    company.approved
                                  )
                                }
                                className="me-2"
                                title={
                                  company.approved
                                    ? "Rejeter cette compagnie"
                                    : "Approuver cette compagnie"
                                }
                              >
                                {company.approved ? (
                                  <>
                                    <FaBan className="me-1" /> Rejeter
                                  </>
                                ) : (
                                  <>
                                    <FaCheckCircle className="me-1" /> Approuver
                                  </>
                                )}
                              </Button>
                            </td>
                            <td>
                              {company.blocked ? (
                                <span className="badge bg-danger">Bloquée</span>
                              ) : (
                                <span className="badge bg-success">Active</span>
                              )}
                            </td>
                            <td>
                              {company.prixDeBase !== undefined &&
                              company.prixDeBase !== null
                                ? company.prixDeBase.toFixed(2)
                                : "N/A"}
                            </td>
                            <td>
                              {company.prixParKilogramme !== undefined &&
                              company.prixParKilogramme !== null
                                ? company.prixParKilogramme.toFixed(2)
                                : "N/A"}
                            </td>
                            <td>
                              (
                              {company.depotLatitude !== undefined &&
                              company.depotLatitude !== null
                                ? company.depotLatitude.toFixed(2)
                                : "N/A"}
                              ,{" "}
                              {company.depotLongitude !== undefined &&
                              company.depotLongitude !== null
                                ? company.depotLongitude.toFixed(2)
                                : "N/A"}
                              )
                            </td>
                            <td>
                              <Button
                                variant="warning"
                                size="sm"
                                className="me-2"
                                as={Link}
                                to={`edit/${company.id}`}
                                title="Modifier les informations de la compagnie"
                              >
                                <FaEdit /> Modifier
                              </Button>
                              <Button
                                variant={company.blocked ? "success" : "danger"}
                                size="sm"
                                onClick={() =>
                                  handleToggleBlocking(
                                    company.id,
                                    company.blocked
                                  )
                                }
                                title={
                                  company.blocked
                                    ? "Débloquer cette compagnie"
                                    : "Bloquer cette compagnie"
                                }
                              >
                                {company.blocked ? (
                                  <>
                                    <FaCheckCircle className="me-1" /> Débloquer
                                  </>
                                ) : (
                                  <>
                                    <FaBan className="me-1" /> Bloquer
                                  </>
                                )}
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  ) : (
                    <Alert variant="info" className="text-center">
                      Aucune compagnie trouvée avec les filtres actuels.
                    </Alert>
                  )}
                </Card.Body>
              </Card>
            }
          />
          <Route
            path="add"
            element={<AddCompanyForm onCompanyAdded={fetchCompanies} />}
          />
          <Route
            path="edit/:id"
            element={<EditCompanyForm onCompanyUpdated={fetchCompanies} />}
          />
        </Routes>
      )}
    </Container>
  );
};

export default CompanyManagement;
