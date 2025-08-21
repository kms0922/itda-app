// client/src/pages/Reviews.jsx (디자인 개편 후 전체 코드)
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../App.css';

const StarRating = ({ rating }) => (
  <div className="star-rating">
    {'★★★★★'.slice(0, rating)}{'☆☆☆☆☆'.slice(rating)}
  </div>
);

function Reviews() {
  const { userId } = useParams();
  const [reviews, setReviews] = useState([]);
  const [revieweeName, setRevieweeName] = useState('');

  useEffect(() => {
    fetch(`/api/reviews/${userId}`).then(res => res.json()).then(data => setReviews(data));
    fetch(`/api/users/${userId}`).then(res => res.json()).then(data => setRevieweeName(data.name));
  }, [userId]);

  return (
    <div className="App">
      <h1>{revieweeName}님이 받은 후기</h1>
      <div className="review-list" style={{marginTop: '3rem'}}>
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <div key={index} className="card">
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
                <h4 style={{margin: 0}}>{review.reviewerName}님의 후기</h4>
                <StarRating rating={review.rating} />
              </div>
              <p style={{borderLeft: '3px solid var(--primary-green)', opacity: 0.7, paddingLeft: '1rem', margin: 0}}>
                "{review.comment}"
              </p>
            </div>
          ))
        ) : (
          <div className="card" style={{textAlign: 'center'}}>
            <p>아직 받은 후기가 없습니다.</p>
          </div>
        )}
      </div>
      <div className="page-footer">
        <Link to={`/users/${userId}`}><button className="secondary">← 프로필로</button></Link>
      </div>
    </div>
  );
}
export default Reviews;
