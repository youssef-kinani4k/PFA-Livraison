import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import PasswordInput from "./components/PasswordInput";
import "./index.css"; // Reusing your generic password input
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS

function DeliveryPersonnelLogin() {
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
        `${process.env.REACT_APP_API_URL}/api/auth/personnel/login`, // Delivery Personnel login endpoint
        {
          email: email,
          password: password,
        }
      );

      const { token, blocked } = response.data;

      // Store token

      // --- Redirection Logic for Delivery Personnel ---
      if (blocked) {
        navigate("/personnel/blocked"); // Redirect to personnel specific blocked page
      } else {
        navigate("/livreur/dashboard");
        localStorage.setItem("jwtToken", token); // Adjust this path to your actual delivery personnel dashboard
      }
    } catch (err) {
      console.error(
        "Échec de connexion livreur :",
        err.response ? err.response.data : err.message
      );

      if (err.response) {
        if (err.response.status === 401) {
          setError("Email ou mot de passe incorrect.");
        } else {
          setError(
            err.response.data?.message ||
              "Échec de connexion livreur. Veuillez réessayer."
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
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card shadow-sm p-4">
              <h2 className="card-title text-center mb-4">Connexion Livreur</h2>
              <p className="text-center text-muted mb-4">
                Accédez à votre compte pour gérer vos livraisons.
              </p>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email*
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="form-control"
                    placeholder="votre@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  {/* Reusing the PasswordInput component */}
                  <PasswordInput setPassword={setPassword} />
                </div>
                {error && (
                  <div className="alert alert-danger mt-3" role="alert">
                    {error}
                  </div>
                )}
                <button type="submit" className="btn btn-primary w-100 mt-3">
                  Se connecter
                </button>
              </form>
              <p className="text-center mt-3">
                <Link to="/">Retour à l'accueil</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DeliveryPersonnelLogin;
