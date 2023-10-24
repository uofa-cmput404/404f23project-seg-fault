import React, { useContext } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./Pages/Home";
import Friends from "./Pages/Friends";
import Profile from "./Pages/Profile";
import Inbox from "./Pages/Inbox";
import SignIn from "./Components/auth/SignIn";
import SignUp from "./Components/auth/SignUp";
import Sidebar from "./Components/Sidebar";
import { StoreProvider, StoreContext } from "./store";

function SidebarLayout() {
  const { state } = useContext(StoreContext);
  const { token } = state;

  if (token) {
    return (
      <div className="sidebar">
        <Sidebar />
      </div>
    );
  }

  return null;
}

function App() {
  return (
    <StoreProvider>
      <div className="app-container">
        <Router>
          <SidebarLayout />
          <div className="content">
            <Routes>
              <Route path="/" element={<Navigate to="/signin" />} />
              <Route path="/home" element={<Home />} />
              <Route path="/inbox" element={<Inbox />} />
              <Route path="/social_hub" element={<Friends />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
            </Routes>
          </div>
        </Router>
      </div>
    </StoreProvider>
  );
}

export default App;
