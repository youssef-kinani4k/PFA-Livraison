import React, { useState } from "react";
import "./HeaderFooter.css";
import logo from "../assets/logo-sans-ecriture.png";
import { Link } from "react-router-dom";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="navbar navbar-expand-lg navbar-light bg-white shadow-sm py-3">
      <div className="container">
        <Link to="/" className="navbar-brand d-flex align-items-center">
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
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className={`collapse navbar-collapse ${isMenuOpen ? "show" : ""}`}
          id="navbarNav"
        >
          <ul className="navbar-nav mx-auto">
            <li className="nav-item mx-2">
              <Link className="nav-link text-dark fs-5" to="/">
                Accueil
              </Link>
            </li>
            <li className="nav-item mx-2">
              <Link className="nav-link text-dark fs-5" to="/features">
                Fonctionnalités
              </Link>
            </li>
            <li className="nav-item mx-2">
              <Link className="nav-link text-dark fs-5" to="/about">
                À propos
              </Link>
            </li>
            <li className="nav-item mx-2">
              <Link className="nav-link text-dark fs-5" to="/contact">
                Contact
              </Link>
            </li>
          </ul>

          <div className="d-flex">
            <Link
              to="/intermedier/login"
              className="btn btn-outline-primary me-2 fs-5 px-3"
            >
              Connexion
            </Link>
            <Link
              to="/intermedier/signin"
              className="btn btn-primary fs-5 px-3"
            >
              Inscription
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <div className="logo">
            <Link to="/">
              <img src={logo} alt="NexWay" />
              <p className="text-primary">NexWay</p>
            </Link>
          </div>
          <p id="para_nexway">
            {" "}
            Est votre solution complète de suivi logistique et d'optimisation de
            transport pour une gestion efficace de votre chaîne
            d'approvisionnement.
          </p>
        </div>

        <div className="footer-links">
          <h3>Liens Rapides</h3>
          <ul>
            <li>
              <a href="/">Accueil</a>
            </li>
            <li>
              <a href="/features">Fonctionnalités</a>
            </li>
            <li>
              <a href="/about">À propos</a>
            </li>
            <li>
              <a href="/contact">Contact</a>
            </li>
          </ul>
        </div>

        <div className="footer-legal">
          <h3>Légal</h3>
          <ul>
            <li>
              <a href="/politique">Politique de confidentialité</a>
            </li>
            <li>
              <a href="/terms">Conditions d'utilisation</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-copyright">
        <p> &copy; {new Date().getFullYear()} NexWay. Tous droits réservés.</p>
      </div>
    </footer>
  );
};

export { Header, Footer };
