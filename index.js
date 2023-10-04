const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3000;

// PostgreSQL/ElephantSQL database configuration
const pool = new Pool({
  connectionString: 'postgres://mqpnptxk:RmLLPKHco0tZNR3p7pr0lhCc2BnJzhwQ@ella.db.elephantsql.com/mqpnptxk',
  ssl: {
    rejectUnauthorized: false, // Needed for self-signed certificates (local development)
  },
});

// Middleware to parse JSON request bodies
app.use(express.json());

// Routes for User and Task entities

// Get all users
app.get('/users', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM botuser');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get a specific user by ID
app.get('/users/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    const { rows } = await pool.query('SELECT * FROM botuser WHERE id = $1', [userId]);
    if (rows.length === 0) {
      res.status(404).json({ error: 'User not found' });
    } else {
      res.json(rows[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Create a new user
app.post('/users', async (req, res) => {
  const { name, email } = req.body;
  try {
    const { rows } = await pool.query('INSERT INTO botuser (name, email) VALUES ($1, $2) RETURNING *', [name, email]);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update a user by ID
app.put('/users/:id', async (req, res) => {
  const userId = req.params.id;
  const { name, email } = req.body;
  try {
    const { rows } = await pool.query('UPDATE botuser SET name = $1, email = $2 WHERE id = $3 RETURNING *', [name, email, userId]);
    if (rows.length === 0) {
      res.status(404).json({ error: 'User not found' });
    } else {
      res.json(rows[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/users/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    const { rows } = await pool.query('DELETE FROM botuser WHERE id = $1 RETURNING *', [userId]);
    if (rows.length === 0) {
      res.status(404).json({ error: 'User not found' });
    } else {
      res.json({ message: 'User deleted successfully' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get('/tasks', async (req, res) => {
    try {
      const { rows } = await pool.query('SELECT * FROM task');
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
// Get a specific task by ID
app.get('/tasks/:id', async (req, res) => {
const taskId = req.params.id;
try {
    const { rows } = await pool.query('SELECT * FROM task WHERE id = $1', [taskId]);
    if (rows.length === 0) {
    res.status(404).json({ error: 'Task not found' });
    } else {
    res.json(rows[0]);
    }
} catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
}
});

// Create a new task
app.post('/tasks', async (req, res) => {
    const { message, status, userid } = req.body;
    try {
        let currentDate = new Date();
        currentDate = currentDate.toISOString().replace('T', ' ').slice(0, -5);

        const query = 'INSERT INTO task (message, creationdate, status, userid) VALUES ($1, $2) RETURNING *'
        const { rows } = await pool.query(query, [message, currentDate, status, userid]);
        res.status(201).json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update a task by ID
app.put('/tasks/:id', async (req, res) => {
const taskId = req.params.id;
const { title, description } = req.body;
try {
    const { rows } = await pool.query('UPDATE task SET title = $1, description = $2 WHERE id = $3 RETURNING *', [title, description, taskId]);
    if (rows.length === 0) {
    res.status(404).json({ error: 'Task not found' });
    } else {
    res.json(rows[0]);
    }
} catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
}
});

// Delete a task by ID
app.delete('/tasks/:id', async (req, res) => {
const taskId = req.params.id;
try {
    const { rows } = await pool.query('DELETE FROM task WHERE id = $1 RETURNING *', [taskId]);
    if (rows.length === 0) {
    res.status(404).json({ error: 'Task not found' });
    } else {
    res.json({ message: 'Task deleted successfully' });
    }
} catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
}
});


// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
