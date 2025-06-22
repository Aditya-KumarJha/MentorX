import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';

import MentorAI from './components/MentorAI';
import MentorDetail from './components/MentorDetail';
import EduMatrix from './components/EduMatrix'; 

import { FavoritesProvider } from './context/FavouritesContext';

const App = () => {
  return (
    <div className="min-h-screen">
      <ToastContainer position="bottom-right" autoClose={3000} />
      
      {/* ✅ Wrap your entire app with FavoritesProvider */}
      <FavoritesProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/mentor-ai" element={<MentorAI />} />
          <Route path="/mentor/:name" element={<MentorDetail />} />
          <Route path="/edumatrix" element={<EduMatrix />} />

          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </FavoritesProvider>
    </div>
  );
};

export default App;
