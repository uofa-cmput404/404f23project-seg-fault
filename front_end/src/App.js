import React from 'react';
import './App.css';
import Sidebar from './Components/Sidebar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import Friends from './Pages/Friends';
import Profile from './Pages/Profile';
import Inbox from './Pages/Inbox';

function App() {
  return (
    <div className="app-container">
      <Router>
        <div className="sidebar">
          <Sidebar />
        </div>
        <div className="content">
          <Routes>
            <Route path="/" exact element={<Home />} />
            <Route path="/inbox" element={<Inbox />} />
            <Route path="/friends" element={<Friends />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
