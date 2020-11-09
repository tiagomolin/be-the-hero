const express = require("express");
const routes = require("./routes");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();

const corsOptions = {
  exposedHeaders: "auth-token",
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(routes);

app.listen(3333);
