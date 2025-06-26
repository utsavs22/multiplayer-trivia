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
const roomStates = {}

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


    socket.on('start-game', ({ roomCode }) => {
        setTimeout(() => {
            io.to(roomCode).emit('game-started')
            const question = {
                question: 'What is the capital of France?',
                options: ['Paris', 'London', 'Berlin', 'Madrid'],
                correctAnswer: 'Paris'
            };
            console.log(`Sending question to room ${roomCode}:`, question);
            io.to(roomCode).emit('next-question', question);
        }, 500);
    })

    socket.on('submit-game',({roomCode, nickName, answer, timeTaken}) => {
        if(!roomStates[roomCode]) {
            roomStates[roomCode] = {answers:[]};
        }

        roomStates[roomCode].answers.push({nickName, answer, timeTaken});

        const totalPlayers = rooms[roomCode]?.length || 0;

        if(roomStates[roomCode].answers.length === totalPlayers) {
            const submittedAnswers = roomStates[roomCode].answers;

            const correctAnswer = 'Paris';
            const scores = submittedAnswers.map((entry) => ({
                nickName: entry.nickName,
                correct: entry.answer === correctAnswer,
                timeTaken: entry.timeTaken
            }));

            io.to(roomCode).emit('show-results', scores);

            setTimeout(() => {
                const nextQuestion = {
                    question: 'What is 2 + 2?',
                    options: ['3', '4', '5', '6'],
                    correctAnswer: '4'
                };
                console.log(`Sending next question to room ${roomCode}:`, nextQuestion);
                io.to(roomCode).emit('next-question', nextQuestion);
            }, 5000);
            
            roomStates[roomCode].answers = []
        }
    })
});

server.listen(3000, () => {
    console.log("Server is running on port 3000");
})