// client/src/pages/UserList.jsx (실제 매칭 스코어 적용)
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

// 매칭 스코어를 받아오는 커스텀 훅 (재사용을 위해 분리)
function useMatchScore(currentUser, otherUser) {
  const [score, setScore] = useState(null);
  useEffect(() => {
    if (currentUser && otherUser) {
      fetch(`/api/matches/score/${currentUser.id}/${otherUser.id}`)
        .then(res => res.json())
        .then(data => setScore(data.matchScore));
    }
  }, [currentUser, otherUser]);
  return score;
}

// 사용자 카드를 위한 별도 컴포넌트
function UserCard({ user, currentUser }) {
  const matchScore = useMatchScore(currentUser, user);
  const isAIRecommended = matchScore && matchScore >= 85;

  return (
    <Link to={`/users/${user.id}`} className="card-link">
      <div className="user-card-new" style={isAIRecommended ? {border: '2px solid var(--accent-orange)'} : {}}>
        <div className="card-header">
          {isAIRecommended && <span className="ai-badge">🔥 AI 추천</span>}
          {matchScore !== null ? 
            <span className="match-score">매칭도 {matchScore}%</span> :
            <span className="match-score">계산 중...</span>
          }
        </div>
        <div className="card-body">
          <img src={user.profileImageUrl || 'https://placehold.co/80x80/E0E0E0/333?text=?'} alt={user.name} className="profile-icon" style={{objectFit: 'cover', width: '80px', height: '80px'}} />
          <div className="card-info">
            <h3>{user.name}</h3>
            <p>{user.region}</p>
            <p style={{fontSize: '0.9rem', color: 'var(--text-dark)'}}>{user.introduction}</p>
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
      <p style={{color: 'var(--text-light)', marginBottom: '3rem'}}>
        나와 잘 맞는 새로운 친구를 만나보세요.
      </p>
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
