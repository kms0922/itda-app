// server/db/migrations/20250821_create_activities_and_reviews.js
exports.up = function(knex) {
  return knex.schema.createTable('activities', table => {
    table.increments('id').primary();
    // 어떤 매칭에 대한 활동인지 matches 테이블과 연결
    table.integer('matchId').unsigned().references('id').inTable('matches').onDelete('CASCADE');
    table.date('activityDate').notNullable(); // 활동 날짜
    table.string('description').notNullable(); // 활동 내용 (예: 산책, 대화)
    table.timestamps(true, true);
  }).createTable('reviews', table => {
    table.increments('id').primary();
    // 어떤 활동에 대한 후기인지 activities 테이블과 연결
    table.integer('activityId').unsigned().references('id').inTable('activities').onDelete('CASCADE');
    // 후기를 남기는 사람
    table.integer('reviewerId').unsigned().references('id').inTable('users').onDelete('CASCADE');
    // 후기를 받는 사람
    table.integer('revieweeId').unsigned().references('id').inTable('users').onDelete('CASCADE');
    table.integer('rating').notNullable(); // 만족도 점수 (1~5)
    table.text('comment'); // 한 줄 후기
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('reviews').dropTable('activities');
};
