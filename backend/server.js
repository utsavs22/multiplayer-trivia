const express = require('express');
const http = require('http');
const { Server }  = require('socket.io');
const cors = require('cors');

const app = express();

app.use(cors);

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET','POST']
    }
});

io.on('connection', (socket) => {
    console.log('New Client connected:',socket.id);

    socket.on('create-room',({nickname}, callback) => {
        const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        socket.join(roomCode);
        socket.nickname = nickname;
        callback(roomCode);
    });
});

server.listen(3000, () =>{
    console.log("Server is running on port 3000");
})