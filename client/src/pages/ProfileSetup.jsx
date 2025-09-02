import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';

// 별점 표시 컴포넌트
const StarRating = ({ rating }) => {
  const fullStars = Math.round(rating || 0);
  return (
    <div className="star-rating">
      {'★★★★★'.slice(0, fullStars)}{'☆☆☆☆☆'.slice(fullStars)}
    </div>
  );
};

// 프로필 수정/등록 폼 컴포넌트
function ProfileForm({ user, existingProfile, onSave, onCancel }) {
  const [introduction, setIntroduction] = useState(existingProfile?.introduction || '');
  const [region, setRegion] = useState(existingProfile?.region || '');
  const [availableTime, setAvailableTime] = useState(existingProfile?.availableTime || '');
  const [experience, setExperience] = useState(existingProfile?.experience || '');
  const [desiredActivity, setDesiredActivity] = useState(existingProfile?.desiredActivity || '');
  const [profileImageUrl, setProfileImageUrl] = useState(existingProfile?.profileImageUrl || 'https://placehold.co/128x128/E0E0E0/333?text=?');
  const [tags, setTags] = useState(existingProfile?.tags || '');
  const [personality, setPersonality] = useState(existingProfile?.personality || '');
  
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

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
      tags,
      personality // 성향 데이터 추가
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
    <div className="form-container card">
      <form onSubmit={handleSubmit} style={{margin: 0, padding: 0, boxShadow: 'none'}}>
        <h3>프로필 사진</h3>
        <div className="profile-image-uploader">
          <img src={profileImageUrl} alt="Profile Preview" className="profile-picture-preview" />
          <button type="button" onClick={() => fileInputRef.current.click()} className="secondary">
            사진 변경하기
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageChange} 
            style={{ display: 'none' }} 
            accept="image/*" 
          />
        </div>

        <div className="form-group">
          <h3>나의 성향</h3>
          <div className="radio-group">
            <label>
              <input type="radio" value="active" checked={personality === 'active'} onChange={e => setPersonality(e.target.value)} />
              활발한 🏃
            </label>
            <label>
              <input type="radio" value="calm" checked={personality === 'calm'} onChange={e => setPersonality(e.target.value)} />
              차분한 ☕
            </label>
          </div>
        </div>

        {user.userType === 'youth' ? (
          <>
            <h3>청년 프로필 정보</h3>
            <div className="form-group">
              <label>자기소개</label>
              <textarea placeholder="자기소개" value={introduction} onChange={e => setIntroduction(e.target.value)} />
            </div>
            <div className="form-group">
              <label>활동 가능 지역</label>
              <input type="text" placeholder="활동 가능 지역" value={region} onChange={e => setRegion(e.target.value)} />
            </div>
            <div className="form-group">
              <label>활동 가능 시간</label>
              <input type="text" placeholder="활동 가능 시간" value={availableTime} onChange={e => setAvailableTime(e.target.value)} />
            </div>
            <div className="form-group">
              <label>활동 경험</label>
              <textarea placeholder="활동 경험" value={experience} onChange={e => setExperience(e.target.value)} />
            </div>
          </>
        ) : (
          <>
            <h3>어르신 프로필 정보</h3>
            <div className="form-group">
              <label>자기소개</label>
              <textarea placeholder="자기소개" value={introduction} onChange={e => setIntroduction(e.target.value)} />
            </div>
            <div className="form-group">
              <label>거주 지역</label>
              <input type="text" placeholder="거주 지역" value={region} onChange={e => setRegion(e.target.value)} />
            </div>
            <div className="form-group">
              <label>희망 활동</label>
              <input type="text" placeholder="희망 활동" value={desiredActivity} onChange={e => setDesiredActivity(e.target.value)} />
            </div>
          </>
        )}
        
        <div className="form-group">
          <h3>관심사 태그</h3>
          <input 
            type="text" 
            placeholder="쉼표(,)로 관심사를 구분하여 입력하세요." 
            value={tags} 
            onChange={e => setTags(e.target.value)} 
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="primary">저장하기</button>
          <button type="button" onClick={onCancel} className="secondary">취소</button>
        </div>
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
      <nav className="page-header">
        <Link to="/dashboard"><button className="secondary">← 대시보드</button></Link>
      </nav>
      <h1>마이페이지</h1>

      {isEditing ? (
        <ProfileForm user={user} existingProfile={profile} onSave={handleSave} onCancel={() => setIsEditing(false)} />
      ) : (
        <div>
          <div className="card profile-view">
            <h2>내 프로필 정보</h2>
            {profile ? (
              <>
                <img src={profile.profileImageUrl || 'https://placehold.co/128x128/E0E0E0/333?text=?'} alt="profile" className="profile-picture" />
                <p><strong>이름:</strong> {user.name}</p>
                <p><strong>자기소개:</strong> {profile.introduction}</p>
                <p><strong>지역:</strong> {profile.region}</p>
                <p><strong>성향:</strong> {profile.personality === 'active' ? '활발한 🏃' : '차분한 ☕'}</p>
                {user.userType === 'youth' ? (
                  <>
                    <p><strong>활동 가능 시간:</strong> {profile.availableTime}</p>
                    <p><strong>활동 경험:</strong> {profile.experience}</p>
                  </>
                ) : (
                  <p><strong>희망 활동:</strong> {profile.desiredActivity}</p>
                )}
                <div className="card-tags">
                  {profile.tags && profile.tags.split(',').map(tag => (
                    <span key={tag} className="tag">{tag.trim()}</span>
                  ))}
                </div>
                <button onClick={() => setIsEditing(true)} className="primary">프로필 수정하기</button>
              </>
            ) : (
               <p>아직 등록된 프로필이 없습니다. 프로필을 등록해주세요.</p>
            )}
          </div>

          <div className="card review-list-container">
            <h2>내가 받은 후기</h2>
            {reviews.length > 0 ? (
              reviews.map((review, index) => (
                <div key={index} className="review-card-simple">
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
