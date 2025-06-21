import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';
import Loader from '../components/Loader';
import MentorCard from '../components/partials/MentorCard';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import 'remixicon/fonts/remixicon.css';

const MentorDetail = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useTheme();
  const [mentor, setMentor] = useState(null);
  const [similarMentors, setSimilarMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const toastIdRef = useRef(null);

  // Shuffle helper
  const shuffleArray = (arr) => [...arr].sort(() => 0.5 - Math.random());

  useEffect(() => {
    const fetchMentor = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:5050/api/mentors?name=${encodeURIComponent(name)}`);
        setMentor(res.data);

        if (res.data.expertiseTags?.length > 0) {
          const tagQuery = res.data.expertiseTags.map(tag => `tag=${encodeURIComponent(tag)}`).join('&');
          const similarRes = await axios.get(`http://localhost:5050/api/mentors/similar?${tagQuery}`);
          const filtered = similarRes.data.filter(m => m.fullName !== res.data.fullName);
          setSimilarMentors(shuffleArray(filtered));
        }
      } catch (err) {
        console.error('Failed to fetch mentor:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMentor();
  }, [name]);

  const handleImageError = (e) => {
    e.target.src = '/noimage.jpg';
  };

  const handleToggleFavorite = () => {
    const updated = !isFavorite;
    setIsFavorite(updated);

    if (toastIdRef.current !== null) toast.dismiss(toastIdRef.current);

    toastIdRef.current = toast(updated ? '❤️ Added to Favorites' : '❌ Removed from Favorites', {
      position: 'top-right',
      autoClose: 2500,
      theme: darkMode ? 'dark' : 'light',
      type: updated ? 'success' : 'error',
    });
  };

  if (loading) return <Loader />;
  if (!mentor) return <p className="text-center text-gray-400 mt-10">Mentor not found.</p>;

  return (
    <div className={`${darkMode ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-900'} min-h-screen`}>
      {/* Top Controls */}
      <div className="flex justify-between items-center px-6 pt-4">
        <button onClick={() => navigate(-2)} className="text-2xl hover:scale-110 transition">
          <i className="ri-arrow-left-line" />
        </button>
        <button onClick={toggleDarkMode} className="text-2xl hover:scale-110 transition">
          <i className={`ri-${darkMode ? 'sun' : 'moon'}-line`} />
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-6 pb-16">
        {/* Top Info */}
        <div className="flex flex-col md:flex-row gap-8">
          <div className="relative w-full md:w-[300px]">
            <img
              src={mentor.profilePic || '/noimage.jpg'}
              onError={handleImageError}
              alt={mentor.fullName}
              className="w-full h-[300px] object-cover rounded-xl shadow"
            />
            <button
              onClick={handleToggleFavorite}
              className="absolute top-3 right-3 text-[26px] bg-white/80 dark:bg-zinc-800/80 p-1 rounded-full shadow-md hover:scale-110 transition-transform"
            >
              <i className={`ri-heart-${isFavorite ? 'fill text-rose-500' : 'line text-gray-500'} transition`} />
            </button>

            <div className="mt-4 space-y-2 text-[1rem] text-gray-400">
              <p className="flex items-center gap-2 text-base">
                <i className="ri-map-pin-line text-lg text-pink-400" />
                {mentor.location?.city}, {mentor.location?.state}, {mentor.location?.country}
              </p>
              {mentor.socialLinks?.linkedin && (
                <a
                  href={mentor.socialLinks.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-blue-500 hover:underline text-base"
                >
                  <i className="ri-linkedin-box-fill text-lg" />
                  Reach me
                </a>
              )}
            </div>
          </div>

          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-2">{mentor.fullName}</h2>
            <p className="text-lg text-gray-400">{mentor.headline}</p>
            <p className="text-sm mt-2 text-gray-500">{mentor.occupation}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {mentor.expertiseTags?.map((tag, i) => (
                <span key={i} className={`text-xs px-3 py-1 rounded-full ${darkMode ? 'bg-zinc-800 text-white' : 'bg-gray-100 text-gray-800'}`}>
                  {tag}
                </span>
              ))}
            </div>
            <p className="mt-6">{mentor.summary}</p>
          </div>
        </div>

        {/* Info Sections */}
        <div className="mt-14 flex flex-col md:flex-row gap-12">
          <div className="flex-1 space-y-12">
            {mentor.education?.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-4 underline underline-offset-4 decoration-indigo-500 flex items-center gap-2 hover:text-indigo-500 transition">
                  <i className="ri-book-open-line animate-pulse" /> Education
                </h3>
                <ul className="space-y-2 text-sm">
                  {mentor.education.map((edu, i) => (
                    <li key={i} className="border-b pb-2">
                      <strong>{edu.degree}</strong> in {edu.field} - {edu.school} ({edu.startYear || '-'} - {edu.endYear || '-'})
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {mentor.certifications?.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-4 underline underline-offset-4 decoration-indigo-500 flex items-center gap-2 hover:text-indigo-500 transition">
                  <i className="ri-award-line animate-bounce" /> Certifications
                </h3>
                <ul className="space-y-2 text-sm">
                  {mentor.certifications.map((cert, i) => (
                    <li key={i} className="border-b pb-2">
                      <strong>{cert.name}</strong> — {cert.authority}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="flex-1 space-y-12">
            {mentor.experiences?.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-4 underline underline-offset-4 decoration-indigo-500 flex items-center gap-2 hover:text-indigo-500 transition">
                  <i className="ri-briefcase-4-line animate-pulse" /> Experience
                </h3>
                <ul className="space-y-2 text-sm">
                  {mentor.experiences.map((exp, i) => (
                    <li key={i} className="border-b pb-2">
                      <strong>{exp.title}</strong> at {exp.company} ({exp.startYear || '-'} - {exp.endYear || 'Present'})<br />
                      {exp.location}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {mentor.awards?.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-4 underline underline-offset-4 decoration-indigo-500 flex items-center gap-2 hover:text-indigo-500 transition">
                  <i className="ri-medal-line animate-spin-slow" /> Awards
                </h3>
                <ul className="space-y-2 text-sm">
                  {mentor.awards.map((award, i) => (
                    <li key={i} className="border-b pb-2">
                      {typeof award === 'string' ? award : `${award.title} — ${award.issuer || ''}`}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Similar Mentors */}
        {similarMentors.length > 0 && (
          <div className="mt-20 space-y-6">
            {/* Scrolling Heading */}
            <div className="overflow-hidden whitespace-nowrap border-y py-3 mb-6">
              <div className="flex gap-16 text-xl font-bold uppercase tracking-wider text-rose-500 animate-scroll-left w-max">
                {Array.from({ length: 20 }).map((_, i) => (
                  <span key={i}>Similar Mentors</span>
                ))}
              </div>
            </div>

            {/* Scrollable mentor cards */}
            <div className={`overflow-x-auto py-6 px-2 ${darkMode ? 'bg-zinc-800' : 'bg-gray-100'} rounded-lg no-scrollbar`}>
              <div className="flex gap-8 w-max">
                {similarMentors.map((m, i) => (
                  <div
                    key={`${m._id}-${i}`}
                    className="min-w-[250px] max-w-[250px] cursor-pointer"
                    onClick={() => navigate(`/mentor/${encodeURIComponent(m.fullName)}`)}
                  >
                    <MentorCard mentor={m} index={i} isFavorite={false} onToggleFavorite={() => {}} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorDetail;
