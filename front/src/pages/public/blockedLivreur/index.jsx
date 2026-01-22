import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function DeliveryPersonnelBlockedPage() {
  return (
    <>
      <div className="container mt-5 text-center">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Compte Livreur Bloqué</h4>
          <p>Votre compte livreur a été bloqué par l'administrateur.</p>
          <hr />
          <p className="mb-0">
            Veuillez contacter le support pour plus d'informations.
          </p>
        </div>
        <Link to="/" className="btn btn-secondary mt-3">
          Retour à l'accueil
        </Link>
      </div>
    </>
  );
}

export default DeliveryPersonnelBlockedPage;
