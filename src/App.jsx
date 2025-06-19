import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import HomePage from './pages/HomePage';

const App = () => {
  return (
    <div className="min-h-screen">
      <Toaster position="bottom-right" reverseOrder={false} />     
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </div>
  );
};

export default App;
