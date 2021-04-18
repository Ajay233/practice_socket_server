const app = require('express')();
const http = require('http').Server(app)
const port = process.env.PORT || 8090;
// const url = "https://ajays-practice-chat-app.herokuapp.com"
const url = "http://localhost:3000"
const io = require('socket.io')(http, {
  cors: {
    origin: url,
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});

let users = {}

const msgTimeOut = (func, time, id) => {
  users[id].timer = setTimeout(() => {
    func()
  }, time)
}

const testRoute = require('./testApis.js')
const homeRoute = require('./home.js')

app.use(homeRoute);
app.use(testRoute);

io.on('connection', (socket) => {

  socket.emit('connectionSuccess', socket.id)

  socket.on('addUser', (user) => {
    users[user.id] = { name: user.name, typing: false, timeOut: msgTimeOut };
    io.emit('joined', `${user.name} joined the chat`);
  })

  socket.on('typing', (id, name) => {
    if(users[id].typing === false){
      socket.broadcast.emit('typing', { id: id, message:`${name} is typing` })
      users[id].typing = true;
      users[id].timeOut(() => {
        socket.broadcast.emit('stoppedTyping', id)
        users[id].typing = false;
      }, 3000, id)
    } else {
      clearTimeout(users[id].timer);
      users[id].timeOut(() => {
        socket.broadcast.emit('stoppedTyping', id)
        users[id].typing = false;
      }, 3000, id);
    }
  })

  socket.on('chat message', (message) => {
    //change to emit to everyone but the sender
    socket.broadcast.emit('chat message', message);
    if(users[socket.id].typing === true){
      clearTimeout(users[socket.id]);
      socket.broadcast.emit('stoppedTyping', socket.id)
      users[socket.id].typing = false;
    }
  })

  socket.on('disconnect', () => {
    console.log('a user disconnected');
    delete users[socket.id]
  })

})

http.listen(port, () => {
  console.log('Server started on port 8090')
})
