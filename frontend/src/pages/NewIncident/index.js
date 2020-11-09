import "./styles.css";
import { Link } from "react-router-dom";
import { FiX } from "react-icons/fi";
import logoImg from "../../assets/logo.svg";
import { useHistory } from "react-router-dom";
import { useState } from "react";
import api from "../../services/api";

function NewIncident() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [value, setValue] = useState("");

  const history = useHistory();

  async function handleNewIncident(e) {
    e.preventDefault();
    const data = { title, description, value };

    var response;

    try {
      response = await api.post("/incident", data, {
        headers: {
          "auth-token": localStorage.token,
        },
      });
      history.push("/profile");
    } catch (err) {
      console.log(err.response.data);
      alert(`Failure: ${err.response.data}`);
    }
  }

  return (
    <div className="new-incident-container">
      <div className="content">
        <section>
          <img src={logoImg} alt="Logo" />
          <h1>New Incident</h1>
          <p>Describe your incident</p>
          <p>
            Give as much details as you can so people can know the cause they
            are about to support.
          </p>
          <Link className="redirect-link" to="/profile">
            <FiX size="16" color="#E02041" />
            Go back to your profile
          </Link>
        </section>
        <form onSubmit={handleNewIncident}>
          <input
            placeholder="incident title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            placeholder="value"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />

          <button className="button" type="submit">
            Create!
          </button>
        </form>
      </div>
    </div>
  );
}

export default NewIncident;
