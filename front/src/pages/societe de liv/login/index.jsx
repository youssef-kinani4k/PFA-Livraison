import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./index.css";
import logo from "../../../assets/logo.png";
import PasswordInput from "./components/PasswordInput";
import { Footer, Header } from "../../../components/HeaderFooter";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Veuillez entrer votre email et votre mot de passe.");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/company/login`,
        {
          email: email,
          password: password,
        }
      );

      const { token, approved, blocked } = response.data;

      if (blocked) {
        navigate("/blocker");
      } else if (!approved) {
        navigate("/inactif");
      } else {
        navigate("/company");
        localStorage.setItem("jwtToken", token);
      }
    } catch (err) {
      console.error(
        "Échec de la connexion :",
        err.response ? err.response.data : err.message
      );

      if (err.response) {
        if (err.response.status === 401) {
          setError("Email ou mot de passe incorrect.");
        } else if (err.response.status === 403) {
          navigate("/inactif");
        } else {
          setError(
            err.response.data || "Échec de connexion. Veuillez réessayer."
          );
        }
      } else {
        setError(
          "Impossible de se connecter au serveur. Veuillez vérifier votre connexion."
        );
      }
    }
  };

  return (
    <>
      <Header />

      <div id="container">
        <img src={logo} alt="logo" />
        <div id="signin">
          <h1>
            Suivez vos livreurs et analysez les performances de votre activité
          </h1>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email">Email*</label>
              <input
                id="email"
                type="email"
                placeholder="your@mail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div style={{ position: "relative" }}>
              <PasswordInput setPassword={setPassword} />
              {error && (
                <span className="messagEror" style={{ display: "block" }}>
                  ● {error}
                </span>
              )}
            </div>
            <button id="submit" type="submit">
              Submit
            </button>
          </form>
          <h5 className="mt-3">
            Nouveau sur NexWay?{" "}
            <Link to="/societe/signin">Créer un compte</Link>{" "}
          </h5>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Login;
