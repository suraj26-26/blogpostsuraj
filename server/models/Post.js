const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  text:   { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

const postSchema = new mongoose.Schema({
  title:     { type: String, required: true },
  content:   { type: String, required: true },
  category:  { type: String, required: true },
  status:    { type: String, enum: ['draft','published'], default: 'draft' },
  views:     { type: Number, default: 0 },
  imagePath: { type: String },
  author:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  comments:  [commentSchema]
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);