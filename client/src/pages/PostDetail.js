import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

export default function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get(`http://localhost:5001/api/posts/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
    .then(res => setPost(res.data))
    .catch(console.error);
  }, [id, token]);

  const handleComment = async e => {
    e.preventDefault();
    if (!comment.trim()) return;
    await axios.post(
      `http://localhost:5001/api/posts/${id}/comments`,
      { text: comment },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setComment('');
    // Refresh post to show new comment
    const res = await axios.get(`http://localhost:5001/api/posts/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    console.log(res)
    setPost(res.data);
  };

  if (!post) return <p>Loading…</p>;

  return (
    <div className="card mb-4 shadow-sm" style={{ maxWidth: 700, margin: '2rem auto', fontFamily: 'sans-serif' }}>
      {post.imagePath && (
        <img
          src={`http://localhost:5001/uploads/${post.imagePath}`}
          className="card-img-top"
          alt={post.title}
          style={{ maxHeight: 320, objectFit: 'cover' }}
        />
      )}
      <div className="card-body">
        <h2 className="card-title">{post.title}</h2>
        <p className="text-muted mb-2">Category: {post.category}</p>
        <p className="card-text">{post.content}</p>
        <p style={{ color: '#888', fontSize: '0.95rem' }}>
          <b>Views:</b> {post.views}
        </p>
        <Link to="/" className="btn btn-secondary mb-3">Back to Posts</Link>
        <hr />
        <h4>Comments</h4>
        <ul style={{ paddingLeft: 0, listStyle: 'none' }}>
          {post.comments && post.comments.length > 0 ? (
            post.comments.map((c, i) => (
              <li key={i} style={{ marginBottom: '1rem', background: '#f8f9fa', padding: '0.75rem', borderRadius: 6 }}>
                <b>{c.author?.name || 'Anonymous'}:</b> {c.text}
                <div style={{ fontSize: '0.85rem', color: '#888' }}>
                  {new Date(c.createdAt).toLocaleString()}
                </div>
              </li>
            ))
          ) : (
            <li>No comments yet.</li>
          )}
        </ul>
        {token && (
          <form onSubmit={handleComment} style={{ marginTop: '1rem' }}>
            <div className="mb-2">
              <textarea
                className="form-control"
                rows={2}
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Add a comment..."
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">Post Comment</button>
          </form>
        )}
      </div>
    </div>
  );
}