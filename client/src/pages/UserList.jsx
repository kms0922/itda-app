import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

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

  // 임시로 AI 추천 데이터를 생성하는 함수
  const getMockData = (user) => {
    const isAIRecommended = user.id % 2 === 0;
    const matchScore = 75 + (user.id * 3) % 20;
    return { isAIRecommended, matchScore };
  };

  return (
    <div className="App">
      <h1>{currentUser?.userType === 'youth' ? '어르신 찾기' : '청년 찾기'}</h1>
      <p style={{color: 'var(--text-light)', marginBottom: '3rem'}}>
        {currentUser?.userType === 'youth' ? 
          '함께 따뜻한 시간을 보낼 어르신을 찾아보세요.' : 
          '나와 잘 맞는 새로운 친구를 만나보세요.'}
      </p>
      <div className="user-list-container">
        {users.length > 0 ? (
          users.map(user => {
            const mockData = getMockData(user);
            return (
              <Link to={`/users/${user.id}`} key={user.id} className="card-link">
                <div className="user-card-new" style={mockData.isAIRecommended ? {border: '2px solid var(--accent-orange)'} : {}}>
                  <div className="card-header">
                    {mockData.isAIRecommended && <span className="ai-badge">🔥 AI 추천</span>}
                    <span className="match-score">매칭도 {mockData.matchScore}%</span>
                  </div>
                  <div className="card-body">
                    <img 
                      src={user.profileImageUrl || 'https://placehold.co/80x80/E0E0E0/333?text=?'} 
                      alt={user.name} 
                      className="profile-icon" 
                      style={{objectFit: 'cover', width: '80px', height: '80px'}}
                    />
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
          })
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
