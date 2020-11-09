const connection = require("../database/connection");
const Joi = require("joi");

const insertSchema = Joi.object().keys({
  title: Joi.string().max(60).required(),
  description: Joi.string().max(100).required(),
  value: Joi.number().required(),
  website: Joi.string().max(100).allow(null, ""),
});

module.exports = {
  async insert(req, res) {
    const { title, description, value, website } = req.body;

    const result = insertSchema.validate(req.body);

    if (result.error) {
      return res.status(400).send(result.error.details[0].message);
    }

    const userId = req.user.id;

    const [incidentId] = await connection("incidents").insert({
      user_id: userId,
      title,
      description,
      value,
      website,
    });

    return res.json({
      created: "user incident " + incidentId,
    });
  },
  async list(req, res) {
    const { userId, page = 1, numRecordsPerPage = 5 } = req.query;

    const [count] = await connection("incidents")
      .where(function () {
        if (userId) {
          this.where("user_id", userId);
        }
      })
      .count();

    var incidents = await connection("incidents")
      .join("users", { "incidents.user_id": "users.id" })
      .where(function () {
        if (userId) {
          this.where("user_id", userId);
        }
      })
      .limit(numRecordsPerPage)
      .offset((page - 1) * numRecordsPerPage)
      .select([
        "incidents.*",
        "users.name",
        "users.email",
        "users.phone",
        "users.city",
        "users.country",
      ]);

    res.header("X-Total-Count", count["count(*)"]);
    return res.json(incidents);
  },
  async userList(req, res) {
    const { page = 1, numRecordsPerPage = 5 } = req.query;
    console.log(req);
    const userId = req.user.id;
    const [count] = await connection("incidents")
      .where(function () {
        if (userId) {
          this.where("user_id", userId);
        }
      })
      .count();

    var user = await connection("users")
      .where("id", userId)
      .first()
      .select(["id", "name", "email", "phone", "city", "country", "verified"]);
    var incidents = await connection("incidents")
      .where("user_id", userId)
      .limit(numRecordsPerPage)
      .offset((page - 1) * numRecordsPerPage);
    res.header("X-Total-Count", count["count(*)"]);

    var obj = Object.assign(user, { incidents: incidents });
    return res.json(obj);
  },
  async delete(req, res) {
    const { incidentId } = req.query;

    const userId = req.user.id;

    const incident = await connection("incidents")
      .where("id", incidentId)
      .first();

    if (incident == null) {
      return res.status(404).send("Record not found");
    } else if (incident.user_id != userId) {
      return res
        .status(401)
        .send("Unauthorized - The incident can be deleted only by its owner");
    } else if (incident.user_id == userId) {
      await connection("incidents").where("id", incidentId).del();
      return res.status(200).send("Record Deleted - id " + incidentId);
    }
  },
};
