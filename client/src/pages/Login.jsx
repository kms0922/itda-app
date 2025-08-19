// client/src/pages/Login.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // useNavigate 임포트
import '../App.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // 페이지 이동 함수

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();

    if (data.success) {
      // ▼▼▼ 로그인 성공 시 ▼▼▼
      // 1. 사용자 정보를 localStorage에 저장
      localStorage.setItem('user', JSON.stringify({
        id: data.userId,
        name: data.name,
        userType: data.userType
      }));
      // 2. 프로필 등록 페이지로 이동
      navigate('/profile-setup');
      // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲
    } else {
      setMessage(`로그인 실패: ${data.message}`);
    }
  };

  return (
    <div className="App">
      <nav style={{ padding: '1rem', textAlign: 'left' }}><Link to="/"><button>← 뒤로가기</button></Link></nav>
      <h1>잇다 로그인</h1>
      <form onSubmit={handleSubmit}>
        <div><input type="email" placeholder="이메일" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
        <div><input type="password" placeholder="비밀번호" value={password} onChange={(e) => setPassword(e.target.value)} required /></div>
        <button type="submit">로그인</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
export default Login;
