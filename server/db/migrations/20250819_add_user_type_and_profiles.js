// server/db/migrations/20250819_add_user_type_and_profiles.js
exports.up = function(knex) {
  return knex.schema.table('users', table => {
    table.string('userType').notNullable().defaultTo('youth');
  }).createTable('profiles', table => {
    table.increments('id').primary();
    table.integer('userId').unsigned().references('id').inTable('users').onDelete('CASCADE');
    table.string('introduction');
    table.string('region');
    table.string('availableTime');
    table.text('experience');
    table.string('desiredActivity');
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('profiles').table('users', table => {
    table.dropColumn('userType');
  });
};