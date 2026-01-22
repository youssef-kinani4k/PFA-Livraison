import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";

function PasswordInput({ setPassword }) {
  const [showpass, setShowpass] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const handleChange = (e) => {
    const newValue = e.target.value;
    setCurrentPassword(newValue);
    if (setPassword) {
      setPassword(newValue); 
    }
  };

  return (
    <div className="input-group">
      <label htmlFor="pass" className="form-label d-block w-100 ">
        <span className="text-white">Mot de passe*</span>
      </label>
      <input
        id="pass"
        name="password"
        type={showpass ? "text" : "password"}
        className="form-control form-control-lg rounded-start-3"
        value={currentPassword}
        onChange={handleChange}
        required
        aria-label="Mot de passe"
      />
      <button
        type="button"
        className="btn btn-outline-secondary bg-white  form-control-lg rounded-end-3  border-0"
        onClick={() => setShowpass(!showpass)}
        aria-label={
          showpass ? "Masquer le mot de passe" : "Afficher le mot de passe"
        }
      >
        {!showpass ? <FaEye /> : <FaEyeSlash />}{" "}
      </button>
    </div>
  );
}

export default PasswordInput;
