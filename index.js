const app = require('express')();
const http = require('http').Server(app)
const port = 8090;
const url = "https://ajays-practice-chat-app.herokuapp.com/"
// const url = "http://localhost:3000"
const io = require('socket.io')(http, {
  cors: {
    origin: url,
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});

let users = {}

const testRoute = require('./testApis.js')
const homeRoute = require('./home.js')

app.use(homeRoute);
app.use(testRoute);

io.on('connection', (socket) => {

  socket.emit('connectionSuccess', socket.id)

  socket.on('addUser', (user) => {
    users[user.id] = user.name;
    io.emit('joined', `${user.name} joined the chat`);
  })

  socket.on('typing', (name) => {
    socket.broadcast.emit('typing', `${name} is typing`)
  })

  socket.on('chat message', (message) => {
    //change to emit to everyone but the sender
    socket.broadcast.emit('chat message', message);
  })

  socket.on('disconnect', () => {
    console.log('a user disconnected')
  })

})

http.listen(port, () => {
  console.log('Server started on port 8090')
})
