import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import { HeartIcon as HeartOutline, TrashIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../context/AuthContext";
import axios from "../utils/axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

export default function PostCard({ post, darkMode, fetchPosts, index = 0, onDelete, onUnlike }) {
  const { user, token } = useAuth();

  const activeToken = token || localStorage.getItem("token");
  const localUser = user || JSON.parse(localStorage.getItem("user") || "{}");
  const normalizedUserId = (localUser?._id || localUser?.id)?.toString();

  const authorId = typeof post.author === "string"
    ? post.author
    : post.author?._id?.toString();

  const isPostOwner = normalizedUserId && authorId && normalizedUserId === authorId;
  const liked = post.likes?.some(id => id.toString() === normalizedUserId);

  const toggleLike = async () => {
    const isLoggedIn = activeToken && normalizedUserId;
  
    if (!isLoggedIn) {
      toast.warn("⚠️ Please login to like posts");
      return;
    }
  
    try {
      await axios.patch(
        `/api/posts/${post._id}/like`,
        {},
        { headers: { Authorization: `Bearer ${activeToken}` } }
      );
      if (!liked && fetchPosts) fetchPosts(); 
      else if (liked && onUnlike) onUnlike(post._id); 
      else if (fetchPosts) fetchPosts(); 
    } catch (err) {
      console.error("Like failed", err.response?.data || err.message);
      toast.error("Failed to like/unlike post");
    }
  };
  

  const deletePost = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this post?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`/api/posts/${post._id}`, {
        headers: { Authorization: `Bearer ${activeToken}` },
      });
      toast.success("Post deleted");
      if (onDelete) onDelete(post._id);
      else if (fetchPosts) fetchPosts();
    } catch (err) {
      console.error("Delete failed", err.response?.data || err.message);
      toast.error("Failed to delete post");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        scale: 1.05,
        boxShadow: darkMode
          ? "0 8px 30px rgba(255,255,255,0.2)"
          : "0 8px 30px rgba(0,0,0,0.25)",
      }}
      transition={{ duration: 0.3, delay: index * 0.02 }}
      className={`relative w-[90%] sm:w-[85%] lg:w-[90%] mx-auto p-5 rounded-xl border transition-all duration-300 ${
        darkMode
          ? "bg-zinc-800 border-zinc-700 shadow-[0_12px_25px_rgba(255,255,255,0.12)] text-white"
          : "bg-white border-zinc-200 shadow-[0_12px_25px_rgba(0,0,0,0.2)] text-gray-900"
      }`}
    >
      {localUser && isPostOwner && (
        <button
          onClick={deletePost}
          className="absolute top-3 right-3 p-1 rounded-full hover:bg-red-600 transition"
          title="Delete Post"
        >
          <TrashIcon className="h-5 w-5 text-red-500 hover:text-white" />
        </button>
      )}

      <h4 className="text-xl font-semibold truncate">{post.title}</h4>
      <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
        {post.author?.name || "Unknown"} • {new Date(post.createdAt).toLocaleString()}
      </p>

      <p
        className="mt-2"
        style={{
          maxHeight: '100px',
          overflowY: 'auto',
          paddingRight: '4px',
          scrollBehavior: 'smooth',
          wordBreak: 'break-word',
        }}
      >
        {post.content}
      </p>

      <div className="flex gap-2 mt-2 flex-wrap">
        {post.tags?.map((tag, i) => (
          <span
            key={i}
            className={`text-xs px-2 py-1 rounded-full ${
              darkMode ? "bg-blue-900 text-blue-100" : "bg-blue-100 text-blue-800"
            }`}
          >
            #{tag}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-2 mt-4">
        <button
          onClick={toggleLike}
          className="hover:scale-105 transition-all"
          title={liked ? "Unlike" : "Like"}
        >
          {liked ? (
            <HeartSolid className="h-6 w-6 text-pink-600" />
          ) : (
            <HeartOutline className="h-6 w-6 text-gray-400" />
          )}
        </button>
        <span
          className={`text-xs ${
            darkMode ? "text-gray-400" : "text-gray-500"
          }`}
        >
          {post.likes?.length || 0} {post.likes?.length === 1 ? "like" : "likes"}
        </span>
      </div>
    </motion.div>
  );
}
