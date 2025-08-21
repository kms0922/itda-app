// client/src/pages/Dashboard.jsx (세대별 맞춤 디자인 적용)
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';

// 청년용 대시보드 컴포넌트
const YouthDashboard = ({ user, handleLogout }) => {
  return (
    <div className="dashboard-container">
      <header className="youth-header">
        <h1 style={{fontSize: '1.5rem', color: 'white'}}>안녕하세요, {user.name}님! 🌟</h1>
        <p style={{color: '#e0e0e0', fontSize: '0.9rem'}}>오늘도 따뜻한 마음을 나눠주세요.</p>
      </header>

      <div className="stat-card-grid">
        <div className="stat-card">
          <div className="stat-value">12</div>
          <div className="stat-label">총 만남 횟수</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">4.9</div>
          <div className="stat-label">평균 평점</div>
        </div>
      </div>

      <div style={{padding: '0 1rem'}}>
        <Link to="/users"><button className="primary" style={{width: '100%'}}>어르신 찾기</button></Link>
        <Link to="/my-matches"><button className="secondary" style={{width: '100%'}}>나의 매칭 현황</button></Link>
        <Link to="/match-requests"><button className="secondary" style={{width: '100%'}}>받은 매칭 요청</button></Link>
        <Link to="/profile-setup"><button className="secondary" style={{width: '100%'}}>내 프로필 관리</button></Link>
      </div>

      <div className="page-footer">
        <button onClick={handleLogout} className="secondary">로그아웃</button>
      </div>
    </div>
  );
};

// 어르신용 대시보드 컴포넌트
const ElderlyDashboard = ({ user, handleLogout }) => {
  return (
    <div className="dashboard-container">
      <header className="senior-header">
        <h1 style={{fontSize: '1.75rem', color: 'white'}}>안녕하세요! 👋</h1>
        <h2 style={{fontSize: '1.75rem', color: 'white', fontWeight: 'bold'}}>{user.name}님</h2>
      </header>

      <div className="senior-main-card">
        <h3 style={{fontSize: '1.25rem', fontWeight: 'bold', textAlign: 'center'}}>나와 잘 맞는 청년을 찾아보세요!</h3>
        <p style={{textAlign: 'center', color: 'var(--text-light)', marginBottom: '1.5rem'}}>아래 버튼을 눌러 시작할 수 있습니다.</p>
        <Link to="/users"><button className="accent" style={{width: '100%', padding: '1rem', fontSize: '1.2rem'}}>청년 찾기</button></Link>
      </div>

      <div style={{padding: '0 1rem'}}>
        <Link to="/my-matches" className="card-link">
          <div className="senior-menu-button card">🤝 나의 매칭 현황</div>
        </Link>
        <Link to="/match-requests" className="card-link">
          <div className="senior-menu-button card">📩 받은 매칭 요청</div>
        </Link>
        <Link to="/profile-setup" className="card-link">
          <div className="senior-menu-button card">👤 내 프로필 관리</div>
        </Link>
      </div>

      <div className="page-footer">
        <button onClick={handleLogout} className="secondary">로그아웃</button>
      </div>

      {/* 어르신용 하단 네비게이션 (시안 참고) */}
      <footer className="senior-nav">
        <button className="active">🏠<span style={{fontSize: '0.75rem'}}>홈</span></button>
        <Link to="/users"><button>👥<span style={{fontSize: '0.75rem'}}>청년찾기</span></button></Link>
        <Link to="/profile-setup"><button>👤<span style={{fontSize: '0.75rem'}}>내정보</span></button></Link>
      </footer>
    </div>
  );
};

// 메인 대시보드 라우팅 컴포넌트
function Dashboard() {
  const [user, setUser] = useState(null);
  const [hasProfile, setHasProfile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);

    fetch(`/api/profile/check/${parsedUser.id}`)
      .then(res => res.json())
      .then(data => {
        setHasProfile(data.hasProfile);
        if (!data.hasProfile) {
          // 프로필이 없으면 바로 등록 페이지로 보냄
          navigate('/profile-setup');
        }
        setIsLoading(false);
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (isLoading || !user) {
    return <div className="App"><h2>정보를 불러오는 중...</h2></div>;
  }

  // 사용자 유형에 따라 다른 대시보드를 보여줌
  if (user.userType === 'youth') {
    return <YouthDashboard user={user} handleLogout={handleLogout} />;
  } else {
    return <ElderlyDashboard user={user} handleLogout={handleLogout} />;
  }
}

export default Dashboard;
