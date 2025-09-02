// client/src/pages/UserList.jsx (신뢰 시스템 UI 적용)
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const StarRating = ({ rating }) => {
  const fullStars = Math.round(rating || 0);
  return (
    <div className="star-rating" style={{fontSize: '1rem', color: '#ffc107'}}>
      {'★★★★★'.slice(0, fullStars)}{'☆☆☆☆☆'.slice(fullStars)}
    </div>
  );
};

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
      <p className="page-subtitle">신뢰할 수 있는 파트너를 찾아보세요.</p>
      <div className="user-list-container">
        {users.length > 0 ? (
          users.map(user => {
            const avgRating = user.avgRating ? parseFloat(user.avgRating).toFixed(1) : 'N/A';
            return (
              <Link to={`/users/${user.id}`} key={user.id} className="card-link">
                <div className="user-card-new">
                  <div className="card-body">
                    <img src={user.profileImageUrl || 'https://placehold.co/80x80/E0E0E0/333?text=?'} alt={user.name} className="profile-icon"/>
                    <div className="card-info">
                      <h3>{user.name}</h3>
                      <p>{user.region}</p>
                      <div className="rating-info">
                        <StarRating rating={user.avgRating} />
                        <span>
                          {avgRating} ({user.reviewCount}개 후기)
                        </span>
                      </div>
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
