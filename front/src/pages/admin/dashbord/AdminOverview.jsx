import React from "react";
import { Card, Row, Col } from "react-bootstrap";
import { FaUsers, FaBuilding, FaBoxOpen } from "react-icons/fa";

const AdminOverview = () => {
  const stats = {
    totalClients: 2,
    activeCompanies: 1,
    pendingDeliveries: 7,
    completedDeliveriesToday: 0,
  };

  return (
    <div>
      <h2>Vue d'ensemble de l'Admin</h2>
      <p>
        Bienvenue sur le tableau de bord administrateur. Voici un aperçu rapide
        de l'activité du système.
      </p>
      <Row className="mt-4">
        <Col md={4}>
          <Card className="text-center bg-primary text-white mb-3">
            <Card.Body>
              <FaUsers size={40} className="mb-2" />
              <h3>{stats.totalClients}</h3>
              <p>Clients Total</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center bg-success text-white mb-3">
            <Card.Body>
              <FaBuilding size={40} className="mb-2" />
              <h3>{stats.activeCompanies}</h3>
              <p>Compagnies Actives</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center bg-warning text-white mb-3">
            <Card.Body>
              <FaBoxOpen size={40} className="mb-2" />
              <h3>{stats.pendingDeliveries}</h3>
              <p>Livraisons en Attente</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminOverview;
