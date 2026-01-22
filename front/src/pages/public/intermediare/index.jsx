import "./index.css";
import { Footer, Header } from "../../../components/HeaderFooter";
import { FaTruck, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

function Intermediare() {
  const { id } = useParams();
  return (
    <>
      <Header />
      <div className="primary-bg py-5">
        <div className="container text-center text-white">
          <h1 className="display-5 fw-bold mb-3">Qui êtes-vous ?</h1>
          <p className="lead mb-4 text-white">
            Sélectionnez votre profil pour accéder à l'interface qui correspond
            à vos besoins
          </p>
        </div>
      </div>
      <div className="container my-5">
        <div className="row justify-content-center">
          <div className="col-md-5 mb-4">
            <div className="card h-100 shadow-sm border-0 ">
              <div className="card-body text-center p-4 d-flex flex-column">
                <div className="mb-4">
                  <div className="icon-circle text-white mx-auto">
                    <FaUser size={30} />
                  </div>
                </div>
                <h3 className="card-title mb-3">Je suis un Client</h3>
                <p className="card-text mb-4">
                  Je veux envoyer ou recevoir des colis en utilisant les
                  services de livraison.
                </p>
                <div className="mt-auto">
                  <Link
                    to={`/client/${id}`}
                    className="signup-btn align-self-start"
                  >
                    {id == "signin" ? "Crée compte " : "Connexion"}{" "}
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-5 mb-4">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body text-center p-4 d-flex flex-column">
                <div className="mb-4">
                  <div className="icon-circle  text-white mx-auto">
                    <FaTruck size={30} />
                  </div>
                </div>
                <h3 className="card-title mb-3">
                  Je suis une Société de livraison
                </h3>
                <p className="card-text mb-4">
                  Je propose des services de livraison et je veux gérer mes
                  livreurs et colis.
                </p>
                <div className="mt-auto">
                  <Link
                    to={`/societe/${id}`}
                    className="signup-btn align-self-start"
                  >
                    {id == "signin" ? "Crée compte " : "Connexion"}{" "}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Intermediare;
