import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"; // Make sure Bootstrap CSS is imported somewhere in your project

function PasswordInput({ setPassword }) {
  // Remember to accept setPassword prop
  const [showpass, setShowpass] = useState(false);
  const [currentPassword, setCurrentPassword] = useState(""); // Internal state for the input

  const handleChange = (e) => {
    const newValue = e.target.value;
    setCurrentPassword(newValue);
    if (setPassword) {
      // Only call if the prop is provided
      setPassword(newValue);
    }
  };

  return (
    // Use Bootstrap's input-group for a visually integrated button
    <div className="input-group">
      <label htmlFor="pass" className="form-label d-block w-100">
        {" "}
        {/* d-block w-100 to make label full width */}
        <span>Mot de passe*</span>
        {/* Make sure this Link points to the correct password reset page */}
        <Link to="/forgot-password" className="float-end">
          Mot de passe oublié?
        </Link>
      </label>
      <input
        id="pass"
        name="password" // Added name attribute for form submission
        type={showpass ? "text" : "password"}
        className="form-control" // Bootstrap form control class
        placeholder="Entrez votre mot de passe" // Add a placeholder
        value={currentPassword}
        onChange={handleChange}
        required
        aria-label="Mot de passe"
      />
      <button
        type="button" // Important: Prevents button from submitting the form
        className="btn btn-outline-secondary" // Bootstrap button classes
        onClick={() => setShowpass(!showpass)}
        aria-label={
          showpass ? "Masquer le mot de passe" : "Afficher le mot de passe"
        }
      >
        {!showpass ? <FaEye /> : <FaEyeSlash />}
      </button>
    </div>
  );
}

export default PasswordInput;
