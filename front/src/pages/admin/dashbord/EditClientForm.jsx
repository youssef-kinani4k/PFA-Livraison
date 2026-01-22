import React, { useState, useEffect } from "react";
import { Card, Form, Button, Alert, Spinner, Row, Col } from "react-bootstrap";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const API_BASE_URL = `${process.env.REACT_APP_API_URL}/api/admin1/clients`;
const token = localStorage.getItem("jwtToken");

const EditClientForm = ({ onClientUpdated }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchClientDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${API_BASE_URL}/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClient(response.data);
      } catch (err) {
        console.error("Error fetching client details:", err);
        setError("Failed to load client details for editing.");
      } finally {
        setLoading(false);
      }
    };
    fetchClientDetails();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClient((prevClient) => ({ ...prevClient, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await axios.put(`${API_BASE_URL}/${id}`, client, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess(true);
      if (onClientUpdated) {
        onClientUpdated();
      }
      navigate("/admin/dashboard/clients");
    } catch (err) {
      console.error("Error updating client:", err);
      setError(
        "Failed to update client: " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center my-3">
        <Spinner animation="border" />
        <p>Chargement des détails du client...</p>
      </div>
    );
  }

  if (error && !client.id) {
    return (
      <Alert variant="danger" className="mt-4">
        {error}
      </Alert>
    );
  }

  return (
    <Card className="mt-4">
      <Card.Header>
        Modifier Client: {client.firstName} {client.lastName}
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="firstName">
              <Form.Label>Prénom</Form.Label>
              <Form.Control
                type="text"
                name="firstName"
                value={client.firstName}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group as={Col} controlId="lastName">
              <Form.Label>Nom</Form.Label>
              <Form.Control
                type="text"
                name="lastName"
                value={client.lastName}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Row>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={client.email}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="phoneNumber">
            <Form.Label>Téléphone</Form.Label>
            <Form.Control
              type="text"
              name="phoneNumber"
              value={client.phoneNumber}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="address">
            <Form.Label>Adresse</Form.Label>
            <Form.Control
              type="text"
              name="address"
              value={client.address}
              onChange={handleChange}
            />
          </Form.Group>

          {error && <Alert variant="danger">{error}</Alert>}
          {success && (
            <Alert variant="success">Client mis à jour avec succès!</Alert>
          )}

          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? (
              <Spinner animation="border" size="sm" />
            ) : (
              "Mettre à jour Client"
            )}
          </Button>
          <Button
            variant="secondary"
            onClick={() => navigate("/admin/dashboard/clients")}
            className="ms-2"
          >
            Annuler
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default EditClientForm;
