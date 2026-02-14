import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import TaskBoard from './pages/TaskBoard'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:username" element={<TaskBoard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
