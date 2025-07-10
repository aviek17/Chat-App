import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Header from './pages/Header';
import Sidebar from './pages/Sidebar';
import MainLayout from './layouts/MainLayout';

function App() {
  return (
    <>
      {/* <Router>
        <Routes>        
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Router> */}
      <MainLayout/>
    </>
  )
}

export default App
