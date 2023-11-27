const username = localStorage.getItem('name');

if (!username) {
  window.location.replace('/');
  throw new Error('Username is required');
}

const socket = io('http://localhost:3002', {
  auth: {
    token: 'abc-123',
    name: username,
  },
});
