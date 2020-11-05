const connection = require("../database/connection");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports = {
  async insert(req, res) {
    const { name, email, password, phone, city, country } = req.body;

    const [existsEmail] = await connection("users").where("email", email);

    if (existsEmail != null) {
      return res.status(400).send("Email is already being used");
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);

      const [userId] = await connection("users").insert({
        name,
        email,
        password: hashPassword,
        phone,
        city,
        country,
      });

      const token = jwt.sign({ id: userId }, process.env.TOKEN_SECRET);

      res.header("auth-token", token);
      return res.json({
        created: "user " + userId,
      });
    }
  },

  async list(req, res) {
    const { page = 1, numRecordsPerPage = 5 } = req.query;

    const users = await connection("users")
      .limit(numRecordsPerPage)
      .offset((page - 1) * numRecordsPerPage)
      .select("*");

    console.log(users);

    return res.json(users);
  },

  async delete(req, res) {
    console.log(req.user.id);
    //gets the id from the valid token
    const userId = req.user.id;

    const existsId = await connection("users").where("id", userId).first();

    //console.log(existsId);

    if (existsId == null) {
      return res.status(404).send("Record not found");
    } else {
      await connection("users").where("id", userId).del();
      return res.status(200).send("Record Deleted");
    }
  },
};
