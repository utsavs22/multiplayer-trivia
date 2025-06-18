import React from 'react';
import { useNavigate } from 'react-router-dom';

function LandingPage() {

    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white px-4">
            <div className="w-full max-w-md bg-white/10 rounded-2xl shadow-xl p-8 text-center">
                <h1 className="text-3xl md:text-4xl font-bold mb-6">Multiplayer Quiz Game</h1>
                <p className="text-base md:text-lg mb-8">Challenge your friends and see who's the smartest!</p>

                <button
                    onClick={() => navigate('/create-room')}
                    className="w-full py-3 mb-4 text-lg font-semibold bg-green-500 hover:bg-green-600 rounded-xl transition-all"
                >
                    Create Room
                </button>

                <button
                    onClick={() => navigate('/join-room')}
                    className="w-full py-3 text-lg font-semibold bg-blue-500 hover:bg-blue-600 rounded-xl transition-all"
                >
                    Join Room
                </button>
            </div>

            <footer className="mt-10 text-sm text-white/70">
                Made with ❤️ by Utsav
            </footer>
        </div>
    )
}

export default LandingPage