import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './components/Home';
import Article from './components/Article';
import Login from './components/Login';
import Register from './components/Register';
import CreateArticle from './components/CreateArticle';
import Dashboard from './components/Dashboard';
import Logout from './components/Logout';
import Navbar from './components/Navbar';
import UserProfile from './components/UserProfile';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/user/:username" element={<UserProfile />} />
          <Route path="/articles/:id" element={<Article />} />
          <Route path="/create-article" element={<CreateArticle />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;