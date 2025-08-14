const express = require('express');
const app = express();
const knex = require('knex')(require('./knexfile').development); // DB 연결

const HOST = '127.0.0.1';
const PORT = 5000;

app.use(express.json()); // 프론트엔드가 보낸 JSON 데이터를 해석하기 위한 설정

// [GET] /api : 서버 상태 확인용 API
app.get('/api', (req, res) => {
  res.send('안녕하세요, 잇다 백엔드 서버의 API 응답입니다!');
});

// ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼
// [POST] /api/register : 회원가입 처리 API
app.post('/api/register', async (req, res) => {
  const { email, password, name } = req.body;

  // 간단한 유효성 검사
  if (!email || !password || !name) {
    return res.status(400).json({ success: false, message: '모든 필드를 입력해주세요.' });
  }

  try {
    // DB에 새로운 사용자 추가
    const [userId] = await knex('users').insert({
      email: email,
      password: password, // 실제 프로젝트에서는 비밀번호를 암호화해야 합니다!
      name: name
    });
    res.status(201).json({ success: true, userId: userId });
  } catch (error) {
    // 이메일 중복 등의 에러 처리
    res.status(500).json({ success: false, message: '회원가입 중 오류가 발생했습니다.', error: error.message });
  }
});
// ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

const server = app.listen(PORT, HOST, () => {
  console.log(`서버가 http://${HOST}:${PORT} 에서 실행 중입니다.`);
});