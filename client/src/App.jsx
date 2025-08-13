import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  // 백엔드에서 받아온 데이터를 저장할 상태(state) 변수
  const [message, setMessage] = useState('');

  // useEffect 훅을 사용하여 컴포넌트가 처음 렌더링될 때 한 번만 실행됩니다.
  useEffect(() => {
    // 백엔드의 /api 엔드포인트로 데이터를 요청합니다.
    fetch('/api')
      .then(response => response.text()) // 응답을 텍스트로 변환
      .then(data => setMessage(data)); // 받아온 데이터를 message 상태에 저장
  }, []); // 빈 배열은 이 훅이 한 번만 실행되도록 합니다.

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        {/* 백엔드에서 받아온 메시지를 화면에 표시합니다. */}
        <h2>백엔드 서버로부터 받은 메시지:</h2>
        <p>{message}</p>
      </div>
    </>
  )
}

export default App
