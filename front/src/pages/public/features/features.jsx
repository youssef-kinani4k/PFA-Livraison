import "./features.css";
import { Footer, Header } from "../../../components/HeaderFooter";
import { Link } from "react-router-dom";
import {
  FaMapMarkedAlt,
  FaChartLine,
  FaCheckCircle,
  FaRoute,
} from "react-icons/fa";
import stats from "../../../assets/stats.png";
import img1 from "../../../assets/fonctionnaliter1.png";

function Features() {
  return (
    <>
      <Header />

      <div className="primary-bg py-5">
        <div className="container">
          <div className="row align-items-center">
            <img
              src={img1}
              alt="Équipe de livraison"
              className=" object-fit-cover d-none d-md-block col-md-4 order-md-2 justify-content-center align-items-center rounded-4 bg-dark-subtle"
            />
            <div className="col-md-8 order-md-1 text-white py-4">
              <h1 className="display-5 fw-bold mb-3">
                Nos Fonctionnalités Clés
              </h1>
              <p className="lead mb-4 text-white">
                Découvrez les outils puissants conçus pour simplifier vos
                livraisons, quels que soient vos besoins.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container my-5">
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body text-center p-4">
                <div className="icon-lg bg-primary-light rounded-circle mb-3 mx-auto">
                  <FaMapMarkedAlt className="text-primary fs-3" />
                </div>
                <h3>Suivi en Temps Réel</h3>
                <p>
                  Visualisez l'emplacement exact de vos colis avec des mises à
                  jour minute par minute.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body text-center p-4">
                <div className="icon-lg bg-primary-light rounded-circle mb-3 mx-auto">
                  <FaRoute className="text-primary fs-3" />
                </div>
                <h3>Optimisation d'Itinéraire</h3>
                <p>
                  Algorithmes intelligents pour réduire les coûts et les délais
                  de livraison.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body text-center p-4">
                <div className="icon-lg bg-primary-light rounded-circle mb-3 mx-auto">
                  <FaChartLine className="text-primary fs-3" />
                </div>
                <h3>Analytiques Avancées</h3>
                <p>
                  Tableaux de bord personnalisés pour suivre les performances et
                  les coûts.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-light py-5">
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-md-6">
              <img src={stats} alt="Interface de suivi" className=" rounded" />
            </div>
            <div className="col-md-6">
              <h2 className="mb-4">Une Visibilité Totale</h2>
              <ul className="list-unstyled">
                <li className="mb-3 d-flex">
                  <FaCheckCircle className="text-success mt-1 me-2" />
                  <span>Notifications push/email à chaque étape</span>
                </li>
                <li className="mb-3 d-flex">
                  <FaCheckCircle className="text-success mt-1 me-2" />
                  <span>Historique complet des livraisons</span>
                </li>
                <li className="mb-3 d-flex">
                  <FaCheckCircle className="text-success mt-1 me-2" />
                  <span>Preuves de livraison numériques</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="secondary-bg text-white py-5">
        <div className="container text-center text-white">
          <h2 className="mb-4">Prêt à Optimiser Vos Livraisons ?</h2>
          <Link
            to="/intermedier/signin"
            className="signup-btn align-self-start"
          >
            Essai Gratuit
          </Link>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Features;
