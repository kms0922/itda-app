// client/src/pages/ProfileSetup.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';

// 청년용 프로필 폼 컴포넌트
function YouthProfileForm({ userId }) {
  const [introduction, setIntroduction] = useState('');
  const [region, setRegion] = useState('');
  const [availableTime, setAvailableTime] = useState('');
  const [experience, setExperience] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, introduction, region, availableTime, experience })
    });
    if (response.ok) {
      alert('프로필 등록 성공!');
      navigate('/'); // 성공 시 홈으로 이동
    } else {
      alert('프로필 등록 실패');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>청년 프로필 등록</h3>
      <textarea placeholder="자기소개" value={introduction} onChange={e => setIntroduction(e.target.value)} />
      <input type="text" placeholder="활동 가능 지역" value={region} onChange={e => setRegion(e.target.value)} />
      <input type="text" placeholder="활동 가능 시간" value={availableTime} onChange={e => setAvailableTime(e.target.value)} />
      <textarea placeholder="활동 경험" value={experience} onChange={e => setExperience(e.target.value)} />
      <button type="submit">등록하기</button>
    </form>
  );
}

// 어르신용 프로필 폼 컴포넌트
function ElderlyProfileForm({ userId }) {
  const [introduction, setIntroduction] = useState('');
  const [region, setRegion] = useState('');
  const [desiredActivity, setDesiredActivity] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, introduction, region, desiredActivity })
    });
    if (response.ok) {
      alert('프로필 등록 성공!');
      navigate('/'); // 성공 시 홈으로 이동
    } else {
      alert('프로필 등록 실패');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>어르신 프로필 등록</h3>
      <textarea placeholder="자기소개 (예: 어떤 이야기를 나누고 싶으신가요?)" value={introduction} onChange={e => setIntroduction(e.target.value)} />
      <input type="text" placeholder="거주 지역" value={region} onChange={e => setRegion(e.target.value)} />
      <input type="text" placeholder="희망 활동 (예: 말벗, 산책, 장보기)" value={desiredActivity} onChange={e => setDesiredActivity(e.target.value)} />
      <button type="submit">등록하기</button>
    </form>
  );
}

function ProfileSetup() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  if (!user) {
    return (
      <div className="App">
        <p>로그인 정보가 없습니다. 로그인 페이지로 이동해주세요.</p>
        <Link to="/login"><button>로그인 하러가기</button></Link>
      </div>
    );
  }

  return (
    <div className="App">
      <h1>프로필 등록</h1>
      <p>안녕하세요, {user.name}님! 상세 프로필을 등록해주세요.</p>
      {/* ▼▼▼ 사용자 유형에 따라 다른 폼을 보여주는 부분 ▼▼▼ */}
      {user.userType === 'youth' && <YouthProfileForm userId={user.id} />}
      {user.userType === 'elderly' && <ElderlyProfileForm userId={user.id} />}
      {/* ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲ */}
    </div>
  );
}

export default ProfileSetup;
