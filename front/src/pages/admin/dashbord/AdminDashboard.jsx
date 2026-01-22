import React from "react";
import { Container, Row, Col, Navbar, Nav, Button } from "react-bootstrap";
import { useNavigate, Routes, Route, Link } from "react-router-dom";
import {
  FaUsers,
  FaBuilding,
  FaBoxOpen,
  FaChartLine,
  FaSignOutAlt,
} from "react-icons/fa";

import ClientManagement from "./ClientManagement";
import CompanyManagement from "./CompanyManagement";
import AdminOverview from "./AdminOverview";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    navigate("/admin/login");
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
        <Container fluid>
          <Navbar.Brand as={Link} to="/admin/dashboard">
            Admin Panel
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
            </Nav>
            <Nav>
              <Button variant="outline-light" onClick={handleLogout}>
                Déconnexion
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container fluid>
        <Row>
          <Col md={2} className="bg-light sidebar">
            <Nav className="flex-column mt-3">
              <Nav.Link as={Link} to="/admin/dashboard">
                <FaChartLine className="me-2" /> Vue d'ensemble
              </Nav.Link>
              <Nav.Link as={Link} to="/admin/dashboard/clients">
                <FaUsers className="me-2" /> Gérer les Clients
              </Nav.Link>
              <Nav.Link as={Link} to="/admin/dashboard/companies">
                <FaBuilding className="me-2" /> Gérer les Compagnies
              </Nav.Link>

            </Nav>
          </Col>

          <Col md={10} className="main-content">
            <Routes>
              <Route index element={<AdminOverview />} />
              <Route path="clients/*" element={<ClientManagement />} />
              <Route path="companies/*" element={<CompanyManagement />} />
              <Route
                path="deliveries"
                element={<h3>Gestion des Livraisons (À implémenter)</h3>}
              />
              <Route
                path="clients/:id"
                element={<h3>Détails du client (À implémenter)</h3>}
              />
            </Routes>
          </Col>
        </Row>
      </Container>

      <style>{`
                .sidebar {
                    min-height: calc(100vh - 56px); /* Adjust based on navbar height */
                    position: sticky;
                    top: 56px; /* Stick below the navbar */
                    padding-top: 20px;
                    border-right: 1px solid #dee2e6;
                }
                .main-content {
                    padding-top: 20px;
                }
            `}</style>
    </>
  );
};

export default AdminDashboard;
