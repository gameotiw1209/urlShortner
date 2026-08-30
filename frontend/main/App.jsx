import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "../src/login"
import Signup from "../src/signup"
import Dashboard from "../src/dashboard"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
