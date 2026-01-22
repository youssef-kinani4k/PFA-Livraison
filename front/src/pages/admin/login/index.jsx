import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import PasswordInput from "../components/PasswordInput"; 
import "bootstrap/dist/css/bootstrap.min.css";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError(
        "Veuillez entrer l'email et le mot de passe de l'administrateur."
      );
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/admin/login`,
        {
          email: email,
          password: password,
        }
      );

      const { token } = response.data;

      localStorage.setItem("jwtToken", token);

      navigate("/admin/dashboard");
    } catch (err) {
      console.error(
        "Échec de connexion administrateur :",
        err.response ? err.response.data : err.message
      );

      if (err.response) {
        if (err.response.status === 401) {
          setError("Email ou mot de passe administrateur incorrect.");
        } else {
          setError(
            err.response.data?.message ||
              "Échec de connexion administrateur. Veuillez réessayer."
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
      <div
        className="container-fluid d-flex justify-content-center align-items-center bg-dark vh-100"
        style={{ minHeight: "calc(100vh - 120px)" }}
      >
        {" "}
        <div className="col-md-5 col-lg-4">
          <div className="card text-white bg-secondary border-0 shadow-lg p-4">
            {" "}
            <h2 className="card-title text-center mb-4 border-bottom pb-3">
              <i className="bi bi-shield-lock-fill me-2"></i> Connexion
              Administrateur
            </h2>
            <p className="text-center mb-4 text-white">
              Accès réservé au personnel administratif de l'application.
            </p>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label text-white">
                  Email de l'administrateur*
                </label>
                <input
                  id="email"
                  type="email"
                  className="form-control form-control-lg"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <PasswordInput setPassword={setPassword} />
              </div>
              {error && (
                <div className="alert alert-warning mt-3" role="alert">
                  {" "}
                  {error}
                </div>
              )}
              <button
                type="submit"
                className="btn btn-outline-light w-100 mt-3 btn-lg"
              >
                {" "}
                Se connecter en tant qu'administrateur
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminLogin;
