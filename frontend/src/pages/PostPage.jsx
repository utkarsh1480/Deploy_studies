import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth, baseURL } from '../context/AuthContext';
import { Lock, ThumbsUp, MessageSquare, Send } from 'lucide-react';

const PostPage = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comment, setComment] = useState('');
    const [isPremiumUnlocked, setIsPremiumUnlocked] = useState(false); // Simulating local unlock

    useEffect(() => {
        fetchPost();
    }, [id]);

    const fetchPost = async () => {
        try {
            const res = await fetch(`${baseURL}/api/posts/${id}`);
            const data = await res.json();
            setPost(data);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    const handleLike = async () => {
        if (!user) return alert('Please login to like posts');
        try {
            await fetch(`${baseURL}/api/posts/like/${id}`, {
                method: 'PUT',
                headers: {
                    'auth-token': localStorage.getItem('token')
                }
            });
            fetchPost(); // Refresh
        } catch (err) {
            console.error(err);
        }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!user) return alert('Please login to comment');
        try {
            await fetch(`${baseURL}/api/posts/comment/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token')
                },
                body: JSON.stringify({ text: comment })
            });
            setComment('');
            fetchPost();
        } catch (err) {
            console.error(err);
        }
    };

    const handlePayment = () => {
        // Stripe integration placeholder
        alert('Redirecting to Stripe payment gateway...');
        setTimeout(() => {
            alert('Payment Successful! Premium content unlocked.');
            setIsPremiumUnlocked(true);
        }, 1500);
    };

    if (loading) return <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>Loading...</div>;
    if (!post) return <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>Post not found</div>;

    const showContent = !post.isPremium || isPremiumUnlocked;

    return (
        <div className="container" style={{ padding: '4rem 1rem', maxWidth: '800px' }}>
            <span style={{ color: 'var(--accent-color)', textTransform: 'uppercase', fontWeight: 'bold' }}>{post.category}</span>
            <h1 style={{ fontSize: '3rem', margin: '1rem 0 2rem' }}>{post.title}</h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem', color: 'var(--text-secondary)' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--accent-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                    {post.author.username[0].toUpperCase()}
                </div>
                <div>
                    <div>By {post.author.username}</div>
                    <div style={{ fontSize: '0.9rem' }}>{new Date(post.createdAt).toLocaleDateString()}</div>
                </div>
            </div>

            <div className={`card ${!showContent ? 'premium-lock' : ''}`} style={{ padding: '3rem', position: 'relative', overflow: 'hidden' }}>
                {showContent ? (
                    <div style={{ fontSize: '1.2rem', lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>
                        {post.content}
                    </div>
                ) : (
                    <div>
                        <div style={{ filter: 'blur(8px)', userSelect: 'none' }}>
                            {post.content.slice(0, 300)}...
                            <br /><br />
                            [This is premium content. Please upgrade tailored for the most exclusive readers.]
                            <br /><br />
                            Lorem ipsum dolor sit amet...
                        </div>
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'rgba(15, 23, 42, 0.6)',
                            backdropFilter: 'blur(4px)'
                        }}>
                            <Lock size={48} color="gold" style={{ marginBottom: '1rem' }} />
                            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Premium Content</h2>
                            <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>Unlock this article and support independent journalism.</p>
                            <button onClick={handlePayment} className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.2rem' }}>
                                Unlock for $0.99
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div style={{ marginTop: '3rem', display: 'flex', gap: '2rem' }}>
                <button onClick={handleLike} className="btn btn-secondary" style={{ color: post.likes.includes(user?.id) ? 'var(--accent-color)' : 'inherit' }}>
                    <ThumbsUp size={20} /> {post.likes.length} Likes
                </button>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                    <MessageSquare size={20} /> {post.comments.length} Comments
                </div>
            </div>

            <div style={{ marginTop: '4rem' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Comments</h3>

                {user ? (
                    <form onSubmit={handleComment} style={{ marginBottom: '3rem', display: 'flex', gap: '1rem' }}>
                        <input
                            type="text"
                            className="input-field"
                            placeholder="Share your thoughts..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                        <button type="submit" className="btn btn-primary">
                            <Send size={18} />
                        </button>
                    </form>
                ) : (
                    <div style={{ marginBottom: '3rem', padding: '2rem', background: 'rgba(255,255,255,0.05)', borderRadius: '1rem', textAlign: 'center' }}>
                        <Link to="/login" style={{ color: 'var(--accent-color)' }}>Login</Link> to join the conversation.
                    </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {post.comments.map((c, i) => (
                        <div key={i} style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                {c.user?.username?.[0] || '?'}
                            </div>
                            <div>
                                <div style={{ marginBottom: '0.25rem', fontWeight: 'bold' }}>{c.user?.username || 'Unknown User'}</div>
                                <div style={{ color: 'var(--text-secondary)', lineHeight: '1.5' }}>{c.text}</div>
                            </div>
                        </div>
                    ))}
                    {post.comments.length === 0 && <p style={{ color: 'var(--text-secondary)' }}>No comments yet.</p>}
                </div>
            </div>
        </div>
    );
};

export default PostPage;
