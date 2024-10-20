import { io } from 'socket.io-client';
const PROJECT_URL = 'https://react-native-course.oneentry.cloud';
const APP_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoicmVhY3RfYXBwIiwic2VyaWFsTnVtYmVyIjoxLCJpYXQiOjE3MDA0ODAwMDYsImV4cCI6MTc0Nzk5OTk2MX0.gz3KTCITg6FhM_SwtuOZl3GsMr4MlVEPg9sw3d8Q0Po';

export const socket = io(PROJECT_URL, {
  autoConnect: false,
  transports: ['websocket'],
  path: '/api/content/ws',
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  extraHeaders: {
    'x-app-token': APP_TOKEN,
  },
});

socket.on('connect', () => {
  console.log('Connected to the server');
});
socket.on('disconnect', () => {
  console.log('Connected to the server');
});
socket.on('connect_error', (error) => {
  console.error(`Connection error: ${error}`);
});

socket.on('reg', (reg) => {
  console.log('=>(api.ts:27) reg', reg);
});
