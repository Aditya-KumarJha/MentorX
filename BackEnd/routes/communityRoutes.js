import express from 'express';
import Post from '../models/Post.js';
import User from '../models/UserModel.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// ✅ Create new post
// ✅ Create new post
router.post('/posts', protect, async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const newPost = new Post({
      title,
      content,
      tags,
      author: {
        _id: req.user._id,
        name: req.user.name,
        profilePic: user.profilePic || '',
      },
    });

    await newPost.save();
    res.status(201).json({ success: true, post: newPost });
  } catch (err) {
    console.error('🔥 Create post error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to create post' });
  }
});

// ✅ Get all posts
router.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error('Fetch posts error:', err.message);
    res.status(500).json({ message: 'Failed to fetch posts' });
  }
});

// ✅ Like or unlike post + update user's likedPosts
router.patch('/posts/:id/like', protect, async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const post = await Post.findById(req.params.id);
    const user = await User.findById(userId);

    if (!post || !user) {
      return res.status(404).json({ message: 'Post or User not found' });
    }

    const alreadyLiked = post.likes.some(id => id.toString() === userId);

    if (alreadyLiked) {
      post.likes = post.likes.filter(id => id.toString() !== userId);
      user.likedPosts = user.likedPosts.filter(id => id.toString() !== post._id.toString());
    } else {
      post.likes.push(user._id);
      if (!user.likedPosts.includes(post._id)) {
        user.likedPosts.push(post._id);
      }
    }

    await post.save();
    await user.save();

    res.status(200).json({ success: true, likes: post.likes });
  } catch (err) {
    console.error("Like/unlike error:", err.message);
    res.status(500).json({ message: 'Like/unlike failed' });
  }
});

// ✅ Add comment
router.post('/posts/:id/comments', protect, async (req, res) => {
  try {
    const { text } = req.body;
    const user = await User.findById(req.user._id);
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: 'Post not found' });

    const newComment = {
      userId: user._id,
      name: user.name,
      text,
      createdAt: new Date(),
    };

    post.comments.push(newComment);
    await post.save();

    res.status(201).json({ success: true, comments: post.comments });
  } catch (err) {
    console.error('Add comment error:', err.message);
    res.status(500).json({ message: 'Failed to add comment' });
  }
});

// ✅ Delete comment
router.delete('/posts/:postId/comments/:commentId', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const commentIndex = post.comments.findIndex(
      (c) =>
        c._id.toString() === req.params.commentId &&
        c.userId.toString() === req.user._id.toString()
    );

    if (commentIndex === -1) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    post.comments.splice(commentIndex, 1);
    await post.save();

    res.status(200).json({ success: true, message: 'Comment deleted' });
  } catch (err) {
    console.error('Delete comment error:', err.message);
    res.status(500).json({ message: 'Failed to delete comment' });
  }
});

// ✅ Delete post

router.delete('/posts/:id', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      console.log("❌ Post not found");
      return res.status(404).json({ message: 'Post not found' });
    }

    const authorId = typeof post.author === 'object' ? post.author._id?.toString() : post.author?.toString();
    const currentUserId = req.user._id.toString();

    if (authorId !== currentUserId) {
      console.log("❌ Not authorized — IDs do not match");
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    await post.deleteOne();
    res.status(200).json({ success: true, message: 'Post deleted' });
  } catch (err) {
    console.error('🔥 Delete post error:', err.message);
    res.status(500).json({ message: 'Failed to delete post' });
  }
});

export default router;
