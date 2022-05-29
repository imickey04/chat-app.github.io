// Node server which will handle socket io connections

// import { Socket } from 'socket.io';

const io = require("socket.io")(8000, { origins: '*:*'});
// io.origins('*:*')
// io.set('origins', '*:*');

const users = {};

io.on('connection', socket => {

    // If any new user joined the chatroom then send the message to other users, that new user is joined the chat 
    socket.on('new-user-joined', name => {
        // console.log("new User", name);
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    // If one user sends a message then broadcast it to other users
    socket.on('send', message => {
        socket.broadcast.emit('receive', {message: message, name: users[socket.id]});
    });

    // If any new user left the chatroom then send the message to other users, that one user has left the chat 
    socket.on('disconnect', message => {
        socket.broadcast.emit('leave', users[socket.id]);
        delete users[socket.id];
    });
});

