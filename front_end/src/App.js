import React from 'react';
import './App.css';
import Sidebar from './Components/Sidebar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import Friends from './Pages/Friends';
import UserProfile from './Components/profile/user_profile/UserProfile';
import AnotherUserProfile from './Components/profile/another_user_profile/AnotherUserProfile.jsx';

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
            <Route path="/my-profile" element={<UserProfile />} />
            <Route path="/profile/1" element={<AnotherUserProfile />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
