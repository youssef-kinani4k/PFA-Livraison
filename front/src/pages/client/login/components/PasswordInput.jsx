import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";

// PasswordInput now accepts a 'setPassword' prop
function PasswordInput({ setPassword }) {
  // Destructure setPassword from props
  const [showpass, setShowpass] = useState(false);
  const [currentPassword, setCurrentPassword] = useState(""); // Internal state for the input

  const handleChange = (e) => {
    const newValue = e.target.value;
    setCurrentPassword(newValue); // Update internal state
    if (setPassword) {
      // Only call if the prop is provided
      setPassword(newValue); // Pass the value up to the parent component
    }
  };

  return (
    <div style={{ position: "relative" }}>
      {" "}
      {/* Wrap elements in a div for better positioning */}
      <label id="passLabel" htmlFor="pass">
        <span>Mot de passe*</span>
        {/* Make sure this Link points to the correct password reset page */}
        <Link to="/forgot-password">Mot de passe oublié?</Link>
      </label>
      <input
        id="pass"
        type={showpass ? "text" : "password"}
        value={currentPassword} // Bind input value to internal state
        onChange={handleChange} // Call handleChange on input change
        required // Add required attribute for HTML5 validation
        aria-label="Mot de passe" // Add ARIA label for accessibility
      />
      <button
        id="showpass"
        className="password-toggle-button" // Add a class for specific styling if needed
        onClick={() => setShowpass(!showpass)}
        type="button" // Critical: Prevents button from submitting the form
        aria-label={
          showpass ? "Masquer le mot de passe" : "Afficher le mot de passe"
        } // ARIA label for accessibility
      >
        {!showpass ? <FaEye /> : <FaEyeSlash />}
      </button>
    </div>
  );
}

export default PasswordInput;
