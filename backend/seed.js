const mongoose = require("mongoose");
const Course = require("./src/models/course.model");
require("dotenv").config();

const sampleCourses = [
  {
    title: "Complete Web Development Bootcamp",
    author: "Dr. Angela Yu",
    price: 89.99,
    rating: 4.7,
    description:
      "Become a full-stack web developer with just one course. HTML, CSS, JavaScript, Node, React, MongoDB and more!",
    thumbnail:
      "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800",
    category: "Web Development",
    duration: "52 hours",
    level: "Beginner",
    studentsCount: 15420,
    videoUrl: "",
    curriculum: [
      {
        title: "Introduction to Web Development",
        lessons: [
          { title: "Course Introduction", duration: "10:30", isPreview: true },
          {
            title: "Setting Up Development Environment",
            duration: "15:45",
            isPreview: true,
          },
          { title: "HTML Basics", duration: "25:20", isPreview: false },
        ],
      },
      {
        title: "CSS Fundamentals",
        lessons: [
          { title: "CSS Selectors", duration: "18:30", isPreview: false },
          { title: "CSS Box Model", duration: "22:15", isPreview: false },
          { title: "Flexbox Layout", duration: "28:40", isPreview: false },
        ],
      },
    ],
  },
  {
    title: "Advanced JavaScript Concepts",
    author: "Maximilian Schwarzmüller",
    price: 79.99,
    rating: 4.8,
    description:
      "Master JavaScript with the most complete course! Projects, challenges, quizzes, ES6+, OOP, AJAX, Webpack",
    thumbnail:
      "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800",
    category: "Programming",
    duration: "38 hours",
    level: "Intermediate",
    studentsCount: 12850,
    curriculum: [
      {
        title: "JavaScript Deep Dive",
        lessons: [
          { title: "Closures Explained", duration: "20:15", isPreview: true },
          {
            title: "Prototypes and Inheritance",
            duration: "25:30",
            isPreview: false,
          },
          { title: "Async/Await", duration: "18:45", isPreview: false },
        ],
      },
    ],
  },
  {
    title: "Python for Data Science",
    author: "Jose Portilla",
    price: 94.99,
    rating: 4.6,
    description:
      "Learn Python for data science with NumPy, Pandas, Matplotlib, Seaborn, Scikit-Learn and more!",
    thumbnail:
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800",
    category: "Data Science",
    duration: "45 hours",
    level: "Beginner",
    studentsCount: 18920,
    curriculum: [
      {
        title: "Python Basics",
        lessons: [
          { title: "Python Introduction", duration: "12:00", isPreview: true },
          {
            title: "Variables and Data Types",
            duration: "16:30",
            isPreview: true,
          },
          { title: "Control Flow", duration: "20:15", isPreview: false },
        ],
      },
    ],
  },
  {
    title: "React - The Complete Guide",
    author: "Academind",
    price: 84.99,
    rating: 4.9,
    description:
      "Dive in and learn React.js from scratch! Learn Reactjs, Hooks, Redux, React Routing, Animations, Next.js",
    thumbnail:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800",
    category: "Web Development",
    duration: "48 hours",
    level: "Intermediate",
    studentsCount: 22340,
    curriculum: [
      {
        title: "Getting Started with React",
        lessons: [
          { title: "What is React?", duration: "8:45", isPreview: true },
          {
            title: "Creating Your First Component",
            duration: "14:20",
            isPreview: true,
          },
          { title: "JSX Deep Dive", duration: "18:30", isPreview: false },
        ],
      },
    ],
  },
  {
    title: "Machine Learning A-Z",
    author: "Kirill Eremenko",
    price: 99.99,
    rating: 4.5,
    description:
      "Learn to create Machine Learning Algorithms in Python and R from two Data Science experts",
    thumbnail:
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800",
    category: "Machine Learning",
    duration: "44 hours",
    level: "Advanced",
    studentsCount: 9870,
    curriculum: [],
  },
  {
    title: "UI/UX Design Masterclass",
    author: "Daniel Walter Scott",
    price: 74.99,
    rating: 4.7,
    description:
      "Master UI/UX Design with Figma, Adobe XD, and real-world projects",
    thumbnail:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800",
    category: "Design",
    duration: "32 hours",
    level: "Beginner",
    studentsCount: 11240,
    curriculum: [],
  },
  {
    title: "Angular - The Complete Guide",
    author: "Maximilian Schwarzmüller",
    price: 89.99,
    rating: 4.8,
    description:
      "Master Angular (Angular 2+, incl. Angular 18) and build awesome, reactive web apps",
    thumbnail:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800",
    category: "Web Development",
    duration: "42 hours",
    level: "Intermediate",
    studentsCount: 16580,
    curriculum: [],
  },
  {
    title: "Node.js - The Complete Guide",
    author: "Academind",
    price: 79.99,
    rating: 4.6,
    description:
      "Master Node.js, build REST APIs with Node.js, GraphQL APIs, add authentication, use MongoDB, SQL & more!",
    thumbnail:
      "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800",
    category: "Backend Development",
    duration: "40 hours",
    level: "Intermediate",
    studentsCount: 13920,
    curriculum: [],
  },
];

async function seedDatabase() {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI ||
        "mongodb+srv://rasuljonadxamov1212_db_user:m07TpLIJa2GrW9t0@cluster0.n5aawan.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    console.log("Connected to MongoDB");

    // Clear existing courses
    await Course.deleteMany({});
    console.log("Cleared existing courses");

    // Insert sample courses
    await Course.insertMany(sampleCourses);
    console.log("Sample courses added successfully");

    mongoose.connection.close();
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
