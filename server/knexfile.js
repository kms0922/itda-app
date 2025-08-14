module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './itda.db3' // 'itda.db3' 라는 파일에 데이터 저장
    },
    useNullAsDefault: true,
    migrations: {
      directory: './db/migrations'
    }
  }
};