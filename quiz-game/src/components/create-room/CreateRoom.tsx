import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
const socket = io('http://localhost:3000');

function CreateRoom() {
    const [nickName, setNickName] = useState('');
    const navigate = useNavigate();

    const handleCreateRoom = () => {
        console.log(nickName);
        if(!nickName.trim()) return ;

        socket.emit('create-room', {nickName}, (roomCode: string) => {
            navigate(`/game/${roomCode}`, {
                state : {nickName, roomCode},
            })
        })
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-teal-500 to-cyan-600 px-4 text-white">
            <div className="w-full max-w-md bg-white/10 rounded-2xl shadow-xl p-8 text-center">
                <h2 className="text-2xl font-bold mb-6">Create a New Room</h2>

                <input
                    type="text"
                    placeholder="Enter your nickname"
                    className="w-full mb-4 px-4 py-2 rounded-xl text-black"
                    value={nickName}
                    onChange={(e) => setNickName(e.target.value)}
                />

                <button
                    onClick={handleCreateRoom}
                    className="w-full py-3 text-lg font-semibold bg-green-500 hover:bg-green-600 rounded-xl transition-all"
                >
                    Create Room
                </button>
            </div>
        </div>
    )
}

export default CreateRoom