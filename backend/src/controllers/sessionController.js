const connection = require("../database/connection");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports = {
  async login(req, res) {
    const { email, password } = req.body;
    const user = await connection("users").where("email", email).first();
    if (user == null) {
      return res.status(400).send("USER/password not found.");
    }

    const validPass = await bcrypt.compare(password, user.password);

    if (!validPass) {
      return res.status(400).send("USER/PASSWORD not found.");
    }

    const token = jwt.sign({ id: user.id }, process.env.TOKEN_SECRET);

    res.header("auth-token", token);
    return res.status(200).send("Login ok.");
  },
};
