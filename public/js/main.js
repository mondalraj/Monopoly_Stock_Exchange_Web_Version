// console.log("You are on main.js");

const chat = document.getElementById('chat');
const chatBox = document.querySelector('.chatBox');
const roomID = document.getElementById('roomID');
const member = document.getElementById('member');

// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
});
// console.log(username, room);
const socket = io();

// Join chatroom
socket.emit('joinRoom', { username, room });

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
});

socket.on('message', message => {
    // console.log(message);
    outputMessage(message);

    // Scroll down
    chatBox.scrollTop = chatBox.scrollHeight;
});

chat.addEventListener('submit', (e) => {
    e.preventDefault();

    //get message text
    const msg = e.target.elements.msg.value;
    // console.log(msg);

    //emit messgae to the server
    socket.emit('chatMessage', msg)

    // Clear input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
})


// Output message to DOM
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('messageBox');
    div.innerHTML = `<div class="username">${message.username}</div>
            <div class="msgTxt">${message.text}</div>`
    document.querySelector('.chatBox').appendChild(div);
}

//Add room name to the DOM
function outputRoomName(room) {
    roomID.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
    member.innerHTML = '';
    users.forEach((user) => {
        const div = document.createElement('div');
        div.innerText = user.username;
        member.appendChild(div);
    });
}