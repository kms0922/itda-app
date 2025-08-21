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
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (data.success) {
      localStorage.setItem('user', JSON.stringify({ id: data.userId, name: data.name, userType: data.userType }));
      navigate('/dashboard');
    } else {
      setMessage(`로그인 실패: ${data.message}`);
    }
  };

  return (
    <div className="App">
      <h1>잇다 로그인</h1>
      <div className="form-container">
        <form onSubmit={handleSubmit} style={{margin: 0, padding: 0, boxShadow: 'none'}}>
          <input type="email" placeholder="이메일" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="비밀번호" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit" className="primary">로그인</button>
        </form>
        {message && <p>{message}</p>}
      </div>
      <div className="page-footer">
        <Link to="/"><button className="secondary">← 처음으로</button></Link>
      </div>
    </div>
  );
}
export default Login;
