import "./index.css";
import { Footer, Header } from "../../../components/HeaderFooter";
import imageHome from "../../../assets/home.png";
import { FaTruck, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";

function Accueil() {
  return (
    <>
      <Header />
      <div className="primary-bg py-5">
        <div className="container">
          <div className="row align-items-center">
            <img
              src={imageHome}
              alt="Équipe de livraison"
              className=" object-fil-cover d-none d-md-block col-md-4 order-md-2 justify-content-center align-items-center rounded-4 bg-dark-subtle"
            />
            <div className="col-md-8 order-md-1 text-white py-4">
              <h1 className="display-5 fw-bold mb-3">
                Livraison rapide, fiable et adaptée à vos besoins
              </h1>
              <p className="lead mb-4 text-white">
                Que vous soyez une entreprise ou un particulier, nous assurons
                vos livraisons en toute sécurité et dans les meilleurs délais.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className=" container ">
        <h2 className="my-4">Nos services</h2>
        <div className="row">
          <div className=" mb-3  d-flex flex-column align-items-center justify-content-between col-10 bg-secondary-subtle mx-auto p-4 rounded col-md-5">
            <h4>
              {" "}
              <FaTruck></FaTruck> Pour les entreprises
            </h4>
            <ul>
              <li>
                {" "}
                Gagnez du temps avec nos solutions logistiques adaptées à votre
                activité.
              </li>
              <li>Suivez vos colis et flottes à chaque étape</li>
              <li>
                Réduction des coûts de carburant grâce à des trajets optimisés.
              </li>
              <li>
                Interface unique pour gérer commandes, livreurs, clients et
                facturations
              </li>
            </ul>{" "}
            <Link to="/societe/signin" className="signup-btn">
              Créez votre compte
            </Link>
          </div>
          <div className=" mb-3 d-flex flex-column align-items-center justify-content-between col-10 bg-secondary-subtle mx-auto p-4 rounded col-md-5">
            <h4>
              {" "}
              <FaUser /> Pour les particuliers
            </h4>
            <ul>
              <li> Accès à un large réseau de transporteurs</li>
              <li>Suivi des livraisons en temps réel</li>
              <li>
                Livraison plus rapide grâce à une meilleure coordination entre
                les partenaires.
              </li>
              <li>
                Accès à des offres de livraison négociées grâce au volume global
                géré par la plateforme.
              </li>
              <li>Historique et traçabilité</li>
            </ul>{" "}
            <Link to="/client/signin" className="signup-btn">
              Créez votre compte
            </Link>
          </div>
        </div>
      </div>

      <div className="container mt-5 ">
        <h2 className="my-4">On le fait ensemble ?</h2>
        <div className=" d-flex flex-column align-content-center secondary-bg text-white col-12 col-md-10 mx-auto p-4 rounded">
          <h3>Prêt à révolutionner votre processus de livraison ?</h3>
          <br />
          <p className="text-white">
            Intégrez notre plateforme et accédez à une gestion des livraisons
            plus intelligente, plus rapide et plus fluide. <br />
            Transformez vos opérations dès aujourd’hui, et prenez une longueur
            d’avance sur la concurrence
          </p>
          <br />
          <Link
            to={`intermedier/signin`}
            className="signup-btn align-self-start"
          >
            Commencez maintenant
          </Link>
        </div>
      </div>
      <hr />
      <Footer />
    </>
  );
}

export default Accueil;
