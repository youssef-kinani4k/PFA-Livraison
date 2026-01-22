import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Alert,
  Navbar,
  Nav,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import { FaCalendarAlt, FaEye, FaSignOutAlt, FaSyncAlt } from "react-icons/fa";

import MapComponent from "./MapComponent";
import RouteDetailsList from "./RouteDetailsList";

const DeliveryPersonnelDashboard = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableDates, setAvailableDates] = useState([]);
  const [dailyRoutes, setDailyRoutes] = useState(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [personnelId, setPersonnelId] = useState(null);
  const [showRouteDetails, setShowRouteDetails] = useState(false);

  const API_BASE_URL = `${process.env.REACT_APP_API_URL}/api/delivery-personnel/dashboard`;
  const token = localStorage.getItem("jwtToken");
  const navigate = useNavigate();

  const formatDateForApi = (date) => date.toISOString().split("T")[0];

  useEffect(() => {
    setPersonnelId(getPersonnelIdFromToken(token));
  }, [token]);

  const getPersonnelIdFromToken = (jwtToken) => {
    return "2";
  };

  useEffect(() => {
    const fetchAvailableDates = async () => {
      if (!token) return;
      try {
        const response = await axios.get(`${API_BASE_URL}/available-dates`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAvailableDates(response.data.map((dateStr) => new Date(dateStr)));
      } catch (err) {
        console.error("Error fetching available dates:", err);
        setError("Failed to load available dates.");
      }
    };
    fetchAvailableDates();
  }, [token]);

  useEffect(() => {
    const fetchDailyRoutes = async () => {
      if (!selectedDate || !personnelId || !token) return;

      setLoading(true);
      setError(null);
      setDailyRoutes(null);
      setShowRouteDetails(false);

      try {
        const formattedDate = formatDateForApi(selectedDate);
        const response = await axios.get(
          `${API_BASE_URL}/routes/${formattedDate}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data && response.data.routes) {
          const fetchedPersonnelId = response.data.personnelId;
          const personnelSpecificRoutes =
            response.data.routes[fetchedPersonnelId] || [];

          const sortedPersonnelRoutes = [...personnelSpecificRoutes].sort(
            (a, b) => {
              if (a.idLivraison === b.idLivraison) {
                if (a.type === "recuperation" && b.type === "livraison")
                  return -1;
                if (a.type === "livraison" && b.type === "recuperation")
                  return 1;
              }
              return 0;
            }
          );

          setDailyRoutes(sortedPersonnelRoutes);
        } else {
          setDailyRoutes([]);
        }
      } catch (err) {
        console.error("Error fetching daily routes:", err);
        setError(
          "Failed to load routes for this date. Make sure you are assigned routes."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchDailyRoutes();
  }, [selectedDate, personnelId, token]);

  const handleViewDailyRoute = () => {
    setShowRouteDetails(true);
    setCurrentStepIndex(0);
  };

  const handleCompleteStep = async (deliveryId, type) => {
    setLoading(true);
    setError(null);
    try {
      await axios.post(
        `${API_BASE_URL}/update-status`,
        {
          deliveryId,
          type,
          deliveryPersonnelId: personnelId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const formattedDate = formatDateForApi(selectedDate);
      const updatedResponse = await axios.get(
        `${API_BASE_URL}/routes/${formattedDate}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const fetchedPersonnelId = updatedResponse.data.personnelId;
      const updatedDailyRoutes =
        updatedResponse.data.routes[fetchedPersonnelId] || [];

      const sortedUpdatedDailyRoutes = [...updatedDailyRoutes].sort((a, b) => {
        if (a.idLivraison === b.idLivraison) {
          if (a.type === "recuperation" && b.type === "livraison") return -1;
          if (a.type === "livraison" && b.type === "recuperation") return 1;
        }
        return 0;
      });

      setDailyRoutes(sortedUpdatedDailyRoutes);

      if (
        currentStepIndex !== null &&
        currentStepIndex + 1 < sortedUpdatedDailyRoutes.length
      ) {
        setCurrentStepIndex((prev) => prev + 1);
      } else {
        setCurrentStepIndex(null);
      }
    } catch (err) {
      console.error("Error updating status:", err);
      setError(
        "Failed to update status: " + (err.response?.data || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    navigate("/livreur/login");
  };

  return (
    <>
      <Navbar bg="light" expand="lg" className="mb-4">
        <Container>
          <Navbar.Brand>Tableau de Bord Livreur</Navbar.Brand>
          <Nav className="ms-auto">
            <Button variant="danger" onClick={handleLogout}>
              <FaSignOutAlt className="me-2" />
              Déconnexion
            </Button>
          </Nav>
        </Container>
      </Navbar>

      <Container fluid>
        <Row className="mb-4 justify-content-center align-items-center">
          <Col md={4}>
            <Card>
              <Card.Body>
                <Card.Title className="mb-3">
                  <FaCalendarAlt className="me-2" />
                  Sélectionner une date
                </Card.Title>
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  dateFormat="yyyy-MM-dd"
                  includeDates={availableDates}
                  placeholderText="Sélectionnez une date"
                  className="form-control"
                />
              </Card.Body>
            </Card>
          </Col>

          <Col md={8}>
            {loading && (
              <div className="text-center my-3">
                <Spinner animation="border" role="status" />
                <FaSyncAlt className="ms-2 spin-icon" />
                <span className="visually-hidden">Chargement...</span>
              </div>
            )}
            {error && <Alert variant="danger">{error}</Alert>}

            {dailyRoutes && dailyRoutes.length > 0 ? (
              <Card>
                <Card.Header className="d-flex justify-content-between align-items-center flex-wrap">
                  <h2 className="mb-0">
                    Trajet pour le {formatDateForApi(selectedDate)}
                  </h2>
                  <Button
                    variant="info"
                    onClick={handleViewDailyRoute}
                    className="mt-2 mt-md-0"
                  >
                    <FaEye className="me-2" />
                    Voir le trajet complet
                  </Button>
                </Card.Header>
              </Card>
            ) : (
              !loading &&
              !error && (
                <Alert variant="info" className="text-center mt-3">
                  Aucun trajet trouvé pour cette date.
                </Alert>
              )
            )}
          </Col>
        </Row>

        {showRouteDetails && dailyRoutes && dailyRoutes.length > 0 && (
          <Row>
            <Col md={12}>
              <Card>
                <Card.Body>
                  <Row>
                    <Col md={8}>
                      <MapComponent
                        routeEntries={dailyRoutes}
                        currentStepIndex={currentStepIndex}
                      />
                    </Col>
                    <Col md={4}>
                      <RouteDetailsList
                        routeEntries={dailyRoutes}
                        currentStepIndex={currentStepIndex}
                        onCompleteStep={handleCompleteStep}
                      />
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Container>

      <style>{`
        .spin-icon {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
};

export default DeliveryPersonnelDashboard;
