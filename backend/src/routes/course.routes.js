const express = require("express");
const router = express.Router();
const courseController = require("../controllers/course.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.get("/", courseController.getAllCourses);
router.get("/:id", courseController.getCourseById);
router.get("/:id/reviews", courseController.getCourseReviews);
router.post("/:id/purchase", authMiddleware, courseController.purchaseCourse);

module.exports = router;
