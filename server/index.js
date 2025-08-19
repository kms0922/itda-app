// server/index.js
const express = require('express');
const app = express();
const knex = require('knex')(require('./knexfile').development);

const HOST = '127.0.0.1';
const PORT = 5000;

app.use(express.json());

// ... (register API는 그대로) ...
app.post('/api/register', async (req, res) => {
  const { email, password, name, userType } = req.body;
  if (!email || !password || !name || !userType) {
    return res.status(400).json({ success: false, message: '모든 필드를 입력해주세요.' });
  }
  try {
    const [userId] = await knex('users').insert({ email, password, name, userType });
    res.status(201).json({ success: true, userId: userId });
  } catch (error) {
    res.status(500).json({ success: false, message: '회원가입 중 오류가 발생했습니다.', error: error.message });
  }
});


app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: '이메일과 비밀번호를 입력해주세요.' });
  }
  try {
    const user = await knex('users').where({ email: email }).first();
    if (!user) {
      return res.status(404).json({ success: false, message: '존재하지 않는 사용자입니다.' });
    }
    if (user.password !== password) {
      return res.status(401).json({ success: false, message: '비밀번호가 일치하지 않습니다.' });
    }
    // ▼▼▼ 로그인 성공 시 userId와 userType을 함께 응답 ▼▼▼
    res.status(200).json({ 
      success: true, 
      message: '로그인 성공', 
      userId: user.id, 
      name: user.name, 
      userType: user.userType 
    });
    // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲
  } catch (error) {
    res.status(500).json({ success: false, message: '로그인 중 오류가 발생했습니다.', error: error.message });
  }
});

// ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼
// [POST] /api/profile : 프로필 정보 저장 API (신규 추가)
app.post('/api/profile', async (req, res) => {
  const { userId, introduction, region, availableTime, experience, desiredActivity } = req.body;

  if (!userId) {
    return res.status(400).json({ success: false, message: '사용자 ID가 필요합니다.' });
  }

  try {
    // 혹시 이미 프로필이 있는지 확인 (선택적)
    const existingProfile = await knex('profiles').where({ userId }).first();
    if (existingProfile) {
      return res.status(409).json({ success: false, message: '이미 프로필이 존재합니다.' });
    }

    // profiles 테이블에 데이터 삽입
    await knex('profiles').insert({
      userId,
      introduction,
      region,
      availableTime,
      experience,
      desiredActivity
    });

    res.status(201).json({ success: true, message: '프로필이 성공적으로 등록되었습니다.' });
  } catch (error) {
    res.status(500).json({ success: false, message: '프로필 저장 중 오류 발생', error: error.message });
  }
});
// ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

const server = app.listen(PORT, HOST, () => {
  console.log(`서버가 http://${HOST}:${PORT} 에서 실행 중입니다.`);
});
