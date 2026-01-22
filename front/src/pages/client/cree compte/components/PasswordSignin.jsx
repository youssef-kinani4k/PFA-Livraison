import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function PasswordSignin({ setPassword }) {
  const [showpass, setShowpass] = useState(false);
  const [currentPassword, setCurrentPassword] = useState(""); 

  const handleChange = (e) => {
    const newValue = e.target.value;
    setCurrentPassword(newValue);
    setPassword(newValue);
  };

  return (
    <div style={{ position: "relative" }}>
      <input
        id="password"
        type={showpass ? "text" : "password"}
        value={currentPassword}
        onChange={handleChange}
        required
      />
      <button
        id="showpass"
        className="bg-white"
        onClick={() => setShowpass(!showpass)}
        type="button" 
      >
        {!showpass ? <FaEye /> : <FaEyeSlash />}
      </button>
    </div>
  );
}

export default PasswordSignin;
