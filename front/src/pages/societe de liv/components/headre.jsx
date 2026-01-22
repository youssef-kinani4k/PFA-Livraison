import { Link } from "react-router-dom";
import { FaTruck, FaRoute, FaUserTie } from "react-icons/fa";
import { MdQueryStats } from "react-icons/md";
import logo from "../../../assets/logo-sans-ecriture.png";

function Header() {
  const handleLogout = () => {
    console.log("Déconnexion effectuée");
  };

  return (
    <header className="navbar navbar-expand-lg navbar-light bg-white shadow-sm py-3">
      <div className="container">
        <Link
          to="/societe/dashbord"
          className="navbar-brand d-flex align-items-center"
        >
          <img
            src={logo}
            alt="NexWay"
            className="me-2"
            style={{ height: "40px", width: "40px" }}
          />
          <p className="m-0 fw-bold text-primary fs-5">NexWay</p>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto">
            <li className="nav-item mx-2">
              <Link className="nav-link text-dark fs-5" to="/societe/dashbord">
                <FaTruck className="me-1" />
                Livraisons
              </Link>
            </li>
            <li className="nav-item mx-2">
              <Link className="nav-link text-dark fs-5" to="/trajet">
                <FaRoute className="me-1" />
                Trajets
              </Link>
            </li>
            <li className="nav-item mx-2">
              <Link className="nav-link text-dark fs-5" to="/livreur">
                <FaUserTie className="me-1" />
                Livreurs
              </Link>
            </li>
            <li className="nav-item mx-2">
              <Link className="nav-link text-dark fs-5" to="/statistique">
                <MdQueryStats className="me-1" />
                Statistique
              </Link>
            </li>
          </ul>

          <div className="d-flex">
            <button
              onClick={handleLogout}
              className="btn btn-outline-danger fs-5 px-1"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
