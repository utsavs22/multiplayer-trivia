import { Route, Routes } from 'react-router-dom'
import './App.css'
import LandingPage from './components/landing-page/LandingPage'
import CreateRoom from './components/create-room/CreateRoom'
import JoinRoom from './components/join-room/JoinRoom'
import GameRoom from './components/game-room/GameRoom'

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
      </Routes>
    </>
  )
}

export default App
