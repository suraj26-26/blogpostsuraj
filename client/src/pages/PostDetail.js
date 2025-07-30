import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export default function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState("");
  const token = localStorage.getItem("token");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/posts/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      .then((res) => setPost(res.data))
      .catch(console.error);
  }, [id, token]);
  
  useEffect(() => {
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUserId(payload.id); // or payload._id, depending on your token structure
    } catch {}
  }
}, [token]);
  const handleLike = async () => {
    if (!token || !post || !userId) return;
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/posts/${id}/like`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPost((post) => ({
        ...post,
        likes: res.data.likes,
        likedBy: [...post.likedBy, userId],
      }));
    } catch (err) {
      alert(err?.response?.data?.error || "Could not like post");
    }
  };

  const alreadyLiked = post?.likedBy?.includes(userId);

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    await axios.post(
      `${API_BASE_URL}/api/posts/${id}/comments`,
      { text: comment },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setComment("");
    // Refresh post to show new comment
    const res = await axios.get(`${API_BASE_URL}/api/posts/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    console.log(res);
    setPost(res.data);
  };

  if (!post) return <p>Loading…</p>;

  return (
    <div
      className="card mb-4 shadow-sm"
      style={{ maxWidth: 700, margin: "2rem auto", fontFamily: "sans-serif" }}
    >
      {post.imagePath && (
        <img
          src={`${API_BASE_URL}/uploads/${post.imagePath}`}
          className="card-img-top"
          alt={post.title}
          style={{ maxHeight: 320, objectFit: "cover" }}
        />
      )}
      <div className="card-body">
        <h2 className="card-title">{post.title}</h2>
        <p className="text-muted mb-2">Category: {post.category}</p>
        <p className="card-text">{post.content}</p>
        <p style={{ color: "#888", fontSize: "0.95rem" }}>
          <b>Views:</b> {post.views}
        </p>
        <p>
          <b>Likes:</b> {post?.likes ?? 0}
          <button
            className="btn btn-outline-primary btn-sm"
            style={{ marginLeft: 10 }}
            onClick={handleLike}
            disabled={alreadyLiked}
          >
            👍 Like
          </button>
          {alreadyLiked && (
            <span style={{ marginLeft: 10, color: "#888" }}>
              You already liked this post
            </span>
          )}
        </p>
        <Link to="/" className="btn btn-secondary mb-3">
          Back to Posts
        </Link>
        <hr />
        <h4>Comments</h4>
        <ul style={{ paddingLeft: 0, listStyle: "none" }}>
          {post.comments && post.comments.length > 0 ? (
            post.comments.map((c, i) => (
              <li
                key={i}
                style={{
                  marginBottom: "1rem",
                  background: "#f8f9fa",
                  padding: "0.75rem",
                  borderRadius: 6,
                }}
              >
                <b>{c.author?.name || "Anonymous"}:</b> {c.text}
                <div style={{ fontSize: "0.85rem", color: "#888" }}>
                  {new Date(c.createdAt).toLocaleString()}
                </div>
              </li>
            ))
          ) : (
            <li>No comments yet.</li>
          )}
        </ul>
        {token && (
          <form onSubmit={handleComment} style={{ marginTop: "1rem" }}>
            <div className="mb-2">
              <textarea
                className="form-control"
                rows={2}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Post Comment
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
