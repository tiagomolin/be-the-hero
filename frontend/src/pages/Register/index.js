import "./styles.css";
import { Link, useHistory } from "react-router-dom";
import { FiX } from "react-icons/fi";
import logoImg from "../../assets/logo.svg";
import { useState } from "react";
import api from "../../services/api";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [password, setPassword] = useState("");

  const history = useHistory();

  async function handleRegister(e) {
    e.preventDefault();
    const data = { name, email, password, phone, city, country };

    var response;

    try {
      response = await api.post("user", data);
      localStorage.token = response.headers["auth-token"];
      history.push("/profile");
    } catch (err) {
      console.log(err.response.data);
      alert(`Failure: ${err.response.data}`);
    }
  }

  return (
    <div className="register-container">
      <div className="content">
        <section>
          <img src={logoImg} alt="Logo" />
          <h1>Sign Up</h1>
          <p>
            Register to the plataform and verify all causes to found. You can
            also create your own incident.
          </p>
          <Link className="redirect-link" to="/">
            <FiX size="16" color="#E02041" />
            Go back to Login
          </Link>
        </section>
        <form onSubmit={handleRegister}>
          <input
            placeholder="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            placeholder="e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            placeholder="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <input
            placeholder="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <input
            placeholder="country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />

          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="button" type="submit">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
