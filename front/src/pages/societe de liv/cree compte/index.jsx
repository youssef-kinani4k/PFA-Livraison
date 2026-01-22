import React, { useState } from "react";
import logo from "../../../assets/logo.png";
import "./index.css";
import { Link, useNavigate } from "react-router-dom";
import PasswordSignin from "./components/PasswordSignin";
import { Footer, Header } from "../../../components/HeaderFooter";
import axios from "axios";

function CreateCompte() {
  const [companyName, setCompanyName] = useState("");
  const [patentNumber, setPatentNumber] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [companyPaper, setCompanyPaper] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (
      !companyName ||
      !patentNumber ||
      !email ||
      !phone ||
      !password ||
      !companyPaper
    ) {
      setError(
        "Veuillez remplir tous les champs et télécharger les documents de l'entreprise."
      );
      return;
    }

    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    const formData = new FormData();
    formData.append("companyName", companyName);
    formData.append("patentNumber", patentNumber);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("password", password);
    formData.append("companyPaper", companyPaper);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/company/register`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setSuccess(
        "Compte créé avec succès ! Redirection vers la page de connexion..."
      );
      console.log("Inscription réussie :", response.data);

      setTimeout(() => {
        navigate("/societe/login");
      }, 2000);
    } catch (err) {
      console.error(
        "Échec de l'inscription :",
        err.response ? err.response.data : err.message
      );
      setError(
        err.response?.data || "Échec de l'inscription. Veuillez réessayer."
      );
    }
  };

  return (
    <>
      <Header />
      <div id="createCompteContainer">
        <div id="xx">
          <h3>
            Vous avez déjà un compte? <Link to="/client/login"> Login </Link>
          </h3>
          <h2>Créez votre compte </h2>
          <ul>
            <li>
              Réduction des coûts de carburant grâce à des trajets optimisés.
            </li>
            <li>Suivi des livraisons en temps réel</li>
            <li>
              Interface unique pour gérer commandes, livreurs, clients et
              facturations
            </li>
          </ul>
        </div>
        <div id="signIn-form">
          <h3>
            Vous avez déjà un compte? <Link to="/client/login"> Login </Link>
          </h3>
          <Link to="/">
            <img src={logo} alt="Company Logo" />
          </Link>

          <form onSubmit={handleSubmit}>
            <div style={{ display: "none" }}></div>
            <div>
              <label htmlFor="Nom">Nom de société</label>
              <input
                id="Nom"
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="patentNumber">N° Patent</label>
              <input
                id="patentNumber"
                type="text"
                value={patentNumber}
                onChange={(e) => setPatentNumber(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="votre@mail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="phone">Téléphone</label>
              <input
                id="phone"
                type="text"
                placeholder="06....."
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <PasswordSignin setPassword={setPassword} />
            </div>
            <div>
              <label htmlFor="file">Papier de Société</label>
              <input
                type="file"
                id="file"
                onChange={(e) => setCompanyPaper(e.target.files[0])}
                required
              />
            </div>
            {error && (
              <p
                style={{ color: "red", marginTop: "10px", textAlign: "center" }}
              >
                {error}
              </p>
            )}
            {success && (
              <p
                style={{
                  color: "green",
                  marginTop: "10px",
                  textAlign: "center",
                }}
              >
                {success}
              </p>
            )}
            <button id="submit" type="submit">
              Soumettre
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default CreateCompte;
