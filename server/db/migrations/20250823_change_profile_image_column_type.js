// server/db/migrations/20250823_change_profile_image_column_type.js
exports.up = function(knex) {
  return knex.schema.alterTable('profiles', table => {
    // 기존 profileImageUrl 컬럼의 타입을 TEXT로 변경합니다.
    table.text('profileImageUrl').alter();
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('profiles', table => {
    // 되돌릴 때는 다시 STRING으로 변경합니다.
    table.string('profileImageUrl').alter();
  });
};
