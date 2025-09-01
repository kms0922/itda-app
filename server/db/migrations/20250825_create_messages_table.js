// server/db/migrations/20250825_create_messages_table.js
exports.up = function(knex) {
  return knex.schema.createTable('messages', table => {
    table.increments('id').primary();
    // 어떤 매칭에 대한 대화인지 matches 테이블과 연결
    table.integer('matchId').unsigned().references('id').inTable('matches').onDelete('CASCADE');
    // 메시지를 보낸 사람
    table.integer('senderId').unsigned().references('id').inTable('users').onDelete('CASCADE');
    // 메시지 내용
    table.text('content').notNullable();
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('messages');
};
