// client/src/App.jsx (수정 후 전체 코드)
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import ProfileSetup from './pages/ProfileSetup';
import Dashboard from './pages/Dashboard';
import UserList from './pages/UserList';
import UserProfile from './pages/UserProfile';
import MatchRequests from './pages/MatchRequests';
import MyMatches from './pages/MyMatches';
import Reviews from './pages/Reviews';
import './App.css';

// 시작 페이지(랜딩 페이지) 컴포넌트
function Home() {
  return (
    <div className="App">
      {/* 로고 및 헤더 */}
      <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <svg width="80" height="80" viewBox="0 0 80 80" style={{ margin: '0 auto 1.5rem' }}>
          <circle cx="25" cy="40" r="15" fill="#274C3A" opacity="0.8"/>
          <circle cx="55" cy="40" r="15" fill="#FF7F50" opacity="0.8"/>
          <path d="M25 40 Q40 25 55 40" stroke="#274C3A" strokeWidth="3" fill="none"/>
          <circle cx="40" cy="32" r="3" fill="#FF7F50"/>
        </svg>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#274C3A', marginBottom: '1rem' }}>잇:다</h1>
        <p style={{ fontSize: '1.25rem', color: '#666', marginBottom: '0.5rem' }}>마음과 마음을 잇습니다</p>
        <p style={{ fontSize: '1rem', color: '#888' }}>AI 기술로 세대를 연결하는 정서 돌봄 플랫폼</p>
      </div>

      {/* 시작 버튼들 (수정된 부분) */}
      <div style={{ marginBottom: '4rem', width: '100%', maxWidth: '400px', margin: '0 auto 4rem' }}>
        {/* Link의 state prop을 사용하여 다음 페이지로 사용자 유형 정보 전달 */}
        <Link to="/signup" state={{ userType: 'elderly' }}>
          <button className="primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', marginBottom: '1rem' }}>
            어르신으로 시작하기
          </button>
        </Link>
        <Link to="/signup" state={{ userType: 'youth' }}>
          <button className="secondary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}>
            청년으로 시작하기
          </button>
        </Link>
         <Link to="/login">
          <p style={{marginTop: '1rem', color: 'var(--text-light)', fontSize: '0.9rem'}}>이미 계정이 있으신가요? <span style={{fontWeight: 'bold', textDecoration: 'underline'}}>로그인</span></p>
        </Link>
      </div>

      {/* 특징 소개 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', maxWidth: '900px', marginTop: '4rem' }}>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ fontWeight: '600', color: '#274C3A', marginBottom: '0.5rem' }}>AI 정서 매칭</h3>
          <p style={{ fontSize: '0.9rem', color: '#666' }}>성향과 관심사를 분석하여 최적의 파트너를 찾아드립니다</p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ fontWeight: '600', color: '#274C3A', marginBottom: '0.5rem' }}>안전한 만남</h3>
          <p style={{ fontSize: '0.9rem', color: '#666' }}>검증된 사용자들과 안전하고 따뜻한 교류를 경험하세요</p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ fontWeight: '600', color: '#274C3A', marginBottom: '0.5rem' }}>의미있는 활동</h3>
          <p style={{ fontSize: '0.9rem', color: '#666' }}>대화, 산책, 취미 공유 등 다양한 방식으로 소통하세요</p>
        </div>
      </div>
    </div>
  );
}

// 라우터 설정 부분
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile-setup" element={<ProfileSetup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<UserList />} />
        <Route path="/users/:userId" element={<UserProfile />} />
        <Route path="/match-requests" element={<MatchRequests />} />
        <Route path="/my-matches" element={<MyMatches />} />
        <Route path="/users/:userId/reviews" element={<Reviews />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
