import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './css/App.css'
import Moviecard from './components/Moviecard' 
import Favourites from './Pages/Favourites.jsx'
import Home from './Pages/Home.jsx'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
function App() {
    return (
      <>
      <Navbar/>
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/favourites" element={<Favourites/>} />
        </Routes>
      </main>   
    </>
    );
}

export default App
