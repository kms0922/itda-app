// client/src/pages/ProfileSetup.jsx (전체 리팩토링 코드)
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';

// 별점 표시 컴포넌트
const StarRating = ({ rating }) => (
  <div className="star-rating">
    {'★★★★★'.slice(0, rating)}{'☆☆☆☆☆'.slice(rating)}
  </div>
);

// 프로필 수정 폼 컴포넌트 (기존 로직 재활용)
function ProfileForm({ user, existingProfile, onSave }) {
  const [introduction, setIntroduction] = useState(existingProfile?.introduction || '');
  const [region, setRegion] = useState(existingProfile?.region || '');
  // ... 각 사용자 유형에 맞는 상태 ...
  const [availableTime, setAvailableTime] = useState(existingProfile?.availableTime || '');
  const [experience, setExperience] = useState(existingProfile?.experience || '');
  const [desiredActivity, setDesiredActivity] = useState(existingProfile?.desiredActivity || '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const profileData = user.userType === 'youth' ? 
      { userId: user.id, introduction, region, availableTime, experience } : 
      { userId: user.id, introduction, region, desiredActivity };

    const response = await fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData),
    });
    const data = await response.json();
    alert(data.message);
    if (data.success) {
      onSave(); // 저장 성공 시 부모 컴포넌트에 알림
    }
  };

  return (
    <form onSubmit={handleSubmit} className="profile-form">
      {user.userType === 'youth' ? (
        <>
          <h3>청년 프로필 수정</h3>
          <textarea placeholder="자기소개" value={introduction} onChange={e => setIntroduction(e.target.value)} />
          <input type="text" placeholder="활동 가능 지역" value={region} onChange={e => setRegion(e.target.value)} />
          <input type="text" placeholder="활동 가능 시간" value={availableTime} onChange={e => setAvailableTime(e.target.value)} />
          <textarea placeholder="활동 경험" value={experience} onChange={e => setExperience(e.target.value)} />
        </>
      ) : (
        <>
          <h3>어르신 프로필 수정</h3>
          <textarea placeholder="자기소개" value={introduction} onChange={e => setIntroduction(e.target.value)} />
          <input type="text" placeholder="거주 지역" value={region} onChange={e => setRegion(e.target.value)} />
          <input type="text" placeholder="희망 활동" value={desiredActivity} onChange={e => setDesiredActivity(e.target.value)} />
        </>
      )}
      <button type="submit">저장하기</button>
    </form>
  );
}

// 메인 '마이페이지' 컴포넌트
function ProfileSetup() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchData = (currentUser) => {
    setIsLoading(true);
    // 1. 내 프로필 정보 가져오기
    fetch(`/api/users/${currentUser.id}`)
      .then(res => res.ok ? res.json() : Promise.reject(res))
      .then(data => setProfile(data))
      .catch(() => {
        // 프로필이 없으면(404) 바로 수정 모드로 진입
        setProfile(null);
        setIsEditing(true);
      });

    // 2. 내가 받은 후기 목록 가져오기
    fetch(`/api/reviews/${currentUser.id}`)
      .then(res => res.json())
      .then(data => setReviews(data));

    setIsLoading(false);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchData(parsedUser);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleSave = () => {
    setIsEditing(false); // 수정 모드 종료
    fetchData(user); // 최신 정보 다시 불러오기
  };

  if (isLoading || !user) {
    return <div className="App"><h2>로딩 중...</h2></div>;
  }

  return (
    <div className="App">
      <nav style={{ padding: '1rem', textAlign: 'left' }}><Link to="/dashboard"><button>← 대시보드</button></Link></nav>
      <h1>마이페이지</h1>

      {isEditing ? (
        // 수정 모드
        <div>
          <ProfileForm user={user} existingProfile={profile} onSave={handleSave} />
          <button onClick={() => setIsEditing(false)}>취소</button>
        </div>
      ) : (
        // 보기 모드
        <div>
          <div className="profile-view">
            <h2>내 프로필 정보</h2>
            {profile ? (
              <>
                <p><strong>이름:</strong> {user.name}</p>
                <p><strong>자기소개:</strong> {profile.introduction}</p>
                <p><strong>지역:</strong> {profile.region}</p>
                {user.userType === 'youth' ? (
                  <>
                    <p><strong>활동 가능 시간:</strong> {profile.availableTime}</p>
                    <p><strong>활동 경험:</strong> {profile.experience}</p>
                  </>
                ) : (
                  <p><strong>희망 활동:</strong> {profile.desiredActivity}</p>
                )}
                <button onClick={() => setIsEditing(true)}>프로필 수정하기</button>
              </>
            ) : (
              <p>아직 등록된 프로필이 없습니다.</p>
            )}
          </div>

          <div className="review-list-container">
            <h2>내가 받은 후기</h2>
            {reviews.length > 0 ? (
              reviews.map((review, index) => (
                <div key={index} className="review-card">
                  <h4>{review.reviewerName}님의 후기</h4>
                  <StarRating rating={review.rating} />
                  <p>"{review.comment}"</p>
                </div>
              ))
            ) : (
              <p>아직 받은 후기가 없습니다.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileSetup;
