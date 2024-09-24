import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUpPage from './components/SignUpPage/SignUpPage';
import LoginPage from './components/LoginPage/LoginPage';
import UsersPage from './components/UsersPage/UsersPage';
import ChatPage from './components/ChatPage/ChatPage';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/chat/:otherUsername" element={<ChatPage />} />
      </Routes>
    </Router>
  );
}

export default App;
