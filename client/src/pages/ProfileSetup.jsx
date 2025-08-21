import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';

// 별점 표시 컴포넌트
const StarRating = ({ rating }) => (
  <div className="star-rating">
    {'★★★★★'.slice(0, rating)}{'☆☆☆☆☆'.slice(rating)}
  </div>
);

// 프로필 수정/등록 폼 컴포넌트
function ProfileForm({ user, existingProfile, onSave, onCancel }) {
  const [introduction, setIntroduction] = useState(existingProfile?.introduction || '');
  const [region, setRegion] = useState(existingProfile?.region || '');
  const [availableTime, setAvailableTime] = useState(existingProfile?.availableTime || '');
  const [experience, setExperience] = useState(existingProfile?.experience || '');
  const [desiredActivity, setDesiredActivity] = useState(existingProfile?.desiredActivity || '');
  const [profileImageUrl, setProfileImageUrl] = useState(existingProfile?.profileImageUrl || 'https://placehold.co/128x128/E0E0E0/333?text=?');
  const [tags, setTags] = useState(existingProfile?.tags || '');

  const avatars = [
    'https://placehold.co/128x128/FFC857/333?text=😊',
    'https://placehold.co/128x128/E9724C/fff?text=😃',
    'https://placehold.co/128x128/C5283D/fff?text=😄',
    'https://placehold.co/128x128/48A9A6/fff?text=😎',
    'https://placehold.co/128x128/274C3A/fff?text=🙂',
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const profileData = { 
      userId: user.id, 
      introduction, 
      region, 
      availableTime, 
      experience, 
      desiredActivity, 
      profileImageUrl, 
      tags 
    };
    
    const response = await fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData),
    });
    const data = await response.json();
    alert(data.message);
    if (data.success) {
      onSave();
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} style={{margin: 0, padding: 0, boxShadow: 'none'}}>
        <h3>프로필 사진 선택</h3>
        <div className="avatar-selector">
          {avatars.map(avatar => (
            <img 
              key={avatar} 
              src={avatar} 
              alt="avatar" 
              className={profileImageUrl === avatar ? 'selected' : ''}
              onClick={() => setProfileImageUrl(avatar)} 
            />
          ))}
        </div>

        {user.userType === 'youth' ? (
          <>
            <h3>청년 프로필 정보</h3>
            <textarea placeholder="자기소개" value={introduction} onChange={e => setIntroduction(e.target.value)} />
            <input type="text" placeholder="활동 가능 지역" value={region} onChange={e => setRegion(e.target.value)} />
            <input type="text" placeholder="활동 가능 시간" value={availableTime} onChange={e => setAvailableTime(e.target.value)} />
            <textarea placeholder="활동 경험" value={experience} onChange={e => setExperience(e.target.value)} />
          </>
        ) : (
          <>
            <h3>어르신 프로필 정보</h3>
            <textarea placeholder="자기소개" value={introduction} onChange={e => setIntroduction(e.target.value)} />
            <input type="text" placeholder="거주 지역" value={region} onChange={e => setRegion(e.target.value)} />
            <input type="text" placeholder="희망 활동" value={desiredActivity} onChange={e => setDesiredActivity(e.target.value)} />
          </>
        )}
        
        <h3>관심사 태그</h3>
        <input 
          type="text" 
          placeholder="쉼표(,)로 관심사를 구분하여 입력하세요." 
          value={tags} 
          onChange={e => setTags(e.target.value)} 
        />

        <button type="submit" className="primary">저장하기</button>
        <button type="button" onClick={onCancel} className="secondary">취소</button>
      </form>
    </div>
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
    fetch(`/api/users/${currentUser.id}`)
      .then(res => res.ok ? res.json() : Promise.reject(res))
      .then(data => setProfile(data))
      .catch(() => {
        setProfile(null);
        setIsEditing(true);
      });
    
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
    setIsEditing(false);
    fetchData(user);
  };

  if (isLoading || !user) {
    return <div className="App"><h2>로딩 중...</h2></div>;
  }

  return (
    <div className="App">
      <h1>마이페이지</h1>
      {isEditing ? (
        <ProfileForm user={user} existingProfile={profile} onSave={handleSave} onCancel={() => setIsEditing(false)} />
      ) : (
        <div>
          <div className="card">
            <h2>내 프로필 정보</h2>
            {profile ? (
              <>
                <img src={profile.profileImageUrl || 'https://placehold.co/128x128/E0E0E0/333?text=?'} alt="profile" className="profile-picture" />
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
                <div className="card-tags" style={{justifyContent: 'center', margin: '1rem 0'}}>
                  {profile.tags && profile.tags.split(',').map(tag => (
                    <span key={tag} className="tag">{tag.trim()}</span>
                  ))}
                </div>
                <div style={{textAlign: 'center', marginTop: '1rem'}}>
                  <button onClick={() => setIsEditing(true)} className="primary">프로필 수정하기</button>
                </div>
              </>
            ) : (
              <p>아직 등록된 프로필이 없습니다.</p>
            )}
          </div>
          <div className="card">
            <h2>내가 받은 후기</h2>
            {reviews.length > 0 ? (
              reviews.map((review, index) => (
                <div key={index} style={{borderBottom: '1px solid #eee', paddingBottom: '1rem', marginBottom: '1rem'}}>
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
      <div className="page-footer">
        <Link to="/dashboard"><button className="secondary">← 대시보드로</button></Link>
      </div>
    </div>
  );
}

export default ProfileSetup;
