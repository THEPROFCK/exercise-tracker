const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));

// In-memory storage
let users = [];
let exercises = []; // each entry: { userId, description, duration, date }

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// ✅ Create user
app.post("/api/users", (req, res) => {
  const { username } = req.body;
  const user = { username, _id: uuidv4() };
  users.push(user);
  res.json(user);
});

// ✅ Get all users
app.get("/api/users", (req, res) => {
  res.json(users);
});

// ✅ Add exercise
app.post("/api/users/:_id/exercises", (req, res) => {
  const userId = req.params._id;
  const user = users.find(u => u._id === userId);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  let { description, duration, date } = req.body;
  duration = Number(duration);
  if (!date) {
    date = new Date();
  } else {
    date = new Date(date);
  }

  const exercise = {
    userId,
    description,
    duration,
    date
  };
  exercises.push(exercise);

  res.json({
    _id: user._id,
    username: user.username,
    date: date.toDateString(),
    duration,
    description
  });
});

// ✅ Get logs
app.get("/api/users/:_id/logs", (req, res) => {
  const userId = req.params._id;
  const user = users.find(u => u._id === userId);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  let { from, to, limit } = req.query;
  let log = exercises.filter(e => e.userId === userId);

  // filter by date
  if (from) {
    const fromDate = new Date(from);
    log = log.filter(e => e.date >= fromDate);
  }
  if (to) {
    const toDate = new Date(to);
    log = log.filter(e => e.date <= toDate);
  }

  // map to expected format
  log = log.map(e => ({
    description: e.description,
    duration: e.duration,
    date: e.date.toDateString()
  }));

  // limit results
  if (limit) {
    log = log.slice(0, Number(limit));
  }

  res.json({
    _id: user._id,
    username: user.username,
    count: log.length,
    log
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
