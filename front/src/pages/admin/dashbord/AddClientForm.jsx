import React, { useState } from "react";
import { Card, Form, Button, Alert, Spinner } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";



const API_BASE_URL = `${process.env.REACT_APP_API_URL}/admin1/clients`;
const token = localStorage.getItem("jwtToken");

const AddClientForm = ({ onClientAdded }) => {
  const [client, setClient] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

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
      await axios.post(`${API_BASE_URL}/register`, client, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess(true);
      setClient({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phoneNumber: "",
        address: "",
      });
      if (onClientAdded) {
        onClientAdded();
      }
      navigate("/admin/dashboard/clients");
    } catch (err) {
      console.error("Error adding client:", err);
      setError(
        "Failed to add client: " + (err.response?.data?.message || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mt-4">
      <Card.Header>Ajouter un nouveau Client</Card.Header>
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
          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Mot de passe (temporaire)</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={client.password}
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
            <Alert variant="success">Client ajouté avec succès!</Alert>
          )}

          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? (
              <Spinner animation="border" size="sm" />
            ) : (
              "Ajouter Client"
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

export default AddClientForm;
