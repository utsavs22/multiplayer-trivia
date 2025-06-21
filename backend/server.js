const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();

app.use(cors);

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

const rooms = {}

io.on('connection', (socket) => {
    // console.log('New Client connected:',socket.id);

    socket.on('create-room', ({ nickName }, callback) => {
        const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        socket.join(roomCode);
        socket.nickName = nickName;

        if (!rooms[roomCode]) {
            rooms[roomCode] = [];
        }
        rooms[roomCode].push(nickName);

        io.to(roomCode).emit('room-update', rooms[roomCode]);

        callback(roomCode);
    });

    socket.on('join-room', ({ nickName, roomCode }) => {
        socket.join(roomCode);
        socket.nickname = nickName;

        if (!rooms[roomCode]) {
            rooms[roomCode] = [];
        }

        if (!rooms[roomCode].includes(nickName)) {
            rooms[roomCode].push(nickName);
        }
        console.log(`${nickName} joined room ${roomCode}`);
        io.to(roomCode).emit('room-update', rooms[roomCode]);
    })

    socket.on('disconnect', () => {
        for (const roomCode in rooms) {
            const index = rooms[roomCode].indexOf(socket.nickName);
            if (index !== -1) {
                rooms[roomCode].splice(index, 1);
                io.to(roomCode).emit('room-update', rooms[roomCode]);
            }
        }
    })
});

server.listen(3000, () => {
    console.log("Server is running on port 3000");
})