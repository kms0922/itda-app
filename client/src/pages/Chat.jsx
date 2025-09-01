// client/src/pages/Chat.jsx (최종 UI 수정 버전)
import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import '../App.css';

function Chat() {
  const { matchId } = useParams();
  const location = useLocation();
  const partnerName = location.state?.partnerName || '상대방';

  const [currentUser, setCurrentUser] = useState(null);
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }

    fetch(`/api/messages/${matchId}`)
      .then(res => res.ok ? res.json() : [])
      .then(data => Array.isArray(data) && setMessageList(data))
      .catch(error => console.error("이전 메시지 로딩 실패:", error));

    const eventSource = new EventSource(`/api/chat/connect/${matchId}`);

    eventSource.onmessage = (event) => {
      const newMessage = JSON.parse(event.data);
      const localUser = JSON.parse(localStorage.getItem('user'));
      if (newMessage.senderId !== localUser.id) {
        setMessageList((list) => [...list, newMessage]);
      }
    };

    eventSource.onerror = (err) => {
      console.error("EventSource failed:", err);
      eventSource.close();
    };

    return () => { eventSource.close(); };
  }, [matchId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messageList]);

  const sendMessage = async () => {
    if (currentMessage.trim() !== "" && currentUser) {
      const messageData = {
        matchId: matchId,
        senderId: currentUser.id,
        senderName: currentUser.name,
        content: currentMessage,
      };

      const tempMessage = { ...messageData, createdAt: new Date().toISOString() };
      setMessageList((list) => [...list, tempMessage]);
      setCurrentMessage("");

      await fetch('/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messageData)
      });
    }
  };

  return (
    <div className="App chat-container">
      <div className="chat-header">
        <Link to="/my-matches"><button className="secondary">←</button></Link>
        <h2>{partnerName}님과의 대화</h2>
      </div>
      <div className="chat-body">
        {messageList.map((msg, index) => {
          const isSent = currentUser?.id === msg.senderId;
          const timeString = new Date(msg.createdAt).toLocaleTimeString('ko-KR', {
            hour: '2-digit', minute: '2-digit', hour12: true,
          });

          return (
            <div key={index} className={`message-wrapper ${isSent ? "sent" : "received"}`}>
              {!isSent && <div className="sender-name">{msg.senderName}</div>}
              <div className="message-bubble">
                <p className="message-content">{msg.content}</p>
                <span className="message-time">{timeString}</span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-footer">
        <input
          type="text"
          value={currentMessage}
          placeholder="메시지를 입력하세요..."
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage} className="primary">전송</button>
      </div>
    </div>
  );
}
export default Chat;
