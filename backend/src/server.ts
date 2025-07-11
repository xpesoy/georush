// backend/src/server.ts
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// 미들웨어
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000"
}));
app.use(express.json());

// 기본 라우트
app.get('/', (req, res) => {
  res.json({ message: 'GeoRush API 서버가 실행 중입니다!' });
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'API 테스트 성공!' });
});

// Socket.io 연결 처리
io.on('connection', (socket) => {
  console.log(`사용자 연결: ${socket.id}`);
  
  socket.on('test', (data) => {
    console.log('테스트 메시지:', data);
    socket.emit('test-response', { message: '테스트 응답!' });
  });
  
  socket.on('disconnect', () => {
    console.log(`사용자 연결 해제: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 서버가 포트 ${PORT}에서 실행 중입니다.`);
});