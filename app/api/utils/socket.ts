import { io } from "socket.io-client";


export const socket = io('https://react-native-course.oneentry.cloud', {
  autoConnect: false,
  transports: ['websocket'],
  extraHeaders: {
    'x-app-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoicmVhY3RfYXBwIiwic2VyaWFsTnVtYmVyIjoxLCJpYXQiOjE3MDA0ODAwMDYsImV4cCI6MTc0Nzk5OTk2MX0.gz3KTCITg6FhM_SwtuOZl3GsMr4MlVEPg9sw3d8Q0Po',
  },
});

socket.on('connect', () => {
  console.log('Connected to the server');
});
socket.on('disconnect', () => {
  console.log('Connected to the server');
});
socket.on('connect_error', error => {
  console.error(`Connection error: ${error}`);
});

socket.on('reg', reg => {
  console.log('=>(api.ts:27) reg', reg);
});
