const express = require('express');
const app = express();

const HOST = '127.0.0.1'; // localhost 대신 명시적인 IP 주소 사용
const PORT = 5000;

console.log('--- 서버 스크립트 시작 ---');

app.get('/api', (req, res) => {
  // 이 로그가 보이면, 서버가 요청을 성공적으로 받은 것입니다.
  console.log(`[${new Date().toISOString()}] /api 경로로 요청을 받았습니다.`);
  res.send('안녕하세요, 잇다 백엔드 서버의 API 응답입니다!');
});

const server = app.listen(PORT, HOST, () => {
  // 이 로그가 보이면, 서버가 외부 접속을 받을 준비가 된 것입니다.
  console.log(`서버가 정상적으로 리스닝을 시작했습니다.`);
  console.log(`접속 주소: http://${HOST}:${PORT}/api`);
});

// 서버 시작 시 에러가 발생하면, 이 부분이 실행됩니다.
server.on('error', (err) => {
  console.error('!!! 서버 시작 중 에러가 발생했습니다 !!!');
  console.error(err);
});

console.log('--- 서버 스크립트 마지막 줄 ---');