const express = require('express');
require("dotenv").config();
const { Pool } = require('pg');
const router = express.Router();

const URL = "postgres://mqpnptxk:RmLLPKHco0tZNR3p7pr0lhCc2BnJzhwQ@ella.db.elephantsql.com/mqpnptxk";

const pool = new Pool({
  connectionString: URL,
  ssl: {
    rejectUnauthorized: false, 
  },
});
//get all attachments
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM attachment');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
//attachment by id
router.get('/:id', async (req, res) => {
  const attachmentId = req.params.id;
  try {
    const { rows } = await pool.query('SELECT * FROM attachment WHERE attachmentid = $1', [attachmentId]);
    if (rows.length === 0) {
      res.status(404).json({ error: 'attachement not found' });
    } else {
      res.json(rows[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//get attachment by task id
router.get('/taskid/:id', async (req, res) => {
  const taskid = req.params.id; 
  if (!taskid) {
    return res.status(400).json({ error: 'Task ID is required' });
  }
  try {
    const { rows } = await pool.query('SELECT file from attachment where taskid = $1',[taskid]);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//get attachments by telegram id
router.get('/telegramid/:id', async (req, res) => {
  const telegramid = req.params.id; 
  if (!telegramid) {
    return res.status(400).json({ error: 'Telegram ID is required' });
  }
  try {
    const { rows } = await pool.query('SELECT a.file, a.taskid FROM attachment a JOIN task t ON a.taskid = t.taskid JOIN botuser u ON t.userid = u.userid WHERE u.telegramid = $1',[telegramid]);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


//post attachment data to db, recieve the file and taskid from the bot api
router.post('/', async (req, res) => {
  const { file , taskid } = req.body;
  try {
    
    if(taskid)
    {
    const query = 'INSERT INTO attachment (file, taskid) VALUES ($1, $2) RETURNING *';
    const { rows: insertedRows } = await pool.query(query, [file, taskid]);

    res.status(201).json(insertedRows[0]);

    } else{

        res.status(404).json({ error: 'Task not found' });
        return;
    }


  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//delete attachments by task id

router.delete('/:id', async (req, res) => {

  const taskId = req.params.id;
  try {
    const { rows } = await pool.query('DELETE FROM attachment WHERE taskid = $1 RETURNING *', [taskId]);
    if (rows.length === 0) {
      res.status(404).json({ error: 'attachment not found' });
    } else {
      res.json({ message: 'attachment deleted successfully' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
