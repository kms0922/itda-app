// client/src/pages/MatchRequests.jsx (최종 버전)
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

function MatchRequests() {
  const [requests, setRequests] = useState([]);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetch(`/api/matches/received/${parsedUser.id}`)
        .then(res => res.json())
        .then(data => setRequests(data))
        .catch(error => console.error("매칭 요청 로딩 실패:", error));
    }
  }, []);

  const handleResponse = async (matchId, response) => {
    const res = await fetch('/api/matches/respond', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ matchId, response }),
    });
    const data = await res.json();
    setMessage(data.message);
    setRequests(prevRequests => prevRequests.filter(req => req.matchId !== matchId));
  };

  if (!user) { return <div className="App">로딩 중...</div>; }

  return (
    <div className="App">
      <nav style={{ padding: '1rem', textAlign: 'left' }}><Link to="/dashboard"><button>← 대시보드로 돌아가기</button></Link></nav>
      <h1>받은 매칭 요청</h1>
      {message && <p className="success-message">{message}</p>}
      <div className="request-list">
        {requests.length > 0 ? (
          requests.map(req => (
            <div key={req.matchId} className="request-card">
              <p><strong>{req.requesterName}</strong>님으로부터 매칭 요청이 도착했습니다.</p>
              <div>
                <button onClick={() => handleResponse(req.matchId, 'accepted')} className="accept-btn">수락</button>
                <button onClick={() => handleResponse(req.matchId, 'rejected')} className="reject-btn">거절</button>
              </div>
            </div>
          ))
        ) : ( <p>현재 받은 매칭 요청이 없습니다.</p> )}
      </div>
    </div>
  );
}
export default MatchRequests;
