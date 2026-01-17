require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Post = require('./models/Post');
const bcrypt = require('bcryptjs');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/blog_project')
    .then(() => console.log('MongoDB Connected for Seeding'))
    .catch(err => console.log(err));

const seedData = async () => {
    try {
        await User.deleteMany({});
        await Post.deleteMany({});

        // Create User
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);
        const user = new User({
            username: 'admin',
            email: 'admin@example.com',
            password: hashedPassword
        });
        const savedUser = await user.save();

        // Create Posts
        const posts = [
            {
                title: 'The Future of AI in 2026',
                content: 'Artificial Intelligence is evolving rapidly. From generative models to agents that can code, we are witnessing a revolution...\n\n(Full article content would go here)',
                category: 'Tech',
                author: savedUser._id,
                isPremium: false
            },
            {
                title: 'Global Political Shifts',
                content: 'This is a premium article analyzing the current geopolitical landscape. You need to subscribe to read more.',
                category: 'Politics',
                author: savedUser._id,
                isPremium: true
            },
            {
                title: 'Space Exploration Milestones',
                content: 'Mars colonization is closer than ever. SpaceX has just announced...',
                category: 'Science',
                author: savedUser._id,
                isPremium: false
            },
            {
                title: 'Top Movies of the Year',
                content: 'A review of the blockbuster hits that defined this year in cinema.',
                category: 'Entertainment',
                author: savedUser._id,
                isPremium: false
            }
        ];

        await Post.insertMany(posts);
        console.log('Data Seeded Successfully');
        process.exit();
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
};

seedData();
