const express = require("express");
const sessionController = require("./controllers/sessionController");
const userController = require("./controllers/userController");
const incidentController = require("./controllers/incidentController");
const verifyToken = require("./middlewares/verifyToken");

const routes = express.Router();

routes.get("/", (req, res) => {
  return res.json({
    root: "path",
  });
});

//LOGIN
routes.post("/login", sessionController.login);

//INSERTS USER
routes.post("/user", userController.insert);

//GET ALL USERS
routes.get("/users", userController.list);

//DELETE USER
routes.delete("/deleteuser", verifyToken, userController.delete);

//INSERTS INCIDENT
routes.post("/incident", verifyToken, incidentController.insert);

//GET INCIDENTS
routes.get("/incidents", incidentController.list);

//DELETE INCIDENT
routes.delete("/deleteincident", verifyToken, incidentController.delete);

module.exports = routes;
