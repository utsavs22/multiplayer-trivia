import { Route, Routes } from 'react-router-dom'
import './App.css'
import LandingPage from './components/landing-page/LandingPage'
import CreateRoom from './components/create-room/CreateRoom'
import JoinRoom from './components/join-room/JoinRoom'
import GameRoom from './components/game-room/GameRoom'
import QuizRoom from './components/quiz-room/QuizRoom'
import socket from './socket';

socket.connect();

function App() {
  return (
    <>
      {/* <div>
        <LandingPage />
      </div> */}
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/create-room' element={<CreateRoom />} />
        <Route path='/join-room' element={<JoinRoom />} />
        <Route path='/game/:roomCode' element={<GameRoom />} />
        <Route path='/quiz/:roomCode' element={<QuizRoom />} />
      </Routes>
    </>
  )
}

export default App
