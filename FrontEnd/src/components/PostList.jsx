import PostCard from "./PostCard";

export default function PostList({ posts, darkMode, fetchPosts }) {
  if (!posts || posts.length === 0) {
    return (
      <p className="text-center text-sm text-gray-400 mt-10">
        No posts yet.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      {posts.map((post) => (
        <PostCard
          key={post._id}
          post={post}
          darkMode={darkMode}
          fetchPosts={fetchPosts}
        />
      ))}
    </div>
  );
}
