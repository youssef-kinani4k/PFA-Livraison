import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function PasswordSignin({ setPassword }) {
  const [pwd, setPwd] = useState("");

  const handleChange = (e) => {
    setPwd(e.target.value);
    setPassword(e.target.value); 
  };
  let [showpass, setShowpass] = useState(false);

  return (
    <div style={{ position: "relative" }}>
      <input
        id="password"
        type={showpass ? "text" : "password"}
        value={pwd}
        onChange={handleChange}
        placeholder="Entrez votre mot de passe"
        required
      />
      <button
        id="showpass"
        className="bg-white"
        onClick={() => setShowpass(!showpass)}
      >
        {" "}
        {!showpass ? <FaEye /> : <FaEyeSlash />}{" "}
      </button>
    </div>
  );
}
export default PasswordSignin;
