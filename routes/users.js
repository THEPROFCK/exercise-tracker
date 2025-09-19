// routes/users.js
const express = require('express');
const router = express.Router();
const {
  createUser,
  getUsers,
  addExercise,
  getLogs
} = require('../controllers/usersController');

// Create new user
router.post('/', createUser);

// Get all users
router.get('/', getUsers);

// Add exercise
router.post('/:id/exercises', addExercise);

// Get logs
router.get('/:id/logs', getLogs);

module.exports = router;
