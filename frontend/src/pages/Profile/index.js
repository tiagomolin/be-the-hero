import logoImg from "../../assets/logo.svg";
import { Link } from "react-router-dom";
import { FiLogOut, FiTrash2 } from "react-icons/fi";
import { useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../services/api";
import "./styles.css";

function Profile() {
  const [userName, setUserName] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const history = useHistory();

  useEffect(() => {
    async function getUserData(res) {
      try {
        res = await api.get("profile", {
          headers: {
            "auth-token": localStorage.token,
          },
          params: {
            numRecordsPerPage: "",
            page: "",
          },
        });
        console.log(res);
        setUserName(res.data.name);
        setIncidents(res.data.incidents);
      } catch (err) {
        console.log(err);
        localStorage.removeItem("token");
        history.push("/");
      }
    }

    getUserData();
  }, [history]);

  async function handleDeleteIncident(id, res) {
    try {
      console.log(id);
      res = await api.delete("/deleteincident", {
        headers: {
          "auth-token": localStorage.token,
        },
        params: {
          incidentId: id,
        },
      });
      setIncidents(incidents.filter((incident) => incident.id !== id));
    } catch (err) {
      alert(err.response.data);
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    history.push("/");
  }

  return (
    <div className="profile-container">
      <header>
        <img src={logoImg} alt="Logo" />
        <h1>Welcome, {userName}</h1>
        <Link className="button" to="/incidents/new">
          New Incident
        </Link>
        <button onClick={handleLogout} type="button">
          <FiLogOut size="16" color="#E02041" />
        </button>
      </header>
      <section>
        <h1>All Incidents</h1>

        <ul>
          {incidents.map((incident) => (
            <li key={incident.id}>
              <h1>{incident.title}</h1>
              <p>{incident.description}</p>
              <div className="value-group">
                <p>Value</p>
                <strong>
                  {Intl.NumberFormat("en", {
                    style: "currency",
                    currency: "EUR",
                  }).format(incident.value)}
                </strong>
              </div>
              <button onClick={() => handleDeleteIncident(incident.id)}>
                <FiTrash2 size="24" color="#E02041" />
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default Profile;
