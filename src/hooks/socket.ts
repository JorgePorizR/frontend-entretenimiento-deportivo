// src/services/socket.ts
const socketUrl = 'ws://localhost:8001/ws/partidos/';

const socket = new WebSocket(socketUrl);

socket.onopen = () => {
  console.log('WebSocket connected');
};

socket.onclose = () => {
  console.log('WebSocket disconnected');
};

export default socket;
