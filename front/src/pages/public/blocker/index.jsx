import { Link } from "react-router-dom";
import { Footer, Header } from "../../../components/HeaderFooter";
import "./index.css";

function BlockedPage() {
  return (
    <>
      <Header />
      <div className="status-container">
        <h2>Compte Bloqué</h2>
        <p>
          Votre compte a été bloqué par l'administrateur. Vous ne pouvez pas
          vous connecter.
        </p>
        <p>Veuillez contacter le support pour plus d'informations.</p>
        <Link to="/" className="home-link">
          Retour à l'accueil
        </Link>
      </div>
      <Footer />
    </>
  );
}

export default BlockedPage;
