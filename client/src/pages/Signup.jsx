// client/src/pages/Signup.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [userType, setUserType] = useState('youth'); // 사용자 유형 상태 추가, 기본값 'youth'
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    // API로 userType도 함께 전송
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name, userType }),
    });
    const data = await response.json();
    if (data.success) {
      setMessage(`회원가입 성공! 사용자 ID: ${data.userId}`);
    } else {
      setMessage(`회원가입 실패: ${data.message}`);
    }
  };

  return (
    <div className="App">
      <nav style={{ padding: '1rem', textAlign: 'left' }}><Link to="/"><button>← 뒤로가기</button></Link></nav>
      <h1>잇다 회원가입</h1>
      <form onSubmit={handleSubmit}>
        {/* ▼▼▼ 사용자 유형 선택 라디오 버튼 추가 ▼▼▼ */}
        <div className="user-type-selector">
          <label>
            <input type="radio" value="youth" checked={userType === 'youth'} onChange={(e) => setUserType(e.target.value)} />
            청년 (돌봄 제공자)
          </label>
          <label>
            <input type="radio" value="elderly" checked={userType === 'elderly'} onChange={(e) => setUserType(e.target.value)} />
            어르신 (돌봄 수혜자)
          </label>
        </div>
        {/* ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲ */}
        <div><input type="email" placeholder="이메일" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
        <div><input type="password" placeholder="비밀번호" value={password} onChange={(e) => setPassword(e.target.value)} required /></div>
        <div><input type="text" placeholder="이름" value={name} onChange={(e) => setName(e.target.value)} required /></div>
        <button type="submit">가입하기</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
export default Signup;
