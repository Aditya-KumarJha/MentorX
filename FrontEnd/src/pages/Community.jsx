import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  MessageCircleMore,
  TrendingUp,
  Sun,
  Moon,
  UsersRound,
  ArrowLeft,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import PostList from "../components/PostList"; // ✅ import split component

export default function Community() {
  const { darkMode, toggleDarkMode } = useTheme();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: "", content: "", tags: "" });

  const activeToken = user?.token;

  const fetchPosts = async () => {
    try {
      const res = await axios.get("http://localhost:5050/api/posts");
      setPosts(res.data);
    } catch (err) {
      console.error("Failed to fetch posts", err);
      toast.error("Failed to load posts");
    }
  };

  const handlePost = async () => {
    if (!user || !activeToken) {
      toast.warn("Please login to post");
      return;
    }

    if (!newPost.title || !newPost.content) {
      toast.info("Title and content are required");
      return;
    }

    try {
      console.log("🧪 Creating post with token:", activeToken);
      console.log("🧪 Creating post by user:", user);

      await axios.post(
        "http://localhost:5050/api/posts",
        {
          ...newPost,
          tags: newPost.tags.split(",").map((t) => t.trim()),
        },
        {
          headers: { Authorization: `Bearer ${activeToken}` },
        }
      );

      toast.success("Post created successfully");
      setNewPost({ title: "", content: "", tags: "" });
      fetchPosts();
    } catch (err) {
      console.error("Failed to create post", err.response?.data || err.message);
      toast.error(
        err.response?.data?.message || "Something went wrong while posting"
      );
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className={`${darkMode ? "dark" : ""}`}>
      <div
        className={`min-h-screen py-6 px-4 transition-colors duration-500 ${
          darkMode ? "bg-zinc-900 text-white" : "bg-white text-gray-900"
        }`}
      >
        <ToastContainer position="top-right" autoClose={3000} />

        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800"
          >
            <ArrowLeft size={28} />
          </button>

          <motion.h1
            className={`text-3xl font-bold flex items-center gap-3 ${
              darkMode
                ? "bg-gradient-to-r from-violet-400 via-blue-400 to-indigo-400"
                : "bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500"
            } bg-clip-text text-transparent`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <UsersRound size={28} /> MentorX Community
          </motion.h1>

          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full border transition ${
              darkMode
                ? "bg-white text-black hover:bg-gray-200"
                : "bg-white text-black hover:bg-gray-100"
            }`}
          >
            {darkMode ? <Sun size={22} /> : <Moon size={22} />}
          </button>
        </div>

        {/* Content Grid */}
        <div className="w-full flex flex-col md:flex-row gap-8 px-4 justify-between">
          {/* Left Column */}
          <div className="w-full md:w-[60%] space-y-6 mt-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`flex items-center gap-3 text-2xl font-bold ${
                darkMode ? "text-white" : "text-gray-800"
              }`}
            >
              <MessageCircleMore className="text-indigo-500" size={28} />
              New Posts
            </motion.div>

            {/* Post Create Box */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`p-6 rounded-xl shadow-md ${
                darkMode ? "bg-zinc-800" : "bg-gray-100"
              }`}
            >
              <h3 className="text-lg font-semibold mb-3">Create a Post</h3>
              <input
                type="text"
                placeholder="Post title"
                className={`w-full mb-3 p-2 rounded border text-sm ${
                  darkMode
                    ? "bg-black text-white placeholder-white border-gray-700"
                    : "bg-white text-black placeholder-gray-500 border-gray-300"
                }`}
                value={newPost.title}
                onChange={(e) =>
                  setNewPost({ ...newPost, title: e.target.value })
                }
              />
              <textarea
                rows={5}
                placeholder="Write something..."
                className={`w-full mb-3 p-2 rounded border text-sm resize-none ${
                  darkMode
                    ? "bg-black text-white placeholder-white border-gray-700"
                    : "bg-white text-black placeholder-gray-500 border-gray-300"
                }`}
                value={newPost.content}
                onChange={(e) =>
                  setNewPost({ ...newPost, content: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Tags (comma separated)"
                className={`w-full mb-4 p-2 rounded border text-sm ${
                  darkMode
                    ? "bg-black text-white placeholder-white border-gray-700"
                    : "bg-white text-black placeholder-gray-500 border-gray-300"
                }`}
                value={newPost.tags}
                onChange={(e) =>
                  setNewPost({ ...newPost, tags: e.target.value })
                }
              />
              <button
                onClick={handlePost}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
              >
                Post
              </button>
            </motion.div>

            {/* ✅ Scrollable Post List */}
            <div
              className="overflow-y-auto pr-2"
              style={{ maxHeight: "calc(100vh - 380px)" }}
            >
              <PostList
                posts={posts}
                darkMode={darkMode}
                fetchPosts={fetchPosts}
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="w-full md:w-[40%] space-y-6 mt-4">
            {/* Trending */}
            <div
              className={`p-6 rounded-xl shadow-md ${
                darkMode ? "bg-zinc-800" : "bg-gray-100"
              }`}
            >
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <TrendingUp size={24} className="text-indigo-500" />
                Trending Now
              </h2>
              <div className="space-y-4">
                {[
                  "✅ MentorX learners land real jobs via curated mentorship.",
                  "🧭 Career switchers using AI-powered Roadmaps to upskill.",
                  "🧠 Real mentor feedback shaping learner portfolios.",
                  "📢 New mentor cohorts launching this weekend.",
                ].map((text, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    className={`${
                      darkMode ? "bg-zinc-700" : "bg-white"
                    } p-4 rounded-xl shadow-sm transition-all duration-300`}
                  >
                    <p className="text-sm">{text}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {["This week", "2 days ago", "Today", "Just now"][i]}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* News */}
            <div
              className={`p-6 rounded-xl shadow-md ${
                darkMode ? "bg-zinc-800" : "bg-gray-100"
              }`}
            >
              <h3 className="text-lg font-semibold mb-4">MentorX News</h3>
              <div className="space-y-4">
                {[
                  {
                    title: "🚀 Resume Builder Upgraded",
                    desc: "Now supports job-role alignment tips.",
                  },
                  {
                    title: "🌐 Global Reach",
                    desc: "MentorX now serving users in 20+ countries.",
                  },
                  {
                    title: "📊 Insights Dashboard",
                    desc: "Track your learning and job-readiness in real-time.",
                  },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    className={`p-4 rounded-xl shadow-sm border-l-4 border-indigo-500 ${
                      darkMode ? "bg-zinc-700" : "bg-white"
                    } transition-all duration-300`}
                  >
                    <h4 className="font-semibold text-md">{item.title}</h4>
                    <p className="text-sm text-gray-400 dark:text-gray-500">
                      {item.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

