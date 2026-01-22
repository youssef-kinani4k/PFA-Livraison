import { jwtDecode } from "jwt-decode"; // Ensure 'jwt-decode' is installed

function Test() {
  const token = localStorage.getItem("jwtToken");
  let decodedToken = 0;
  if (token) {
    decodedToken = jwtDecode(token);
    console.log(decodedToken);
  }
  return <>pppp</>;
}

export default Test;
