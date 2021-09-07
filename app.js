// const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const cors = require('cors');
const formatMessage = require('./utils/messages');
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
app.use(cors());

const botName = 'MSE Bot';

io.on("connection", (socket) => {
    socket.on('joinRoom', ({ username, room }) => {

        const user = userJoin(socket.id, username, room);

        socket.join(user.room);

        //Welcome current User
        //emits to single client
        socket.emit('message', formatMessage(botName, 'Welcome to MSE!'));

        //Broadcast when a user connects
        // emits everybody except you
        socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} has joined the chat`));

        // Send users and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    })


    //Listen for chat Message on the server side
    socket.on('chatMessage', msg => {
        // console.log(msg);
        let user = getCurrentUser(socket.id);

        // emit to everybody
        io.to(user.room).emit('message', formatMessage(user.username, msg))
    })


    //Runs when client disconnects
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);
        // emits to all the clients except you again

        if (user) {
            io.to(user.room).emit('message', formatMessage(botName, `${user.username} has left the chat`));

            // Send users and room info
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }
    })

});
app.use(express.static('public'));


const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => {
    console.log(`Server is running on port: ` + PORT);
});