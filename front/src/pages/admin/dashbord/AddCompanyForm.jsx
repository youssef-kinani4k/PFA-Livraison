import React, { useState } from "react";
import { Card, Form, Button, Alert, Spinner, Row, Col } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaSave, FaTimes } from "react-icons/fa";

const API_BASE_URL = `${process.env.REACT_APP_API_URL}/api/admin1/companies`;
const token = localStorage.getItem("jwtToken");

const AddCompanyForm = ({ onCompanyAdded }) => {
  const [company, setCompany] = useState({
    name: "",
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
    setCompany((prevCompany) => ({ ...prevCompany, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await axios.post(`${API_BASE_URL}/register`, company, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess(true);
      setCompany({
        name: "",
        email: "",
        password: "",
        phoneNumber: "",
        address: "",
      });
      if (onCompanyAdded) {
        onCompanyAdded();
      }
      setTimeout(() => navigate("/admin/dashboard/companies"), 1500);
    } catch (err) {
      console.error("Error adding company:", err);
      setError(
        "Échec de l'ajout de la compagnie : " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mt-4">
      <Card.Header>Ajouter une nouvelle Compagnie de Livraison</Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="companyName">
            <Form.Label>Nom de la Compagnie</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={company.name}
              onChange={handleChange}
              required
              placeholder="Nom de la compagnie"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="companyEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={company.email}
              onChange={handleChange}
              required
              placeholder="email@example.com"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="companyPassword">
            <Form.Label>Mot de passe (temporaire)</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={company.password}
              onChange={handleChange}
              required
              placeholder="Mot de passe initial"
            />
          </Form.Group>

          <Row className="mb-3">
            <Form.Group as={Col} controlId="companyPhoneNumber">
              <Form.Label>Téléphone</Form.Label>
              <Form.Control
                type="text"
                name="phoneNumber"
                value={company.phoneNumber}
                onChange={handleChange}
                placeholder="Numéro de téléphone"
              />
            </Form.Group>
            <Form.Group as={Col} controlId="companyAddress">
              <Form.Label>Adresse</Form.Label>
              <Form.Control
                type="text"
                name="address"
                value={company.address}
                onChange={handleChange}
                placeholder="Adresse de la compagnie"
              />
            </Form.Group>
          </Row>

          {error && (
            <Alert variant="danger" className="mt-3">
              {error}
            </Alert>
          )}
          {success && (
            <Alert variant="success" className="mt-3">
              Compagnie ajoutée avec succès ! Redirection...
            </Alert>
          )}

          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? (
              <Spinner animation="border" size="sm" />
            ) : (
              <>
                <FaSave className="me-2" /> Ajouter Compagnie
              </>
            )}
          </Button>
          <Button
            variant="secondary"
            onClick={() => navigate("/admin/dashboard/companies")}
            className="ms-2"
          >
            <FaTimes className="me-2" /> Annuler
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default AddCompanyForm;
