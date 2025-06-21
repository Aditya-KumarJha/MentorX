import React, { useRef } from 'react';
import Navbar from '../components/Navbar';
import Contact from '../components/Contact';
import { useTheme } from '../context/ThemeContext';
import { Typewriter } from 'react-simple-typewriter';
import {
  FaArrowDown,
  FaLightbulb,
  FaRobot,
  FaUserFriends,
  FaRocket,
  FaBrain,
  FaCloud,
  FaCode,
  FaUsers,
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import FAQ from '../components/FAQ';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const { darkMode } = useTheme();
  const howItWorksRef = useRef(null);
  const contactRef = useRef(null); 
  const navigate = useNavigate();

  const gradientClass = darkMode
    ? 'bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-500'
    : 'bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500';

  const bgColor = darkMode ? 'bg-zinc-900 text-white' : 'bg-white text-gray-900';

  const scrollToSteps = () => {
    if (howItWorksRef.current) {
      howItWorksRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToContact = () => {
    if (contactRef.current) {
      contactRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={`min-h-screen transition-all duration-300 ${bgColor}`}>
      <Navbar onContactClick={scrollToContact} />
      <hr className={`border-t ${darkMode ? 'border-zinc-700' : 'border-gray-200'} mx-10`} />

      <section className={`relative text-center py-28 px-6 sm:px-10 md:px-20 ${bgColor} transition-all duration-300 select-none`}>
        <div className="relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: -40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className={`text-7xl sm:text-8xl md:text-9xl font-extrabold mb-8 text-transparent bg-clip-text ${gradientClass} animate-gradientShift`}
          >
            MentorX
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className={`text-2xl sm:text-3xl md:text-4xl font-semibold tracking-wide mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
          >
            <Typewriter
              words={['Empower your future.', 'Discover your path.', 'Grow with AI guidance.', 'Elevate your skills.']}
              loop={0}
              cursor
              cursorStyle="|"
              typeSpeed={70}
              deleteSpeed={50}
              delaySpeed={1000}
            />
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex justify-center gap-4 mt-6"
          >
            <button onClick={() => navigate("/dashboard")} className="px-6 py-2 font-semibold rounded-full bg-indigo-500 hover:bg-indigo-600 text-white shadow-md transition-all">
              Get Started
            </button>
            <button
              className="px-6 py-2 font-semibold rounded-full border border-indigo-500 text-indigo-500 hover:bg-indigo-500 hover:text-white transition-all"
              onClick={scrollToSteps}
            >
              Learn More
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="mt-14 flex justify-center animate-bounce text-xl text-indigo-400"
          >
            <FaArrowDown />
          </motion.div>
        </div>
      </section>

      <section className={`pb-20 text-center px-6 sm:px-10 md:px-20 transition-all duration-300 ${darkMode ? 'bg-zinc-900' : 'bg-white'}`}>
        <h2 className="text-3xl sm:text-4xl font-bold mb-12">Why Choose MentorX?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 text-center">
          {[{
            icon: <FaBrain className="text-5xl text-blue-400 mb-3" />,
            title: "Smart AI Guidance",
            desc: "Powered by GPT & LangChain to provide personalized and contextual support.",
            color: "text-blue-400"
          }, {
            icon: <FaCloud className="text-5xl text-cyan-400 mb-3" />,
            title: "Cloud-Native App",
            desc: "Always available, API-ready and globally fast on Vercel infrastructure.",
            color: "text-cyan-400"
          }, {
            icon: <FaCode className="text-5xl text-purple-400 mb-3" />,
            title: "Modern Tech Stack",
            desc: "Built with React, Tailwind, Node.js, Express, MongoDB for scalability.",
            color: "text-purple-400"
          }, {
            icon: <FaUsers className="text-5xl text-green-400 mb-3" />,
            title: "Community-Driven",
            desc: "Mentors and learners form an engaging, human-centric ecosystem.",
            color: "text-green-400"
          }].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2, duration: 0.6 }}
              className="flex flex-col items-center justify-center"
            >
              {item.icon}
              <p className={`text-2xl sm:text-3xl font-bold ${item.color}`}>{item.title}</p>
              <p className="text-sm mt-2 max-w-xs mx-auto">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section ref={howItWorksRef} className={`py-20 px-6 sm:px-10 md:px-20 ${bgColor}`}>
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {[{
            icon: <FaLightbulb className="mx-auto text-4xl text-yellow-400 mb-4" />,
            title: "1. Discover",
            desc: "Explore your interests and career possibilities.",
            border: "border-indigo-500"
          }, {
            icon: <FaRobot className="mx-auto text-4xl text-blue-400 mb-4" />,
            title: "2. Analyze",
            desc: "Get AI-powered insights based on your goals.",
            border: "border-blue-500"
          }, {
            icon: <FaUserFriends className="mx-auto text-4xl text-pink-400 mb-4" />,
            title: "3. Connect",
            desc: "Chat with mentors and ask real questions.",
            border: "border-pink-500"
          }, {
            icon: <FaRocket className="mx-auto text-4xl text-green-400 mb-4" />,
            title: "4. Launch",
            desc: "Build your path and start your journey today.",
            border: "border-green-500"
          }].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2, duration: 0.6 }}
              className={`p-6 rounded-xl shadow-md border ${item.border} bg-opacity-10 hover:scale-110 transition-transform`}
            >
              {item.icon}
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <FAQ />
      <Contact ref={contactRef} />
      <Footer />
    </div>
  );
};

export default HomePage;
