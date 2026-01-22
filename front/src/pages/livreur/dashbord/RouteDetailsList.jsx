import React from "react";
import { ListGroup, Button, Card, Alert } from "react-bootstrap";

const RouteDetailsList = ({
  routeEntries,
  currentStepIndex,
  onCompleteStep,
}) => {
  if (!routeEntries || routeEntries.length === 0) {
    return (
      <Alert variant="info" className="text-center">
        Aucune étape pour ce trajet.
      </Alert>
    );
  }

  if (currentStepIndex === null) {
    return (
      <Card className="h-100">
        <Card.Header>
          <h3>Trajet terminé ✅</h3>
        </Card.Header>
        <Card.Body>Merci pour votre travail !</Card.Body>
      </Card>
    );
  }

  const entry = routeEntries[currentStepIndex];

  return (
    <Card className="h-100">
      <Card.Header>
        <h3>Étape en cours</h3>
      </Card.Header>
      <ListGroup variant="flush">
        <ListGroup.Item>
          <strong>Type:</strong>{" "}
          {entry.type === "recuperation" ? "Récupération" : "Livraison"} <br />
          <strong>ID Livraison:</strong> {entry.idLivraison} <br />
          <strong>Localisation:</strong> {entry.localisation[0]},{" "}
          {entry.localisation[1]} <br />
          <strong>Taille:</strong> {entry.taille} kg
          <Button
            variant={entry.type === "recuperation" ? "success" : "primary"}
            className="mt-2 w-100"
            onClick={() =>
              onCompleteStep(Number(entry.id_livraison), entry.type)
            }
          >
            Terminer{" "}
            {entry.type === "recuperation" ? "Récupération" : "Livraison"}
          </Button>
        </ListGroup.Item>
      </ListGroup>
    </Card>
  );
};

export default RouteDetailsList;
