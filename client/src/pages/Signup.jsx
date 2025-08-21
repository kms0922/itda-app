// client/src/pages/Signup.jsx (수정 후 전체 코드)
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../App.css';

function Signup() {
  const location = useLocation(); // 라우터의 상태 정보를 가져오기 위한 훅

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  // 시작 페이지에서 전달받은 userType으로 상태 초기화, 없으면 'youth' 기본값
  const [userType, setUserType] = useState(location.state?.userType || 'youth');
  const [message, setMessage] = useState('');

  // location.state가 바뀔 때마다 userType을 업데이트 (뒤로가기 등으로 페이지 재진입 시)
  useEffect(() => {
    if (location.state?.userType) {
      setUserType(location.state.userType);
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name, userType }),
    });
    const data = await response.json();
    if (data.success) {
      setMessage(`회원가입 성공! 이제 로그인 해주세요.`);
    } else {
      setMessage(`회원가입 실패: ${data.message}`);
    }
  };

  return (
    <div className="App">
      <h1>
        {userType === 'youth' ? '청년' : '어르신'} 회원가입
      </h1>
      <p style={{color: 'var(--text-light)', marginBottom: '2rem'}}>
        {userType === 'youth' ? 
          '의미있는 활동을 통해 따뜻한 마음을 나눠주세요.' : 
          '잇다와 함께 새로운 친구를 만나보세요.'}
      </p>
      <div className="form-container">
        <form onSubmit={handleSubmit} style={{margin: 0, padding: 0, boxShadow: 'none'}}>
          <input type="email" placeholder="이메일" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="비밀번호" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <input type="text" placeholder="이름" value={name} onChange={(e) => setName(e.target.value)} required />
          <button type="submit" className="primary">가입하기</button>
        </form>
        {message && <p>{message}</p>}
      </div>
      <div className="page-footer">
        <Link to="/"><button className="secondary">← 처음으로</button></Link>
      </div>
    </div>
  );
}
export default Signup;
