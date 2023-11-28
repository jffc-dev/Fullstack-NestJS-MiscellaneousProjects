const username = localStorage.getItem('name');

//HTML References

const labelStatusOn = document.querySelector('#status-online');
const labelStatusOff = document.querySelector('#status-offline');

const usersUlElement = document.querySelector('ul');

const renderUsers = (users) => {
  usersUlElement.innerHTML = '';
  users.forEach((user) => {
    const liElement = document.createElement('li');
    liElement.innerText = user.name;
    usersUlElement.appendChild(liElement);
  });
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
