const express = require('express');
const app = express();
const knexConfig = require('./knexfile').development;
const knex = require('knex')(knexConfig);

console.log('--- [SERVER CODE VERSION: FINAL_RESET_AUG20] ---'); // 버전 확인용

const HOST = '127.0.0.1';
const PORT = 5000;

app.use(express.json());

// --- API 핸들러들 ---
app.post('/api/register', async (req, res) => {
    const { email, password, name, userType } = req.body;
    if (!email || !password || !name || !userType) { return res.status(400).json({ success: false, message: '모든 필드를 입력해주세요.' }); }
    try {
        const [userId] = await knex('users').insert({ email, password, name, userType });
        res.status(201).json({ success: true, userId: userId });
    } catch (error) { res.status(500).json({ success: false, message: '회원가입 중 오류' }); }
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) { return res.status(400).json({ success: false, message: '이메일과 비밀번호를 입력해주세요.' }); }
    try {
        const user = await knex('users').where({ email }).first();
        if (!user) { return res.status(404).json({ success: false, message: '존재하지 않는 사용자입니다.' }); }
        if (user.password !== password) { return res.status(401).json({ success: false, message: '비밀번호가 일치하지 않습니다.' }); }
        res.status(200).json({ success: true, userId: user.id, name: user.name, userType: user.userType });
    } catch (error) { res.status(500).json({ success: false, message: '로그인 중 오류' }); }
});

app.post('/api/profile', async (req, res) => {
  const { userId, introduction, region, availableTime, experience, desiredActivity } = req.body;
  if (!userId) {
    return res.status(400).json({ success: false, message: '사용자 ID가 필요합니다.' });
  }

  try {
    const profileData = { userId, introduction, region, availableTime, experience, desiredActivity };

    // 이미 프로필이 있는지 확인합니다.
    const existingProfile = await knex('profiles').where({ userId }).first();

    if (existingProfile) {
      // 프로필이 이미 있으면, UPDATE(수정)를 실행합니다.
      await knex('profiles').where({ userId }).update(profileData);
      res.status(200).json({ success: true, message: '프로필이 성공적으로 수정되었습니다.' });
    } else {
      // 프로필이 없으면, INSERT(생성)를 실행합니다.
      await knex('profiles').insert(profileData);
      res.status(201).json({ success: true, message: '프로필이 성공적으로 등록되었습니다.' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: '프로필 처리 중 오류 발생', error: error.message });
  }
});

app.get('/api/profile/check/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const profile = await knex('profiles').where({ userId }).first();
        res.json({ hasProfile: !!profile });
    } catch (error) { res.status(500).json({ message: '프로필 확인 중 오류' }); }
});

app.get('/api/users', async (req, res) => {
    const { userType } = req.query;
    const targetUserType = userType === 'youth' ? 'elderly' : 'youth';
    try {
        const users = await knex('users').join('profiles', 'users.id', '=', 'profiles.userId').where('users.userType', targetUserType).select('users.id', 'users.name', 'profiles.introduction', 'profiles.region');
        res.status(200).json(users);
    } catch (error) { res.status(500).json({ success: false, message: '사용자 목록 조회 중 오류' }); }
});

app.get('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const userProfile = await knex('users').join('profiles', 'users.id', 'profiles.userId').where('users.id', id).select('users.id', 'users.name', 'users.userType', 'profiles.*').first();
        if (userProfile) { res.json(userProfile); } else { res.status(404).json({ message: '사용자를 찾을 수 없습니다.' }); }
    } catch (error) { res.status(500).json({ message: '서버 오류' }); }
});

app.post('/api/matches/request', async (req, res) => {
  const { requesterId, receiverId } = req.body;
  console.log(`[API /api/matches/request] 요청 받음: requesterId=${requesterId}, receiverId=${receiverId}`);
  try {
    const [matchId] = await knex('matches').insert({ requesterId, receiverId, status: 'pending' });
    console.log(`[DB] 매칭 요청 저장 성공. 생성된 ID: ${matchId}`);
    res.status(201).json({ success: true, message: '매칭을 신청했습니다.' });
  } catch (error) {
    console.error('[DB] 매칭 요청 저장 실패:', error);
    res.status(500).json({ success: false, message: '매칭 신청 중 오류 발생' });
  }
});

