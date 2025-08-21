// client/src/pages/MyMatches.jsx (전체 코드)
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

// 하나의 매칭 카드를 관리하는 컴포넌트
function MatchCard({ match, currentUser }) {
  const [view, setView] = useState('log_activity'); // 'log_activity', 'leave_review', 'completed'
  const [activity, setActivity] = useState(null);

  const [activityDate, setActivityDate] = useState('');
  const [description, setDescription] = useState('');

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const partner = match.requesterId === currentUser.id ? 
    { id: match.receiverId, name: match.receiverName } : 
    { id: match.requesterId, name: match.requesterName };

  // 활동 기록 제출 핸들러
  const handleActivitySubmit = async () => {
    if (!activityDate || !description) return alert('날짜와 활동 내용을 모두 입력해주세요.');

    const response = await fetch('/api/activities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ matchId: match.matchId, activityDate, description }),
    });
    const data = await response.json();
    if (data.success) {
      setActivity({ id: data.activityId });
      setView('leave_review'); // 활동 기록 성공 시 후기 남기기 뷰로 전환
    } else {
      alert(data.message);
    }
  };

  // 후기 제출 핸들러
  const handleReviewSubmit = async () => {
    if (!comment) return alert('후기 내용을 입력해주세요.');

    const response = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        activityId: activity.id,
        reviewerId: currentUser.id,
        revieweeId: partner.id,
        rating,
        comment
      }),
    });
    const data = await response.json();
    alert(data.message);
    if (data.success) {
      setView('completed'); // 후기 남기기 성공 시 완료 뷰로 전환
    }
  };

  return (
    <div className="match-card">
      <h3>{partner.name}님과 매칭 중</h3>

      {view === 'log_activity' && (
        <div className="activity-form">
          <h4>1. 활동 기록하기</h4>
          <input type="date" value={activityDate} onChange={e => setActivityDate(e.target.value)} />
          <input type="text" placeholder="활동 내용 (예: 함께 산책)" value={description} onChange={e => setDescription(e.target.value)} />
          <button onClick={handleActivitySubmit}>기록</button>
        </div>
      )}

      {view === 'leave_review' && (
        <div className="review-form">
          <h4>2. 활동 후기 남기기</h4>
          <div>
            <label>만족도: </label>
            <select value={rating} onChange={e => setRating(Number(e.target.value))}>
              <option value={5}>★★★★★</option>
              <option value={4}>★★★★☆</option>
              <option value={3}>★★★☆☆</option>
              <option value={2}>★★☆☆☆</option>
              <option value={1}>★☆☆☆☆</option>
            </select>
          </div>
          <textarea placeholder="어떤 활동이었나요? 간단한 후기를 남겨주세요." value={comment} onChange={e => setComment(e.target.value)} />
          <button onClick={handleReviewSubmit}>후기 제출</button>
        </div>
      )}

      {view === 'completed' && (
        <div className="completed-message">
          <p>모든 활동이 기록되었습니다. 감사합니다!</p>
        </div>
      )}
    </div>
  );
}

function MyMatches() {
  const [matches, setMatches] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetch(`/api/matches/accepted/${parsedUser.id}`)
        .then(res => res.json())
        .then(data => setMatches(data));
    }
  }, []);

  return (
    <div className="App">
      <nav style={{ padding: '1rem', textAlign: 'left' }}><Link to="/dashboard"><button>← 대시보드</button></Link></nav>
      <h1>나의 매칭 현황</h1>
      <div className="match-list">
        {matches.length > 0 && user ? 
          matches.map(match => <MatchCard key={match.matchId} match={match} currentUser={user} />) : 
          <p>아직 성사된 매칭이 없습니다.</p>
        }
      </div>
    </div>
  );
}
export default MyMatches;
