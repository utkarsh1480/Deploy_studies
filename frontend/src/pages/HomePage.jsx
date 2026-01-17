import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Lock, ArrowRight, Clock, Tag } from 'lucide-react';

const HomePage = () => {
    const [posts, setPosts] = useState([]);
    const [category, setCategory] = useState('all');
    const [loading, setLoading] = useState(true);

    const categories = ['all', 'Politics', 'Tech', 'Science', 'Entertainment'];

    useEffect(() => {
        fetchPosts();
    }, [category]);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const url = category === 'all'
                ? 'http://localhost:5000/api/posts'
                : `http://localhost:5000/api/posts?category=${category}`;

            const res = await fetch(url);
            const data = await res.json();
            setPosts(data);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    return (
        <div className="container" style={{ padding: '4rem 1rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', background: 'linear-gradient(to right, #818cf8, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Explore Our Latest Stories
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
                    Dive into our premium collection of articles covering politics, technology, science, and more.
                </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className={`btn ${category === cat ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ textTransform: 'capitalize' }}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '4rem' }}>Loading...</div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                    {posts.map(post => (
                        <Link to={`/post/${post._id}`} key={post._id} style={{ display: 'block' }}>
                            <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative', overflow: 'hidden' }}>
                                <div style={{
                                    height: '200px',
                                    background: 'linear-gradient(45deg, #1e293b, #0f172a)',
                                    borderRadius: '0.5rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'var(--text-secondary)'
                                }}>
                                    {/* Placeholder for image */}
                                    <Tag size={48} opacity={0.5} />
                                </div>
                                {post.isPremium && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '1rem',
                                        right: '1rem',
                                        background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                                        color: 'white',
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '2rem',
                                        fontSize: '0.8rem',
                                        fontWeight: 'bold',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.25rem',
                                        boxShadow: '0 4px 6px rgba(0,0,0,0.2)'
                                    }}>
                                        <Lock size={12} />
                                        PREMIUM
                                    </div>
                                )}
                                <div>
                                    <span style={{ color: 'var(--accent-color)', fontSize: '0.9rem', textTransform: 'uppercase', fontWeight: 'bold' }}>
                                        {post.category}
                                    </span>
                                    <h2 style={{ fontSize: '1.5rem', margin: '0.5rem 0' }}>{post.title}</h2>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                        {post.content}
                                    </p>
                                </div>
                                <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Clock size={14} />
                                        {new Date(post.createdAt).toLocaleDateString()}
                                    </span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--accent-color)' }}>
                                        Read More <ArrowRight size={14} />
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HomePage;
