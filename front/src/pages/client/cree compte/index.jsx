import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import logo from "../../../assets/logo.png";
import "./index.css";
import PasswordSignin from "./components/PasswordSignin";
import { Footer, Header } from "../../../components/HeaderFooter";

function CreateCompte() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setError(""); 
    setSuccess(""); 

    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !password || 
      !dateOfBirth
    ) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/client/register`, 
        {
          firstName,
          lastName,
          email,
          phone,
          password, 
          dateOfBirth,
        }
      );

      setSuccess(
        "Compte client créé avec succès ! Redirection vers la page de connexion..."
      );
      console.log("Inscription client réussie :", response.data);

      setTimeout(() => {
        navigate("/client/login");
      }, 2000); 
    } catch (err) {
      console.error(
        "Échec de l'inscription client :",
        err.response ? err.response.data : err.message
      );
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message); 
      } else if (err.response && err.response.status === 409) {
        setError(
          "Cet email est déjà enregistré. Veuillez utiliser un autre email."
        );
      } else {
        setError(
          "Échec de l'inscription client. Veuillez réessayer ou contacter le support."
        );
      }
    }
  };

  return (
    <>
      <Header />
      <div id="createCompteContainer">
        <div>
          <h3>
            Vous avez déjà un compte? <Link to="/client/login"> Login </Link>{" "}
          </h3>
          <h2>Créez votre compte </h2>
          <ul style={{ listStyle: "none" }}>
            <li>✓ Accès à un large réseau de transporteurs</li>
            <li>✓ Suivi des livraisons en temps réel</li>
            <li>✓ Historique et traçabilité</li>
          </ul>
        </div>
        <div id="signIn-form">
          <h3>
            Vous avez déjà un compte? <Link to="/client/login"> Login </Link>{" "}
          </h3>
          <Link to="/">
            <img src={logo} alt="Company Logo" />
          </Link>
          <form onSubmit={handleSubmit}>
            <div style={{ display: "none" }}></div>
            <div>
              <label htmlFor="firstName">Nom</label>
              <input
                id="firstName"
                name="firstName" 
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>{" "}
            <div>
              <label htmlFor="lastName">Prénom</label>
              <input
                id="lastName"
                name="lastName" 
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>{" "}
            <div>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email" 
                type="email"
                placeholder="your@mail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="phone">Téléphone</label>
              <input
                id="phone"
                name="phone" 
                type="text"
                placeholder="06....."
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <PasswordSignin setPassword={setPassword} />{" "}
            </div>
            <div>
              <label htmlFor="date">Date naissance</label>
              <input
                type="date"
                id="date"
                name="dateOfBirth" 
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
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
              {" "}
              Submit
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default CreateCompte;
