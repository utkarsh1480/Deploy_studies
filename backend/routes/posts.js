const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// Middleware to verify token (Basic implementation)
const verifyToken = (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) return res.status(401).send('Access Denied');

    try {
        const verified = require('jsonwebtoken').verify(token, process.env.JWT_SECRET || 'secretKey');
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).send('Invalid Token');
    }
};

// Create Post (Protected)
router.post('/', verifyToken, async (req, res) => {
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        category: req.body.category,
        author: req.user._id,
        isPremium: req.body.isPremium
    });
    try {
        const savedPost = await post.save();
        res.json(savedPost);
    } catch (err) {
        res.status(400).json({ message: err });
    }
});

// Get All Posts (Public - Filter by category optional)
router.get('/', async (req, res) => {
    try {
        const query = req.query.category ? { category: req.query.category } : {};
        const posts = await Post.find(query).populate('author', 'username');
        res.json(posts);
    } catch (err) {
        res.json({ message: err });
    }
});

// Get Specific Post
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('author', 'username').populate('comments.user', 'username');
        res.json(post);
    } catch (err) {
        res.json({ message: err });
    }
});

// Like Post (Protected)
router.put('/like/:id', verifyToken, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.likes.includes(req.user._id)) {
            // Unlike
            await post.updateOne({ $pull: { likes: req.user._id } });
            res.json("Post unliked");
        } else {
            // Like
            await post.updateOne({ $push: { likes: req.user._id } });
            res.json("Post liked");
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

// Comment on Post (Protected)
router.post('/comment/:id', verifyToken, async (req, res) => {
    try {
        const comment = {
            user: req.user._id,
            text: req.body.text
        };
        await Post.findByIdAndUpdate(req.params.id, {
            $push: { comments: comment }
        });
        res.json("Comment added");
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
