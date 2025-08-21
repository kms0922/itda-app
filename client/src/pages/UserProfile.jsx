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
      <h1>{profile.name}님의 프로필</h1>
      <div className="card">
        <p><strong>자기소개:</strong> {profile.introduction}</p>
        <p><strong>지역:</strong> {profile.region}</p>
        {profile.userType === 'youth' ? (
          <>
            <p><strong>활동 가능 시간:</strong> {profile.availableTime}</p>
            <p><strong>활동 경험:</strong> {profile.experience}</p>
          </>
        ) : ( <p><strong>희망 활동:</strong> {profile.desiredActivity}</p> )}
        <div style={{textAlign: 'center', marginTop: '1.5rem'}}>
          <Link to={`/users/${profile.id}/reviews`}><button className="secondary">{profile.name}님이 받은 후기 보기</button></Link>
          <button onClick={handleMatchRequest} className="accent">매칭 신청하기</button>
        </div>
      </div>
      <div className="page-footer">
        <Link to="/users"><button className="secondary">← 목록으로</button></Link>
      </div>
    </div>
  );
}
export default UserProfile;
