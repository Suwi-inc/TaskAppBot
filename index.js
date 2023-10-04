const express = require('express');
const app = express();
const port = process.env.PORT || 3002;

// Middleware to parse JSON request bodies
app.use(express.json());

// Import user and task controllers
const userController = require('./User');
const taskController = require('./Tasks');

// Routes for users and tasks
app.use('/users', userController);
app.use('/tasks', taskController);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
