const express = require("express");
const routes = require("./routes");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());
app.use(routes);

app.listen(3333);
