import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../App.css';

// ▼▼▼ 이 컴포넌트 정의가 누락되었습니다! ▼▼▼
// 별점 표시 컴포넌트
const StarRating = ({ rating }) => {
  const fullStars = Math.round(rating || 0);
  return (
    <div className="star-rating">
      {'★★★★★'.slice(0, fullStars)}{'☆☆☆☆☆'.slice(fullStars)}
    </div>
  );
};
// ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

function UserProfile() {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) { setCurrentUser(JSON.parse(storedUser)); }
    // 상세 프로필 정보를 불러옵니다 (통계 포함)
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

  if (!profile) return <div className="App"><h2>프로필 로딩 중...</h2></div>;

  return (
    <div className="App profile-page-container">
      <header className="profile-header">
        <div className="profile-picture-container">
          <img 
            src={profile.profileImageUrl || 'https://placehold.co/128x128/E0E0E0/333?text=?'} 
            alt={profile.name} 
            className="profile-picture-large"
          />
        </div>
      </header>

      <main className="profile-content">
        <div style={{textAlign: 'center', marginBottom: '2rem'}}>
          <h1 style={{marginBottom: '0.5rem'}}>{profile.name}</h1>
          <p style={{color: 'var(--text-light)', marginBottom: '1rem'}}>{profile.region}</p>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'}}>
            <StarRating rating={profile.avgRating} />
            <span style={{color: 'var(--text-light)', fontSize: '1rem'}}>
              {profile.avgRating} ({profile.reviewCount}개의 후기)
            </span>
          </div>
        </div>

        <section className="profile-section">
          <h2>자기소개</h2>
          <p>{profile.introduction}</p>
        </section>

        <section className="profile-section">
          <h2>관심사 & 활동</h2>
          <div className="card-tags">
            {profile.tags && profile.tags.split(',').map(tag => (
              <span key={tag} className="tag">{tag.trim()}</span>
            ))}
          </div>
        </section>
        
        <section className="profile-section">
          <h2>기본 정보</h2>
          {profile.userType === 'youth' ? (
            <>
              <p><strong>활동 가능 시간:</strong> {profile.availableTime}</p>
              <p><strong>활동 경험:</strong> {profile.experience}</p>
            </>
          ) : (
            <p><strong>희망 활동:</strong> {profile.desiredActivity}</p>
          )}
        </section>

        <div className="profile-actions">
          <Link to={`/users/${profile.id}/reviews`}>
            <button className="secondary" style={{width: '100%'}}>{profile.name}님이 받은 후기 보기</button>
          </Link>
          <button onClick={handleMatchRequest} className="accent" style={{width: '100%'}}>매칭 신청하기</button>
        </div>
      </main>
      
      <div className="page-footer">
        <Link to="/users"><button className="secondary">← 목록으로</button></Link>
      </div>
    </div>
  );
}
export default UserProfile;
