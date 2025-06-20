import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';
import {
  FaQuestionCircle,
  FaRobot,
  FaUserCheck,
  FaUserPlus,
  FaRegLightbulb
} from 'react-icons/fa';

const faqs = [
  {
    icon: <FaQuestionCircle className="text-indigo-500 text-2xl" />,
    question: 'What is MentorX?',
    answer: 'MentorX is an AI-powered platform that guides learners through career exploration, mentorship, and skill-building.'
  },
  {
    icon: <FaRegLightbulb className="text-yellow-500 text-2xl" />,
    question: 'Is MentorX free to use?',
    answer: 'Yes, MentorX offers core features for free. Premium plans may be introduced for advanced tools in the future.'
  },
  {
    icon: <FaRobot className="text-blue-400 text-2xl" />,
    question: 'How does the AI help me?',
    answer: 'MentorX uses AI to analyze your interests and goals, recommending learning paths and connecting you with relevant mentors.'
  },
  {
    icon: <FaUserPlus className="text-green-500 text-2xl" />,
    question: 'Can I become a mentor?',
    answer: 'Absolutely! We’re building a community-driven ecosystem. You can apply to become a mentor from your dashboard.'
  }
];

const FAQ = () => {
  const { darkMode } = useTheme();

  const bgColor = darkMode ? 'bg-zinc-900 text-white' : 'bg-white text-gray-900';
  const headingColor = darkMode ? 'text-indigo-400' : 'text-indigo-600';
  const cardColor = darkMode ? 'bg-zinc-800' : 'bg-indigo-50';
  const borderColor = darkMode ? 'border-zinc-700' : 'border-indigo-300';

  return (
    <section className={`py-20 px-6 sm:px-10 md:px-20 transition-all duration-300 ${bgColor}`}>
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`text-3xl sm:text-4xl font-bold text-center mb-12 flex items-center justify-center gap-3 ${headingColor}`}
      >
        <FaQuestionCircle className="text-3xl" />
        Frequently Asked Questions
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {faqs.map((faq, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2, duration: 0.5 }}
            viewport={{ once: false, amount: 0.3 }}
            whileHover={{ scale: 1.1 }}
            className={`p-6 rounded-lg shadow-md border ${borderColor} ${cardColor} transition-transform duration-300 cursor-pointer`}
          >
            <div className="flex items-start gap-4">
              {faq.icon}
              <div>
                <h3 className="text-lg font-semibold mb-1">{faq.question}</h3>
                <p className="text-sm leading-relaxed">{faq.answer}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default FAQ;
