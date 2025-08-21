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
