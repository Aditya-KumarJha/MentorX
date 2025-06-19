import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Signup from './pages/Signup';

const App = () => {
  return (
    <div className="min-h-screen">
      <Toaster position="bottom-right" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </div>
  );
};

export default App;
