const Review = require("../models/review.model");
const Course = require("../models/course.model");

exports.addReview = async (req, res) => {
  try {
    const { courseId, rating, comment, userName } = req.body;
    const userId = req.userId;

    const existingReview = await Review.findOne({ courseId, userId });
    if (existingReview) {
      return res
        .status(400)
        .json({ message: "You have already reviewed this course" });
    }

    const review = new Review({
      courseId,
      userId,
      userName,
      rating,
      comment,
    });

    await review.save();

    const reviews = await Review.find({ courseId });
    const avgRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await Course.findByIdAndUpdate(courseId, { rating: avgRating.toFixed(1) });

    res.status(201).json(review);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding review", error: error.message });
  }
};
