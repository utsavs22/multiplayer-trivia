import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

function JoinRoom() {

    const [nickName, setNickName] = useState('');
    const [roomCode, setRoomCode] = useState('');
    const navigate = useNavigate();

    const handleJoinRoom = () => {
        console.log('joining room...');
        if(!nickName.trim() || !roomCode.trim()) return;

        socket.emit('join-room', {roomCode, nickName});

        navigate(`/game/${roomCode}`, {
            state: {nickName, roomCode}
        });
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-200 to-indigo-600 px-4 text-white">
            <div className="w-full max-w-md bg-white/10 rounded-2xl shadow-xl p-8 text-center">
                <h2 className="text-2xl font-bold mb-6">Join a Room</h2>

                <input
                    type="text"
                    placeholder="Enter your nickname"
                    className="w-full mb-4 px-4 py-2 rounded-xl text-black"
                    value={nickName}
                    onChange={(e) => setNickName(e.target.value)}
                />

                <input
                    type="text"
                    placeholder="Enter room code"
                    className="w-full mb-4 px-4 py-2 rounded-xl text-black uppercase"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                />

                <button
                    onClick={handleJoinRoom}
                    className="w-full py-3 text-lg font-semibold bg-blue-500 hover:bg-blue-600 rounded-xl transition-all"
                >
                    Join Room
                </button>
            </div>
        </div>
    )
}

export default JoinRoom