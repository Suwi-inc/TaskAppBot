const express = require('express');
const { Pool } = require('pg');
const router = express.Router();

const URL = 'postgres://mqpnptxk:RmLLPKHco0tZNR3p7pr0lhCc2BnJzhwQ@ella.db.elephantsql.com/mqpnptxk';

// PostgreSQL/ElephantSQL database configuration
const pool = new Pool({
  connectionString: URL,
  ssl: {
    rejectUnauthorized: false, // Needed for self-signed certificates (local development)
  },
});

router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM botuser');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    const { rows } = await pool.query('SELECT * FROM botuser WHERE userid = $1', [userId]);
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

router.post('/', async (req, res) => {
  const { name, email } = req.body;
  try {
    const { rows } = await pool.query('INSERT INTO botuser (name, email) VALUES ($1, $2) RETURNING *', [name, email]);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/:id', async (req, res) => {
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

module.exports = router;
