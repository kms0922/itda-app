import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

function UserList() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // 1. 로그인한 사용자 정보 가져오기
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setCurrentUser(parsedUser);

      // 2. 로그인한 사용자의 유형에 따라 반대 유형 사용자 목록 요청
      fetch(`/api/users?userType=${parsedUser.userType}`)
        .then(res => res.json())
        .then(data => setUsers(data));
    }
  }, []);

  return (
    <div className="App">
      <nav style={{ padding: '1rem', textAlign: 'left' }}>
        <Link to="/dashboard"><button>← 대시보드로 돌아가기</button></Link>
      </nav>
      <h1>{currentUser?.userType === 'youth' ? '어르신 목록' : '청년 목록'}</h1>
      <div className="user-list">
        {users.length > 0 ? (
          users.map(user => (
            // ▼▼▼ 이 부분이 Link 태그로 감싸졌습니다 ▼▼▼
            <Link to={`/users/${user.id}`} key={user.id} className="user-card-link">
              <div className="user-card">
                <h3>{user.name}</h3>
                <p><strong>지역:</strong> {user.region}</p>
                <p>{user.introduction}</p>
                <button>프로필 보기</button>
              </div>
            </Link>
            // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲
          ))
        ) : (
          <p>매칭할 수 있는 사용자가 아직 없습니다.</p>
        )}
      </div>
    </div>
  );
}

export default UserList;
