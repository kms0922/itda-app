import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [userType, setUserType] = useState('youth');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('--- 회원가입 시도 시작 ---');
    setMessage('');

    try {
      const signupData = { email, password, name, userType };
      console.log('2. 서버로 보낼 데이터:', signupData);

      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupData),
      });

      console.log('3. 서버 응답 받음:', response);

      if (!response.ok) {
        throw new Error(`HTTP 에러! 상태: ${response.status}`);
      }

      const data = await response.json();
      console.log('4. 서버로부터 받은 데이터:', data);

      if (data.success) {
        setMessage(`회원가입 성공! 사용자 ID: ${data.userId}. 이제 로그인 해주세요.`);
      } else {
        setMessage(`회원가입 실패: ${data.message}`);
      }
    } catch (error) {
      console.error('!!! 회원가입 과정 중 에러 발생 !!!', error);
      setMessage('오류가 발생했습니다. 콘솔 창을 확인해주세요.');
    }
  };

  return (
    <div className="App">
      <nav style={{ padding: '1rem', textAlign: 'left' }}><Link to="/"><button>← 뒤로가기</button></Link></nav>
      <h1>잇다 회원가입</h1>
      <form onSubmit={handleSubmit}>
        <div className="user-type-selector">
          <label><input type="radio" value="youth" checked={userType === 'youth'} onChange={(e) => setUserType(e.target.value)} /> 청년</label>
          <label><input type="radio" value="elderly" checked={userType === 'elderly'} onChange={(e) => setUserType(e.target.value)} /> 어르신</label>
        </div>
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
