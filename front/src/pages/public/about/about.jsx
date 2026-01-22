import {
  FaLeaf,
  FaBullseye,
  FaEye,
  FaHeart,
  FaCheckCircle,
  FaLinkedin,
  FaGithub,
} from "react-icons/fa";
import "./about.css";
import { Footer, Header } from "../../../components/HeaderFooter";
import history from "../../../assets/history2.png";
import mohamed from "../../../assets/mohamed.png";
import youssef from "../../../assets/youssef.png";

function Abbout() {
  return (
    <>
      <Header />

      <div className="primary-bg py-5">
        <div className="container">
          <div className="row justify-content-between">
            <img
              src={history}
              alt="Équipe de livraison"
              className=" object-fit-cover d-none d-md-block col-md-3 order-md-2  align-items-center rounded-4 bg-dark-subtle"
            />
            <div className="col-md-8 order-md-1 text-white py-4">
              <h1 className="display-5 fw-bold mb-3">Notre Histoire</h1>
              <p className="lead mb-4 text-white">
                Fondée en 2025, notre plateforme est née d'une simple idée :
                révolutionner la logistique pour tous.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container my-5 py-4">
        <div className="row g-4">
          <div className="col-lg-4">
            <h2 className="mb-4">
              <FaBullseye className="text-primary me-2" /> Notre Mission
            </h2>
            <p>
              Connecter les entreprises et particuliers à un réseau de livraison
              intelligent, transparent et évolutif.
            </p>
          </div>
          <div className="col-lg-4">
            <h2 className="mb-4">
              <FaEye className="text-primary me-2" /> Notre Vision
            </h2>
            <p>
              Devenir le standard technologique de la logistique dernière mile
              en Afrique francophone d'ici 2027.
            </p>
          </div>
          <div className="col-lg-4">
            <h2 className="mb-4">
              <FaHeart className="text-primary me-2" /> Nos Valeurs
            </h2>
            <ul className="list-unstyled">
              <li className="mb-2">
                <FaCheckCircle className="text-success me-2" />
                Transparence radicale
              </li>
              <li className="mb-2">
                <FaCheckCircle className="text-success me-2" />
                Innovation continue
              </li>
              <li>
                <FaCheckCircle className="text-success me-2" />
                Impact social
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-light py-5">
        <div className="container">
          <h2 className="text-center mb-5">Rencontrez Notre Équipe</h2>
          <div className="row g-4 justify-content-center">
            <div className="col-md-4 ">
              <div className="card border-0 text-center h-100 ">
                <img
                  src={history}
                  className="card-img-top rounded-circle w-50 mx-auto mt-3"
                  alt="CEO"
                />
                <div className="card-body ">
                  <h5 className="card-title">Yassin ABBOU</h5>
                  <p className="text-muted">CO-Fondateur</p>
                  <p className="card-text">
                    Étudiant en Génie Informatique à l'ENIABD.
                  </p>
                  <div>
                    <a href="#">
                      <FaLinkedin className="text-primary mx-2 fs-5" />
                    </a>
                    <a href="#">
                      <FaGithub className="text-info mx-2 fs-5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4 ">
              <div className="card border-0 text-center h-100 ">
                <img
                  src={youssef}
                  className="card-img-top rounded-circle w-50 mx-auto mt-3"
                  alt="CEO"
                />
                <div className="card-body ">
                  <h5 className="card-title">Youssef KINANI</h5>
                  <p className="text-muted">CO-Fondateur</p>
                  <p className="card-text">
                    Étudiant en Génie Informatique à l'ENIABD.
                  </p>
                  <div>
                    <a
                      href="https://www.linkedin.com/in/youssef-kinani-097834335/"
                      target="_blank"
                    >
                      <FaLinkedin className="text-primary mx-2 fs-5" />
                    </a>
                    <a
                      href="https://github.com/youssef-kinani4k/"
                      target="_blank"
                    >
                      <FaGithub className="text-info mx-2 fs-5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4 ">
              <div className="card border-0 text-center h-100 ">
                <img
                  src={mohamed}
                  className="card-img-top rounded-circle w-50 mx-auto mt-3"
                  alt="CEO"
                />
                <div className="card-body ">
                  <h5 className="card-title">Mohamed ABBOU</h5>
                  <p className="text-muted">CO-Fondateur</p>
                  <p className="card-text">
                    Étudiant en Génie Informatique à l'ENIABD.
                  </p>
                  <div>
                    <a
                      href="https://www.linkedin.com/in/abbou-mohamed-17a2b1268/"
                      target="_blank"
                    >
                      <FaLinkedin className="text-primary mx-2 fs-5" />
                    </a>
                    <a href="#">
                      <FaGithub className="text-info mx-2 fs-5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="secondary-bg text-white py-5">
        <div className="container">
          <div className="row text-center text-white">
            <div className="col-md-3">
              <h3 className="display-4 text-white fw-bold">50K+</h3>
              <p className="text-white">Livraisons mensuelles</p>
            </div>
            <div className="col-md-3">
              <h3 className="display-4 fw-bold text-white">98%</h3>
              <p className="text-white">Taux de satisfaction</p>
            </div>
            <div className="col-md-3">
              <h3 className="display-4 fw-bold text-white">24h</h3>
              <p className="text-white">Support réactif</p>
            </div>
            <div className="col-md-3 ">
              <h3 className="display-4 fw-bold text-white">12</h3>
              <p className="text-white">Villes couvertes</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Abbout;
