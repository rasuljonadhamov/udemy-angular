const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema({
  title: String,
  duration: String,
  isPreview: Boolean,
  videoUrl: String,
});

const moduleSchema = new mongoose.Schema({
  title: String,
  lessons: [lessonSchema],
});

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  description: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  category: String,
  duration: String,
  level: String,
  studentsCount: {
    type: Number,
    default: 0,
  },
  videoUrl: String,
  curriculum: [moduleSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Course", courseSchema);
