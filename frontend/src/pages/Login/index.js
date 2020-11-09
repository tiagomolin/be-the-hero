import { useState } from "react";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import "./styles.css";
import herosImg from "../../assets/heroes.png";
import logoImg from "../../assets/logo.svg";
import { FiUserPlus } from "react-icons/fi";
import api from "../../services/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const history = useHistory();

  async function handleLogin(e) {
    e.preventDefault();
    const data = { email, password };

    var response;

    try {
      response = await api.post("login", data);
      localStorage.token = response.headers["auth-token"];

      history.push("/profile");
    } catch (err) {
      console.log(err.response.data);
      alert(`Failure: ${err.response.data}`);
    }
  }

  return (
    <div className="login-container">
      <section className="form">
        <img src={logoImg} alt="Logo" />

        <form onSubmit={handleLogin}>
          <h1>Login</h1>

          <input
            placeholder="e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            name=""
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="button" type="submit">
            Log In
          </button>

          <Link className="redirect-link" to="/register">
            <FiUserPlus size="16" color="#E02041" />I dont have a user -
            Register
          </Link>
        </form>
      </section>

      <img src={herosImg} alt="Heroes" />
    </div>
  );
}

export default Login;
