import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export default function CreatePost() {
  // Grab the `id` param; if present we're editing an existing post
  const { id } = useParams();
  const isEdit = Boolean(id);

  // Form fields
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("draft");

  // For new uploads
  const [image, setImage] = useState(null);

  // To show the existing image when editing
  const [existingImageUrl, setExistingImageUrl] = useState("");

  const navigate = useNavigate();

  // Example fixed categories
  const predefinedCategories = [
    "Technology",
    "Lifestyle",
    "Education",
    "Finance",
  ];

  // Load post data (and existing image URL) when editing
  useEffect(() => {
    if (!isEdit) return;

    const token = localStorage.getItem("token");
    axios
      // Hit the single-post endpoint so we only fetch the one item
      .get(`${API_BASE_URL}/api/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const post = res.data;
        // Populate text fields
        setTitle(post.title);
        setContent(post.content);
        setCategory(post.category);
        setStatus(post.status);

        // Store the URL/path of the existing image so we can preview it
        // Adjust `post.imageUrl` to whatever your backend returns (e.g. post.image or post.imagePath)
        setExistingImageUrl(post.imageUrl);
      })
      .catch((err) => {
        console.error("Failed to load post:", err);
        alert("Could not load post data.");
      });
  }, [isEdit, id]);

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    // Build form data
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("category", category);
    formData.append("status", status);

    // Only append a file if the user picked one
    if (image) {
      formData.append("image", image);
    }

    try {
      const url = isEdit
        ? `${API_BASE_URL}/api/posts/${id}`
        : `${API_BASE_URL}/api/posts`;
      const method = isEdit ? "put" : "post";

      await axios[method](url, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // On success, go back to home or posts list
      navigate("/");
    } catch (err) {
      console.error("Submit error:", err);
      alert(err?.response?.data?.error || "Submission failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <h2>{isEdit ? "Edit Post" : "New Post"}</h2>

      {/* Title */}
      <div className="mb-3">
        <label className="form-label">Title</label>
        <input
          className="form-control"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      {/* Content */}
      <div className="mb-3">
        <label className="form-label">Content</label>
        <textarea
          className="form-control"
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
      </div>

      {/* Category */}
      <div className="mb-3">
        <label className="form-label">Category</label>
        <select
          className="form-select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="">-- Select Category --</option>
          {predefinedCategories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Status */}
      <div className="mb-3">
        <label className="form-label">Status</label>
        <select
          className="form-select"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>

      {/* Existing Image Preview (edit mode only) */}
      {isEdit && existingImageUrl && !image && (
        <div className="mb-3">
          <label className="form-label">Current Image</label>
          <div>
            <img
              src={existingImageUrl}
              alt="Current post"
              style={{ maxWidth: "200px", display: "block", marginBottom: "0.5rem" }}
            />
          </div>
        </div>
      )}

      {/* File Input (new upload) */}
      <div className="mb-3">
        <label className="form-label">Image (optional)</label>
        <input
          type="file"
          className="form-control"
          accept="image/*"
          onChange={(e) => {
            // Store the picked file and remove the preview
            setImage(e.target.files[0]);
            setExistingImageUrl("");
          }}
        />
      </div>

      {/* Submit / Cancel Buttons */}
      <button type="submit" className="btn btn-primary" style={{ marginRight: "10px" }}>
        {isEdit ? "Update" : "Submit"}
      </button>
      {isEdit && (
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate("/")}
        >
          Cancel
        </button>
      )}
    </form>
  );
}
