import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";

const socket = io.connect('http://localhost:8000', { transports : ['websocket'] });

// Get DOM elements in a respective JS variables
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".container");
let tone = new Audio("ess/ping-1.mp3");

// Function which will append event information to the container
const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    
    if (position == 'left'){
        tone.play();
    }
}

// Ask new user his/her name & let the server know
const name = prompt("Enter your name to join");
socket.emit('new-user-joined', name);

// If new user joins receive his/her name from the server
socket.on('user-joined', name =>{
    append(`${name} has joined the chat`, 'left');
});

// If server sends a message, receive it
socket.on('receive', data =>{
    append(`${data.name} : ${data.message}`, 'left');
});

// If a user leaves the chat, append the information to the container
socket.on('leave', name =>{
    append(`${name} has left the chat`, 'left');
});

// If the form gets submitted, send server a message
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = '';
})