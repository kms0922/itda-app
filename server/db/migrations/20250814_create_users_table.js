exports.up = function(knex) {
  return knex.schema.createTable('users', table => {
    table.increments('id').primary(); // 고유 ID
    table.string('email').unique().notNullable(); // 이메일 (중복 불가)
    table.string('password').notNullable(); // 비밀번호
    table.string('name').notNullable(); // 이름
    table.timestamps(true, true); // 생성 및 수정 시간 자동 기록
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('users');
};