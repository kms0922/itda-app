// server/db/migrations/20250902_add_personality_to_profiles.js
exports.up = function(knex) {
  return knex.schema.table('profiles', table => {
    // 'active' 또는 'calm' 값을 가질 수 있는 personality 컬럼 추가
    table.string('personality');
  });
};

exports.down = function(knex) {
  return knex.schema.table('profiles', table => {
    table.dropColumn('personality');
  });
};
