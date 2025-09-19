// controllers/usersController.js
const { getUsers, addUser, getExercises, addExercise } = require('../models/data');
const { v4: uuidv4 } = require('uuid');

// Create user
function createUser(req, res) {
  const { username } = req.body;
  if (!username) return res.json({ error: 'Username is required' });

  const newUser = { username, _id: uuidv4() };
  addUser(newUser);

  res.json(newUser);
}

// Get all users
function getUsersHandler(req, res) {
  res.json(getUsers());
}

// Add exercise
function addExerciseHandler(req, res) {
  const { id } = req.params;
  const { description, duration, date } = req.body;

  const users = getUsers();
  const user = users.find(u => u._id === id);
  if (!user) return res.json({ error: 'User not found' });

  const exercise = {
    userId: id,
    description,
    duration: Number(duration),
    date: date ? new Date(date) : new Date()
  };

  addExercise(exercise);

  res.json({
    _id: user._id,
    username: user.username,
    description: exercise.description,
    duration: exercise.duration,
    date: exercise.date.toDateString()
  });
}

// Get logs
function getLogs(req, res) {
  const { id } = req.params;
  const { from, to, limit } = req.query;

  const users = getUsers();
  const user = users.find(u => u._id === id);
  if (!user) return res.json({ error: 'User not found' });

  let userExercises = getExercises().filter(ex => ex.userId === id);

  if (from) {
    const fromDate = new Date(from);
    userExercises = userExercises.filter(ex => new Date(ex.date) >= fromDate);
  }
  if (to) {
    const toDate = new Date(to);
    userExercises = userExercises.filter(ex => new Date(ex.date) <= toDate);
  }
  if (limit) {
    userExercises = userExercises.slice(0, Number(limit));
  }

  res.json({
    _id: user._id,
    username: user.username,
    count: userExercises.length,
    log: userExercises.map(ex => ({
      description: ex.description,
      duration: ex.duration,
      date: new Date(ex.date).toDateString()
    }))
  });
}

module.exports = {
  createUser,
  getUsers: getUsersHandler,
  addExercise: addExerciseHandler,
  getLogs
};
