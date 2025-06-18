import { Route, Routes } from 'react-router-dom'
import './App.css'
import LandingPage from './components/landing-page/LandingPage'
import CreateRoom from './components/create-room/CreateRoom'

function App() {

  return (
    <>
      {/* <div>
        <LandingPage />
      </div> */}
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/create-room' element={<CreateRoom />} />
      </Routes>
    </>
  )
}

export default App
