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
        .then(data => setRequests(data));
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

  return (
    <div className="App">
      <h1>받은 매칭 요청</h1>
      {message && <p>{message}</p>}
      <div className="request-list">
        {requests.length > 0 ? (
          requests.map(req => (
            <div key={req.matchId} className="card">
              <p><strong>{req.requesterName}</strong>님으로부터 매칭 요청이 도착했습니다.</p>
              <div style={{textAlign: 'center', marginTop: '1rem'}}>
                <button onClick={() => handleResponse(req.matchId, 'accepted')} className="primary">수락</button>
                <button onClick={() => handleResponse(req.matchId, 'rejected')} className="secondary">거절</button>
              </div>
            </div>
          ))
        ) : (
          <p>현재 받은 매칭 요청이 없습니다.</p>
        )}
      </div>
      <div className="page-footer">
        <Link to="/dashboard"><button className="secondary">← 대시보드로</button></Link>
      </div>
    </div>
  );
}
export default MatchRequests;
