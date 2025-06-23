import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

function GameRoom() {

    const {roomCode} = useParams();
    const location = useLocation();
    const {nickName} = location.state as {nickName: string};
    const [players, setPlayers] = useState<string[]>([]);
    
    const isHost = players[0]== nickName ;
    
    useEffect(() => {
      if (roomCode && nickName) {
        socket.emit('join-room', {roomCode, nickName});
      }

      socket.on('room-update', (playerList: string[]) => {
        setPlayers(playerList);
      })

      return () => {
        socket.off('room-update');
      };
    }, [roomCode, nickName]);

    useEffect(() => {
      socket.on('game-started', () => {
        alert('game started');
      });
    
      return () => {
        socket.off('game-started');
      }
    }, [])
    
    
    const handleStartGame = () => {
      socket.emit('start-game', {roomCode})
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 px-4 text-white">
      <h1 className="text-3xl font-bold mb-4">Room: {roomCode}</h1>
      <h2 className="text-xl mb-4">Hello, {nickName}!</h2>

      <div className="bg-white/10 p-6 rounded-xl w-full max-w-md text-center">
        <h3 className="text-lg font-semibold mb-3">Players in Room:</h3>
        <ul className="space-y-2">
          {players.map((player, index) => (
            <li key={index} className="bg-white/20 py-2 rounded-md">
              {player}
            </li>
          ))}
        </ul>

        {isHost && (
          <button
            onClick={handleStartGame}
            className="mt-6 w-full py-3 text-lg font-semibold bg-green-500 hover:bg-green-600 rounded-xl transition-all"
          >
            Start Game
          </button>
        )}
      </div>

      <p className="mt-8 text-sm text-white/60">Waiting for game to start...</p>
    </div>
    )
}

export default GameRoom