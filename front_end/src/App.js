import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './Pages/Home';
import Friends from './Pages/Friends';
import Profile from './Pages/Profile';
import Inbox from './Pages/Inbox';
import SignIn from './Components/auth/SignIn';
import SignUp from './Components/auth/SignUp';
import Sidebar from './Components/Sidebar'

function App() {
  return (
    <div className="app-container">
      <Router>
      <div className="sidebar">
          <Sidebar />
        </div>
        <div className='content'>
          <Routes>
            <Route path="/" element={<Navigate to="/signin" />} />
            <Route path="/home" element={<Home />}/>
            <Route path="/inbox" element={ <Inbox />}/>
            <Route path="/friends" element={<Friends />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
