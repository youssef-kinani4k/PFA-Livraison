import { Link } from "react-router-dom";
import { Footer, Header } from "../../../components/HeaderFooter";
import "./index.css";

function InactivePage() {
  return (
    <>
      <Header />
      <div className="status-container">
        <h2>Compte Inactif / En Attente d'Approbation</h2>
        <p>
          Votre compte n'est pas encore actif. Il est en attente d'approbation
          par un administrateur.
        </p>
        <p>
          Veuillez patienter ou contacter le support si le délai vous semble
          trop long.
        </p>
        <Link to="/" className="home-link">
          Retour à l'accueil
        </Link>
      </div>
      <Footer />
    </>
  );
}

export default InactivePage;
