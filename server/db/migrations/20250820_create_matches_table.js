// server/db/migrations/20250820_create_matches_table.js
exports.up = function(knex) {
  return knex.schema.createTable('matches', table => {
    table.increments('id').primary();
    // 요청을 보낸 사람 (청년 또는 어르신)
    table.integer('requesterId').unsigned().references('id').inTable('users').onDelete('CASCADE');
    // 요청을 받은 사람
    table.integer('receiverId').unsigned().references('id').inTable('users').onDelete('CASCADE');
    // 매칭 상태: 'pending', 'accepted', 'rejected'
    table.string('status').notNullable().defaultTo('pending');
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('matches');
};
