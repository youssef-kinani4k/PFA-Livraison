import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";

function PasswordInput({ setPassword }) {
  const [pwd, setPwd] = useState("");
  let [showpass, setShowpass] = useState(false);

  return (
    <>
      <label id="passLabel" htmlFor="pass">
        <span>Mot de passe*</span> <Link to="/">Mot de passe oublié?</Link>
      </label>
      <input
        id="pass"
        type={showpass ? "text" : "password"}
        placeholder="Mot de passe"
        value={pwd}
        onChange={(e) => {
          setPwd(e.target.value);
          setPassword(e.target.value);
        }}
        required
      />
      <button onClick={() => setShowpass(!showpass)}>
        {!showpass ? <FaEye /> : <FaEyeSlash />}
      </button>
    </>
  );
}

export default PasswordInput;
