import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

// 별점 표시 컴포넌트
const StarRating = ({ rating }) => {
  const fullStars = Math.round(rating || 0);
  return (
    <div className="star-rating" style={{fontSize: '1rem', color: '#ffc107'}}>
      {'★★★★★'.slice(0, fullStars)}{'☆☆☆☆☆'.slice(fullStars)}
    </div>
  );
};

// 매칭 스코어를 받아오는 커스텀 훅
function useMatchScore(currentUser, otherUser) {
  const [score, setScore] = useState(null);
  useEffect(() => {
    if (currentUser && otherUser) {
      fetch(`/api/matches/score/${currentUser.id}/${otherUser.id}`)
        .then(res => res.ok ? res.json() : { matchScore: 'N/A' })
        .then(data => setScore(data.matchScore))
        .catch(() => setScore('N/A'));
    }
  }, [currentUser, otherUser]);
  return score;
}

// 사용자 카드를 위한 별도 컴포넌트
function UserCard({ user, currentUser }) {
  const matchScore = useMatchScore(currentUser, user);
  const avgRating = user.avgRating ? parseFloat(user.avgRating).toFixed(1) : 'N/A';

  return (
    <Link to={`/users/${user.id}`} className="card-link">
      <div className="user-card-new">
        {/* ▼▼▼ 매칭 스코어 박스 (사진 위) ▼▼▼ */}
        <div className="match-score-badge">
          {matchScore !== null ? `매칭도 ${matchScore}%` : '분석 중...'}
        </div>
        {/* ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲ */}
        <div className="card-body">
          <img 
            src={user.profileImageUrl || 'https://placehold.co/80x80/E0E0E0/333?text=?'} 
            alt={user.name} 
            className="profile-icon"
          />
          <div className="card-info">
            <h3>{user.name}</h3>
            <p>{user.region}</p>
            {/* ▼▼▼ 별점 및 후기 정보 다시 추가 ▼▼▼ */}
            <div className="rating-info">
              <StarRating rating={user.avgRating} />
              <span>
                {avgRating} ({user.reviewCount}개 후기)
              </span>
            </div>
            {/* ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲ */}
          </div>
        </div>
        <div className="card-tags">
          {user.tags && user.tags.split(',').map(tag => (
            <span key={tag} className="tag">{tag.trim()}</span>
          ))}
        </div>
      </div>
    </Link>
  );
}


function UserList() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setCurrentUser(parsedUser);
      fetch(`/api/users?userType=${parsedUser.userType}`)
        .then(res => res.json())
        .then(data => setUsers(data));
    }
  }, []);

  return (
    <div className="App">
      <h1>{currentUser?.userType === 'youth' ? '어르신 찾기' : '청년 찾기'}</h1>
      <p className="page-subtitle">나와 잘 맞는 새로운 친구를 만나보세요.</p>
      <div className="user-list-container">
        {users.length > 0 && currentUser ? (
          users.map(user => <UserCard key={user.id} user={user} currentUser={currentUser} />)
        ) : (
          <p>매칭할 수 있는 사용자가 아직 없습니다.</p>
        )}
      </div>
      <div className="page-footer">
        <Link to="/dashboard"><button className="secondary">← 대시보드로</button></Link>
      </div>
    </div>
  );
}

export default UserList;
