// models/data.js
const fs = require('fs');
const path = require('path');

const dataFile = path.join(__dirname, 'data.json');

// Create data.json if missing
if (!fs.existsSync(dataFile)) {
  fs.writeFileSync(dataFile, JSON.stringify({ users: [], exercises: [] }, null, 2));
}

// Helper functions
function readData() {
  const raw = fs.readFileSync(dataFile);
  return JSON.parse(raw);
}

function writeData(data) {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

// Users
function getUsers() {
  return readData().users;
}
function addUser(user) {
  const data = readData();
  data.users.push(user);
  writeData(data);
}

// Exercises
function getExercises() {
  return readData().exercises;
}
function addExercise(exercise) {
  const data = readData();
  data.exercises.push(exercise);
  writeData(data);
}

module.exports = { getUsers, addUser, getExercises, addExercise };
