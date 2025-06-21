import React, { useRef, useState, forwardRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import 'remixicon/fonts/remixicon.css';
import { motion } from 'framer-motion';

const Contact = forwardRef((props, ref) => {
  const formRef = useRef();
  const [success, setSuccess] = useState(false);
  const { darkMode } = useTheme();

  const textColor = darkMode ? 'text-white' : 'text-gray-800';
  const inputStyle = darkMode
    ? 'bg-zinc-700 border-zinc-600 text-white'
    : 'bg-white border-gray-300 text-gray-900';
  const sectionBg = darkMode ? 'bg-zinc-900' : 'bg-gradient-to-br from-indigo-50 to-white';
  const formBg = darkMode ? 'bg-zinc-800' : 'bg-white';
  const headingColor = darkMode ? 'text-indigo-400' : 'text-indigo-600';
  const contactText = darkMode ? 'text-gray-300' : 'text-gray-700';

  const handleSubmit = () => {
    setTimeout(() => {
      if (formRef.current) {
        formRef.current.reset();
        setSuccess(true);
      }
    }, 1000);
  };

  return (
    <section
      ref={ref}
      className={`py-20 px-6 sm:px-10 md:px-20 transition-all duration-300 ${sectionBg}`}
    >
      <h3 className={`text-3xl font-bold mb-10 text-center flex items-center justify-center gap-3 ${headingColor}`}>
        <i className="ri-message-2-line text-3xl" />
        Send us a message
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: false, amount: 0.3 }}
        >
          <div className="flex flex-col lg:flex-row items-start gap-6">
            <div className="mt-8 w-full max-w-sm">
              <img
                src="/msg icon.png"
                alt="Contact Illustration"
                className="rounded-lg shadow w-full"
              />
            </div>
            <div className={`space-y-4 mt-30 text-lg ${contactText}`}>
              <div className="flex items-center gap-3">
                <i className="ri-mail-line text-xl text-indigo-500" />
                <span>mentorxcontact@gmail.com</span>
              </div>
              <div className="flex items-center gap-3">
                <i className="ri-phone-line text-xl text-green-500" />
                <span>+91 629785678</span>
              </div>
              <div className="flex items-center gap-3">
                <i className="ri-map-pin-line text-xl text-pink-500" />
                <span>Kolkata, West Bengal</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.form
          ref={formRef}
          action="https://api.web3forms.com/submit"
          method="POST"
          onSubmit={handleSubmit}
          className={`shadow-md rounded-lg p-6 space-y-4 ${formBg}`}
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: false, amount: 0.3 }}
        >
          <input type="hidden" name="access_key" value="af143114-594f-4d0f-83d9-a70c67e72d7a" />
          <input type="hidden" name="from_name" value="MentorX Contact Form" />
          <input type="hidden" name="subject" value="New Contact Message from MentorX" />

          <div>
            <label className={`block font-medium mb-1 ${textColor}`}>Your name</label>
            <input
              type="text"
              name="name"
              required
              placeholder="Enter your name"
              className={`w-full px-4 py-2 rounded border ${inputStyle}`}
            />
          </div>

          <div>
            <label className={`block font-medium mb-1 ${textColor}`}>Phone Number</label>
            <input
              type="tel"
              name="phone"
              required
              placeholder="Enter your mobile number"
              className={`w-full px-4 py-2 rounded border ${inputStyle}`}
            />
          </div>

          <div>
            <label className={`block font-medium mb-1 ${textColor}`}>Write your message here</label>
            <textarea
              name="message"
              rows="6"
              required
              placeholder="Enter your message"
              className={`w-full px-4 py-2 rounded border ${inputStyle}`}
            />
          </div>

          <button
            type="submit"
            className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded hover:bg-indigo-700 transition"
          >
            Submit
          </button>

          {success && (
            <p className="text-green-600 mt-4 font-medium">✅ Message sent successfully!</p>
          )}
        </motion.form>
      </div>
    </section>
  );
});

export default Contact;
