const Review = require("../models/review.model");
const Course = require("../models/course.model");
const User = require("../models/user.model");

exports.addReview = async (req, res) => {
  try {
    const { courseId, rating, comment, userName } = req.body;
    const userId = req.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const hasPurchased = (user.purchasedCourses || []).some(
      (cId) => cId.toString() === courseId
    );
    if (!hasPurchased) {
      return res
        .status(403)
        .json({ message: "You must purchase this course before leaving a review" });
    }

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
