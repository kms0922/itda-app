// server/db/migrations/20250824_extend_password_column.js
exports.up = function(knex) {
  return knex.schema.alterTable('users', table => {
    // password 컬럼의 길이를 255자로 늘립니다.
    table.string('password', 255).notNullable().alter();
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('users', table => {
    // 되돌릴 때는 원래 길이로 변경 (필요시 수정)
    table.string('password').notNullable().alter();
  });
};
