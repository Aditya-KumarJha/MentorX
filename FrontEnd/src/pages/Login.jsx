import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTheme } from '../context/ThemeContext';
import axios from '../utils/axios';

const Login = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post('/api/auth/login', {
        email: emailOrUsername.trim(),
        password,
      });

      toast.success(res.data.message || '✅ Login successful!', {
        position: 'top-center',
        autoClose: 3000,
        theme: darkMode ? 'dark' : 'light',
      });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userName', res.data.user.name);
      localStorage.setItem('userEmail', res.data.user.email);

      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      const msg = err.response?.data?.message || '❌ Login failed';
      setErrorMsg(msg);
      toast.error(msg, {
        position: 'top-center',
        autoClose: 3000,
        theme: darkMode ? 'dark' : 'light',
      });
    } finally {
      setLoading(false);
    }
  };

  const bgImage = darkMode ? "/LoginDark.jpg" : "/LoginLight.jpg";

  return (
    <div className={`${darkMode ? "bg-zinc-900 text-white" : "bg-white text-zinc-900"} min-h-screen overflow-hidden transition`}>
      <ToastContainer />

      {/* Header */}
      <div className={`flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 py-4 shadow ${darkMode ? "bg-zinc-800" : "bg-white"}`}>
        <div className="pt-2 flex-1 text-center sm:text-left">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
            MentorX Login
          </h1>
          <p className={`mt-1 sm:mt-2 text-sm sm:text-base font-semibold ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            Your gateway to guided mentorship and career growth
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button onClick={toggleDarkMode} className="p-2 rounded-full hover:scale-110 transition">
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="grid grid-cols-1 md:grid-cols-2 h-[calc(100vh-160px)]">
        {/* Left Visual */}
        <div className="relative flex flex-col justify-center items-center px-4 sm:px-10 text-center overflow-hidden">
          <div
            className="absolute inset-0 z-0 bg-cover bg-center opacity-30 blur-sm transition-all duration-700"
            style={{ backgroundImage: `url('${bgImage}')` }}
          ></div>

          <motion.div
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.8 }}
            className="z-10"
          >
            <motion.h2
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              className={`text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 sm:mb-6 bg-clip-text text-transparent ${
                darkMode
                  ? "bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400"
                  : "bg-gradient-to-r from-indigo-600 to-pink-500"
              }`}
            >
              Empower your journey.
            </motion.h2>
            <motion.p
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              transition={{ delay: 0.2 }}
              className="text-sm sm:text-base md:text-lg tracking-wide font-light max-w-xs sm:max-w-md mx-auto"
            >
              Unlock personalized mentorship and AI-powered career guidance with MentorX.
            </motion.p>
          </motion.div>
        </div>

        {/* Right Form */}
        <div className="flex items-center justify-center px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`shadow-xl rounded-2xl p-6 sm:p-8 w-full max-w-xs sm:max-w-sm z-10 ${darkMode ? "bg-zinc-800" : "bg-white"}`}
          >
            <h3 className="text-xl sm:text-2xl font-semibold mb-6 text-center">Login to MentorX</h3>
            <form onSubmit={handleLogin}>
              {/* Email Input */}
              <label className="block text-sm mb-2">Email</label>
              <div className="relative mb-4 group">
                <FaUser className="absolute left-3 top-3 text-gray-400 group-hover:text-indigo-500 transition-all" />
                <input
                  type="email"
                  required
                  value={emailOrUsername}
                  onChange={(e) => {
                    setEmailOrUsername(e.target.value);
                    setErrorMsg('');
                  }}
                  className={`w-full pl-10 px-3 py-2 rounded border text-sm outline-none transition duration-300 ${
                    darkMode
                      ? "bg-zinc-700 text-white border-zinc-600"
                      : "bg-white text-zinc-900 border-zinc-300"
                  }`}
                />
              </div>

              {/* Password */}
              <label className="block text-sm mb-2">Password</label>
              <div className="relative mb-6 group">
                <FaLock className="absolute left-3 top-3 text-gray-400 group-hover:text-indigo-500 transition-all" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrorMsg('');
                  }}
                  className={`w-full pl-10 px-3 py-2 rounded border text-sm outline-none transition duration-300 ${
                    darkMode
                      ? "bg-zinc-700 text-white border-zinc-600"
                      : "bg-white text-zinc-900 border-zinc-300"
                  }`}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-semibold transition duration-300 hover:brightness-110 hover:scale-[1.03] hover:shadow-[0_0_12px_rgba(99,102,241,0.6)] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Logging in..." : "Login Now"}
              </button>
            </form>

            {/* Error Message */}
            {errorMsg && (
              <p className="text-red-500 text-sm mt-4 text-center">{errorMsg}</p>
            )}

            {/* Signup Link */}
            <p className="text-sm sm:text-md mt-6 text-center">
              Don’t have an account?{' '}
              <span
                className="text-indigo-500 cursor-pointer hover:underline"
                onClick={() => navigate("/signup")}
              >
                Sign up
              </span>
            </p>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className={`px-4 sm:px-6 py-6 text-center text-xs sm:text-sm border-t ${darkMode ? 'text-gray-400 border-zinc-700' : 'text-gray-500 border-zinc-200'}`}>
        MentorX • Built with Passion • © {new Date().getFullYear()}
      </footer>
    </div>
  );
};

export default Login;
