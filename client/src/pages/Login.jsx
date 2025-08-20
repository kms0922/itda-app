import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('--- 로그인 시도 시작 ---');
    setMessage('');

    try {
      const loginData = { email, password };
      console.log('2. 서버로 보낼 데이터:', loginData);

      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });

      console.log('3. 서버 응답 받음:', response);

      if (!response.ok) {
        throw new Error(`HTTP 에러! 상태: ${response.status}`);
      }

      const data = await response.json();
      console.log('4. 서버로부터 받은 데이터:', data);

      if (data.success) {
        localStorage.setItem('user', JSON.stringify({
          id: data.userId,
          name: data.name,
          userType: data.userType
        }));
        console.log('5. 로그인 성공! 대시보드로 이동합니다.');
        navigate('/dashboard');
      } else {
        setMessage(`로그인 실패: ${data.message}`);
      }
    } catch (error) {
      console.error('!!! 로그인 과정 중 에러 발생 !!!', error);
      setMessage('오류가 발생했습니다. 콘솔 창을 확인해주세요.');
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