app.get('/api/matches/received/:userId', async (req, res) => {
  const { userId } = req.params;
  console.log(`[API /api/matches/received] 요청 받음: userId=${userId}`);
  try {
    const requests = await knex('matches').join('users', 'matches.requesterId', 'users.id').where('matches.receiverId', userId).where('matches.status', 'pending').select('matches.id as matchId', 'users.name as requesterName');
    console.log(`[DB] userId=${userId}의 매칭 요청 조회 결과:`, requests);
    res.json(requests);
  } catch (error) {
    console.error('[DB] 매칭 요청 조회 실패:', error);
    res.status(500).json({ message: '매칭 요청 목록 조회 중 오류 발생' });
  }
});

app.post('/api/matches/respond', async (req, res) => {
    const { matchId, response } = req.body;
    try {
        await knex('matches').where({ id: matchId }).update({ status: response });
        res.json({ success: true, message: `요청을 ${response === 'accepted' ? '수락' : '거절'}했습니다.` });
    } catch (error) { res.status(500).json({ message: '응답 처리 중 오류' }); }
});


// [GET] /api/matches/accepted/:userId : 내가 성사시킨 매칭 목록 API
app.get('/api/matches/accepted/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const acceptedMatches = await knex('matches')
      .where(function() {
        this.where('requesterId', userId).orWhere('receiverId', userId)
      })
      .andWhere('status', 'accepted')
      .join('users as requester', 'matches.requesterId', 'requester.id')
      .join('users as receiver', 'matches.receiverId', 'receiver.id')
      .select(
        'matches.id as matchId',
        'requester.id as requesterId',
        'requester.name as requesterName',
        'receiver.id as receiverId',
        'receiver.name as receiverName'
      );
    res.json(acceptedMatches);
  } catch (error) {
    res.status(500).json({ message: '성사된 매칭 조회 중 오류' });
  }
});

// [POST] /api/activities : 활동 기록 API
app.post('/api/activities', async (req, res) => {
  const { matchId, activityDate, description } = req.body;
  try {
    const [activityId] = await knex('activities').insert({ matchId, activityDate, description });
    res.status(201).json({ success: true, message: '활동이 기록되었습니다.', activityId });
  } catch (error) {
    res.status(500).json({ success: false, message: '활동 기록 중 오류' });
  }
});

// [POST] /api/reviews : 후기(피드백) 저장 API
app.post('/api/reviews', async (req, res) => {
  const { activityId, reviewerId, revieweeId, rating, comment } = req.body;
  try {
    await knex('reviews').insert({ activityId, reviewerId, revieweeId, rating, comment });
    const activity = await knex('activities').where({ id: activityId }).first();
    if (activity) {
      await knex('matches').where({ id: activity.matchId }).update({ status: 'completed' });
    }
    res.status(201).json({ success: true, message: '소중한 후기를 남겨주셔서 감사합니다.' });
  } catch (error) {
    res.status(500).json({ success: false, message: '후기 저장 중 오류 발생' });
  }
});

// [GET] /api/reviews/:userId : 특정 사용자가 받은 후기 목록 조회 API
app.get('/api/reviews/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const reviews = await knex('reviews')
      .join('users', 'reviews.reviewerId', 'users.id') // 후기 작성자 정보를 위해 users 테이블과 조인
      .where('reviews.revieweeId', userId)
      .select(
        'reviews.rating',
        'reviews.comment',
        'users.name as reviewerName' // 후기 작성자의 이름
      );
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: '후기 목록 조회 중 오류 발생' });
  }
});


// --- 서버 실행 및 전역 에러 처리 ---
const server = app.listen(PORT, HOST, () => {
  console.log(`[서버 시작] 잇다 백엔드 서버가 http://${HOST}:${PORT} 에서 실행 중입니다.`);
});
process.on('uncaughtException', (err) => {
  console.error('!!! 예상치 못한 서버 오류 발생 !!!:', err);
});
