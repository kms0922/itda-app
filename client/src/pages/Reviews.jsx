// client/src/pages/Reviews.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../App.css';

// 점수를 별 아이콘으로 변환해주는 간단한 함수
const StarRating = ({ rating }) => {
  return (
    <div className="star-rating">
      {'★★★★★'.slice(0, rating)}
      {'☆☆☆☆☆'.slice(rating)}
    </div>
  );
};

function Reviews() {
  const { userId } = useParams(); // URL에서 후기를 볼 사용자의 ID를 가져옴
  const [reviews, setReviews] = useState([]);
  const [revieweeName, setRevieweeName] = useState('');

  useEffect(() => {
    // 후기 목록을 불러옴
    fetch(`/api/reviews/${userId}`)
      .then(res => res.json())
      .then(data => setReviews(data));

    // 페이지 상단에 표시할 사용자 이름을 불러옴 (기존 API 재활용)
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(data => setRevieweeName(data.name));
  }, [userId]);

  return (
    <div className="App">
      <nav style={{ padding: '1rem', textAlign: 'left' }}>
        <Link to={`/users/${userId}`}><button>← 프로필로 돌아가기</button></Link>
      </nav>
      <h1>{revieweeName}님이 받은 후기</h1>
      <div className="review-list">
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <div key={index} className="review-card">
              <h4>{review.reviewerName}님의 후기</h4>
              <StarRating rating={review.rating} />
              <p>"{review.comment}"</p>
            </div>
          ))
        ) : (
          <p>아직 받은 후기가 없습니다.</p>
        )}
      </div>
    </div>
  );
}
export default Reviews;
