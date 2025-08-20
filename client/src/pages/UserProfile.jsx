// client/src/pages/UserProfile.jsx (최종 버전)
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../App.css';

function UserProfile() {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) { setCurrentUser(JSON.parse(storedUser)); }
    fetch(`/api/users/${userId}`).then(res => res.json()).then(data => setProfile(data));
  }, [userId]);

  const handleMatchRequest = async () => {
    try {
      if (!currentUser || !profile) { return alert('사용자 정보가 올바르지 않습니다.'); }
      const response = await fetch('/api/matches/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requesterId: currentUser.id, receiverId: profile.id })
      });
      if (!response.ok) { throw new Error(`HTTP 에러! 상태: ${response.status}`); }
      const data = await response.json();
      alert(data.message);
    } catch (error) {
      alert('매칭 신청 중 오류가 발생했습니다.');
    }
  };

  if (!profile) return <div className="App">프로필 로딩 중...</div>;

  return (
    <div className="App">
      <nav style={{ padding: '1rem', textAlign: 'left' }}><Link to="/users"><button>← 목록으로</button></Link></nav>
      <h1>{profile.name}님의 프로필</h1>
      <div className="profile-details">
        <p><strong>자기소개:</strong> {profile.introduction}</p>
        <p><strong>지역:</strong> {profile.region}</p>
        {profile.userType === 'youth' ? (
          <>
            <p><strong>활동 가능 시간:</strong> {profile.availableTime}</p>
            <p><strong>활동 경험:</strong> {profile.experience}</p>
          </>
        ) : ( <p><strong>희망 활동:</strong> {profile.desiredActivity}</p> )}
        <button onClick={handleMatchRequest}>매칭 신청하기</button>
      </div>
    </div>
  );
}
export default UserProfile;
