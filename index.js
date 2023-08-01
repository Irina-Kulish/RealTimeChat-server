const express = require('express');
const app = express();
const PORT = 5000;

const http = require('http').Server(app);
const socketIO = require('socket.io')(http, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }}
);

app.get('api', (req, res) => {
  res.json({
    message: 'Hello'
  })
})

let users = [];

socketIO.on('connection', (socket) => {
  console.log(`${socket.id} user connection`);

  socket.on('message', (data) => {
    socketIO.emit('response', data)
  })

  socket.on('userLoggedIn', (data) => {
    users.push(data);
    socketIO.emit('userListChanged', users);
  });

  socket.on('disconnect', () => {
    console.log(`${socket.id} user disconnected`);

    users = users.filter((user) => user.socketID !== socket.id);
    socketIO.emit('userListChanged', users);
    socket.disconnect();
  });
});

http.listen(PORT, () => {
  console.log('Server working')
})
