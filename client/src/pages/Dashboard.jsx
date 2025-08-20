// client/src/pages/Dashboard.jsx (전체 코드)
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [hasProfile, setHasProfile] = useState(null); // 프로필 존재 여부 상태
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      // 로그인 정보가 없으면 로그인 페이지로 보냄
      navigate('/login');
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);

    // 백엔드에 프로필 존재 여부 확인 요청
    fetch(`/api/profile/check/${parsedUser.id}`)
      .then(res => res.json())
      .then(data => {
        setHasProfile(data.hasProfile);
        setIsLoading(false); // 로딩 완료
      })
      .catch(error => {
        console.error("프로필 확인 실패:", error);
        setIsLoading(false);
      });
  }, [navigate]);

  // 로그아웃 함수
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (isLoading) {
    return <div className="App"><h2>정보를 불러오는 중...</h2></div>;
  }

  return (
    <div className="App">
      <h1>{user.name}님, 환영합니다!</h1>

      {/* ▼▼▼ 프로필 존재 여부에 따라 다른 내용을 보여줌 ▼▼▼ */}
      {hasProfile ? (
        // 프로필이 있는 사용자에게 보여줄 내용
        <div className="dashboard-menu">
          <p>잇다와 함께 따뜻한 연결을 만들어보세요.</p>
          <Link to="/users"><button>
            {user.userType === 'youth' ? '어르신 찾기' : '청년 찾기'}
          </button></Link>
          {/* ▼▼▼ '받은 매칭 요청' 버튼 추가 ▼▼▼ */}
          <Link to="/match-requests"><button>받은 매칭 요청 보기</button></Link>
          <Link to="/profile-setup"><button>내 프로필 관리</button></Link>
        </div>
      ) : (
        // 프로필이 없는 사용자에게 보여줄 내용
        <div className="profile-prompt">
          <p>매칭을 시작하기 전에, 먼저 상세 프로필을 등록해주세요!</p>
          <Link to="/profile-setup"><button>프로필 등록하러 가기</button></Link>
        </div>
      )}
      {/* ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲ */}

      <button onClick={handleLogout} className="logout-button">로그아웃</button>
    </div>
  );
}

export default Dashboard;
