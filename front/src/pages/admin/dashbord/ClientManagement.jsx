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
import {
  FaUserEdit,
  FaBan,
  FaCheckCircle,
  FaSearch,
  FaPlusCircle,
} from "react-icons/fa";
import { Link, Routes, Route, Outlet } from "react-router-dom";

import AddClientForm from "./AddClientForm";
import EditClientForm from "./EditClientForm";

const API_BASE_URL = `${process.env.REACT_APP_API_URL}/api/admin1/clients`;
const token = localStorage.getItem("jwtToken");

const ClientManagement = () => {
  const [allClients, setAllClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterBlocked, setFilterBlocked] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchAllClients = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(API_BASE_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAllClients(response.data);
      } catch (err) {
        console.error("Error fetching clients:", err);
        setError("Failed to load client data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllClients();
  }, []);

  const refreshClients = () => {
    const fetchAllClients = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(API_BASE_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAllClients(response.data);
      } catch (err) {
        console.error("Error refreshing clients:", err);
        setError("Failed to refresh client data.");
      } finally {
        setLoading(false);
      }
    };
    fetchAllClients();
  };

  const handleToggleBlocking = async (clientId, currentStatus) => {
    setLoading(true);
    setError(null);
    try {
      await axios.put(
        `${API_BASE_URL}/block/${clientId}?block=${!currentStatus}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAllClients((prevClients) =>
        prevClients.map((client) =>
          client.id === clientId
            ? { ...client, blocked: !currentStatus }
            : client
        )
      );
    } catch (err) {
      console.error("Error toggling blocking status:", err);
      setError("Failed to update client blocking status.");
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSearchedClients = useMemo(() => {
    let currentClients = allClients;

    if (filterBlocked === "blocked") {
      currentClients = currentClients.filter((client) => client.blocked);
    } else if (filterBlocked === "active") {
      currentClients = currentClients.filter((client) => !client.blocked);
    }

    return currentClients.filter(
      (client) =>
        client.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allClients, filterBlocked, searchTerm]);

  return (
    <div>
      <h2>Gestion des Clients</h2>
      <Card className="mb-4">
        <Card.Body>
          <Row className="align-items-center">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Filtrer par statut :</Form.Label>
                <Form.Select
                  value={filterBlocked}
                  onChange={(e) => setFilterBlocked(e.target.value)}
                >
                  <option value="all">Tous</option>
                  <option value="active">Actifs</option>
                  <option value="blocked">Bloqués</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Rechercher un client :</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Rechercher par nom, prénom ou email"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={4} className="text-end">
              <Button as={Link} to="add" variant="success" className="mt-3">
                <FaPlusCircle className="me-2" /> Ajouter un Client
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      {loading && (
        <div className="text-center my-3">
          <Spinner animation="border" />
          <p>Chargement des clients...</p>
        </div>
      )}
      {error && <Alert variant="danger">{error}</Alert>}
      {!loading && !error && (
        <Routes>
          <Route
            index 
            element={
              <Card>
                <Card.Header>Liste des Clients</Card.Header>
                <Card.Body>
                  {filteredAndSearchedClients.length > 0 ? (
                    <Table striped bordered hover responsive>
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Nom</th>
                          <th>Prénom</th>
                          <th>Email</th>
                          <th>Téléphone</th>
                          <th>Statut</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredAndSearchedClients.map((client, index) => (
                          <tr key={client.id}>
                            <td>{index + 1}</td>
                            <td>{client.lastName}</td>
                            <td>{client.firstName}</td>
                            <td>{client.email}</td>
                            <td>{client.phoneNumber}</td>
                            <td>
                              {client.blocked ? (
                                <span className="badge bg-danger">Bloqué</span>
                              ) : (
                                <span className="badge bg-success">Actif</span>
                              )}
                            </td>
                            <td>
                              <Button
                                variant="warning"
                                size="sm"
                                className="me-2"
                                as={Link}
                                to={`edit/${client.id}`}
                              >
                                <FaUserEdit /> Modifier
                              </Button>
                              <Button
                                variant={client.blocked ? "success" : "danger"}
                                size="sm"
                                onClick={() =>
                                  handleToggleBlocking(
                                    client.id,
                                    client.blocked
                                  )
                                }
                              >
                                {client.blocked ? (
                                  <>
                                    <FaCheckCircle /> Débloquer
                                  </>
                                ) : (
                                  <>
                                    <FaBan /> Bloquer
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
                      Aucun client trouvé avec les filtres actuels.
                    </Alert>
                  )}
                </Card.Body>
              </Card>
            }
          />
          <Route
            path="add"
            element={<AddClientForm onClientAdded={refreshClients} />}
          />
          <Route
            path="edit/:id"
            element={<EditClientForm onClientUpdated={refreshClients} />}
          />
        </Routes>
      )}
    </div>
  );
};

export default ClientManagement;
