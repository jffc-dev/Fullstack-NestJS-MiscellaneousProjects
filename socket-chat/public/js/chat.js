const username = localStorage.getItem('name');

//HTML References

const labelStatusOn = document.querySelector('#status-online');
const labelStatusOff = document.querySelector('#status-offline');

const usersUlElement = document.querySelector('ul');

const form = document.querySelector('form');
const input = document.querySelector('input');
const chatElement = document.querySelector('#chat');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const message = input.value;
  input.value = '';
  socket.emit('send-message', message);
});

const renderUsers = (users) => {
  usersUlElement.innerHTML = '';
  users.forEach((user) => {
    const liElement = document.createElement('li');
    liElement.innerText = user.name;
    usersUlElement.appendChild(liElement);
  });
};

const renderMessage = (payload) => {
  const { userId, message, name } = payload;
  const divElement = document.createElement('div');
  divElement.classList.add('message');

  if (userId == socket.id) {
    divElement.classList.add('incoming');
  }

  divElement.innerHTML = message;
  chatElement.appendChild(divElement);

  chatElement.scrollTop = chatElement.scrollHeight;
};

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

socket.on('connect', () => {
  console.log('Connected');
  labelStatusOn.classList.remove('hidden');
  labelStatusOff.classList.add('hidden');
});

socket.on('disconnect', () => {
  console.log('Disconnected');
  labelStatusOff.classList.remove('hidden');
  labelStatusOn.classList.add('hidden');
});

socket.on('welcome-message', (msg) => {
  console.log(msg);
});

socket.on('on-clients-change', (data) => {
  renderUsers(data);
  console.log(data);
});

socket.on('on-message', (data) => {
  renderMessage(data);
  console.log(data);
});
