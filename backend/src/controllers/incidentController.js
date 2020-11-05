const connection = require("../database/connection");

module.exports = {
  async insert(req, res) {
    const { title, description, value, website } = req.body;

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
