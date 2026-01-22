import React, { useState, useEffect } from "react";
import { Card, Form, Button, Alert, Spinner, Row, Col } from "react-bootstrap";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { FaSave, FaTimes } from "react-icons/fa";

const API_BASE_URL = `${process.env.REACT_APP_API_URL}/api/admin1/companies`;
const token = localStorage.getItem("jwtToken"); 

const EditCompanyForm = ({ onCompanyUpdated }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [company, setCompany] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${API_BASE_URL}/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCompany(response.data);
      } catch (err) {
        console.error("Error fetching company details:", err);
        setError("Échec du chargement des détails de la compagnie.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCompanyDetails();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCompany((prevCompany) => ({ ...prevCompany, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      await axios.put(`${API_BASE_URL}/${id}`, company, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess(true);
      if (onCompanyUpdated) {
        onCompanyUpdated();
      }
      setTimeout(() => navigate("/admin/dashboard/companies"), 1500);
    } catch (err) {
      console.error("Error updating company:", err);
      setError(
        "Échec de la mise à jour de la compagnie : " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" role="status" />
        <p>Chargement des détails de la compagnie...</p>
      </div>
    );
  }

  if (error && !company.id) {
    return (
      <Alert variant="danger" className="mt-4">
        {error}
      </Alert>
    );
  }

  return (
    <Card className="mt-4">
      <Card.Header>Modifier Compagnie: {company.name}</Card.Header>
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
              Compagnie mise à jour avec succès ! Redirection...
            </Alert>
          )}

          <Button variant="primary" type="submit" disabled={submitting}>
            {submitting ? (
              <Spinner animation="border" size="sm" />
            ) : (
              <>
                <FaSave className="me-2" /> Mettre à jour Compagnie
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

export default EditCompanyForm;
