exports.up = function (knex) {
  return knex.schema
    .createTable("users", function (t) {
      t.increments("id").primary();
      t.string("name", 60).notNullable();
      t.string("email", 100).notNullable();
      t.string("password", 40).notNullable();
      t.string("phone", 100).notNullable();
      t.string("city", 100).notNullable();
      t.string("country", 100).notNullable();
      t.boolean("verified").defaultTo(false).notNullable();
    })
    .createTable("incidents", function (t) {
      t.increments("id").primary();
      t.integer("user_id").unsigned().notNullable();
      t.string("title", 60).notNullable();
      t.string("description", 100).notNullable();
      t.float("value").notNullable();
      t.string("website", 100);
      t.boolean("verified").defaultTo(false).notNullable();

      t.foreign("user_id").references("id").inTable("users");
    });
};

exports.down = function (knex) {
  return knex.schema.dropTable("incidents").dropTable("users");
};
