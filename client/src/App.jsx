import { useState } from 'react';
import './App.css';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); // 폼 제출 시 페이지가 새로고침되는 것을 방지
    setMessage(''); // 이전 메시지 초기화

    const response = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, name }),
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
      <h1>잇다 회원가입</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <button type="submit">가입하기</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default App;
