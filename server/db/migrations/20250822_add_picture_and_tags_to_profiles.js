// server/db/migrations/20250822_add_picture_and_tags_to_profiles.js
exports.up = function(knex) {
  return knex.schema.table('profiles', table => {
    // 프로필 사진 URL을 저장할 컬럼
    table.string('profileImageUrl');
    // 관심사 태그를 저장할 컬럼 (쉼표로 구분된 문자열)
    table.text('tags');
  });
};

exports.down = function(knex) {
  return knex.schema.table('profiles', table => {
    table.dropColumn('profileImageUrl');
    table.dropColumn('tags');
  });
};
