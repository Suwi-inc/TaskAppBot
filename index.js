const express = require('express');
require("dotenv").config();
const app = express();
const port = 3002;

app.use(express.json());

const userController = require('./User');
const taskController = require('./Tasks');
const attachementController = require('./Attachments')

app.use('/users', userController);
app.use('/tasks', taskController);
app.use('/attachments',attachementController);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
