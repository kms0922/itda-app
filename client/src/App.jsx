// client/src/App.jsx
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import ProfileSetup from './pages/ProfileSetup'; // 임포트 추가
import './App.css';

// 시작 페이지 컴포넌트
function Home() {
  return (
    <div className="App">
      <h1>잇다에 오신 것을 환영합니다!</h1>
      <nav>
        <Link to="/signup"><button>회원가입</button></Link>
        <Link to="/login"><button>로그인</button></Link>
      </nav>
    </div>
  );
}


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile-setup" element={<ProfileSetup />} /> {/* 경로 추가 */}
      </Routes>
    </BrowserRouter>
  );
}
export default App;
