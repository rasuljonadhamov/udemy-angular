const Course = require("../models/course.model");
const Review = require("../models/review.model");
const User = require("../models/user.model");

exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.json(courses);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching courses", error: error.message });
  }
};

exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json(course);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching course", error: error.message });
  }
};

exports.getCourseReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ courseId: req.params.id }).sort({
      createdAt: -1,
    });
    res.json(reviews);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching reviews", error: error.message });
  }
};

exports.getPurchasedCourses = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const courseIds = user.purchasedCourses || [];
    const courses = await Course.find({ _id: { $in: courseIds } }).sort({ createdAt: -1 });
    res.json(courses);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching purchased courses", error: error.message });
  }
};

exports.purchaseCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const userId = req.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // isPurchased
    if (user.purchasedCourses.includes(courseId)) {
      return res.status(400).json({ message: "Course already purchased" });
    }

    user.purchasedCourses.push(courseId);
    await user.save();

    await Course.findByIdAndUpdate(courseId, { $inc: { studentsCount: 1 } });

    res.json({ success: true, message: "Course purchased successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error purchasing course", error: error.message });
  }
};
