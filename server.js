const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const { exec } = require('child_process');
const { Pool } = require('pg');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 8080;

// CORS Configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3002'], // Adjust if frontend runs on a different origin
  methods: ['GET', 'POST'],
  credentials: true
}));

// Middleware
app.use(bodyParser.json());

// Initialize PostgreSQL Pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Make the pool accessible to routes via req.app.locals
app.locals.pool = pool;

// Endpoint to serve static files (e.g., main.js)
app.get('/js/main.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'js', 'main.js'));
});

// Endpoint to check answer breakability using the Python script
app.post('/api/check-answer-breakability', (req, res) => {
  const { question } = req.body;

  if (!question || question.trim() === '') {
    return res.status(400).json({ message: 'Question is required.' });
  }

  // Execute the Python script
  const scriptPath = path.join(__dirname, 'answer_checker.py');
  const command = `python3 "${scriptPath}" "${question.replace(/"/g, '\\"')}"`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Execution error: ${error.message}`);
      return res.status(500).json({ error: 'Error executing script.', details: error.message });
    }

    if (stderr) {
      console.error(`Script stderr: ${stderr}`);
      return res.status(500).json({ error: 'Script error.', details: stderr });
    }

    const result = stdout.trim();

    if (result === '1') {
      return res.json({ isBreakable: true });
    } else if (result === '0') {
      return res.json({ isBreakable: false });
    } else {
      return res.status(500).json({ error: 'Unexpected script output.', details: result });
    }
  });
});

// Endpoint to check answer ambiguity using the Python script
app.post('/api/check-answer-ambiguity', async (req, res) => {
  const { correctAnswer, userAnswer, ambiguousMode } = req.body;

  if (!correctAnswer || !userAnswer) {
    console.error('Missing input:', { correctAnswer, userAnswer });
    return res.status(400).json({ message: 'Both userAnswer and correctAnswer are required.', details: { correctAnswer, userAnswer } });
  }

  if (ambiguousMode) {
    // Execute the Python script for ambiguous comparison
    const scriptPath = path.join(__dirname, 'answer_checker.py');
    const command = `python3 "${scriptPath}" "${userAnswer.replace(/"/g, '\\"')}" "${correctAnswer.replace(/"/g, '\\"')}"`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Execution error: ${error.message}`);
        return res.status(500).json({ error: 'Error executing script.', details: error.message });
      }

      if (stderr) {
        console.error(`Script stderr: ${stderr}`);
        return res.status(500).json({ error: 'Script error.', details: stderr });
      }

      const result = stdout.trim();

      if (result === '1') {
        return res.json({ isCorrect: true });
      } else if (result === '0') {
        return res.json({ isCorrect: false });
      } else {
        return res.status(500).json({ error: 'Unexpected script output.', details: result });
      }
    });
  } else {
    // For non-ambiguous mode, do an exact comparison
    const isCorrect = userAnswer.trim() === correctAnswer.trim();
    res.json({ isCorrect });
  }
});

// Endpoint to get all posts
app.get('/api/posts', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM posts');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint to add a new post
app.post('/api/posts', async (req, res) => {
  const { question, answer, address, time, ambiguous_mode, llm_breakable } = req.body;

  if (!question || !answer || !address || !time) {
    return res.status(400).json({ message: 'question, answer, address, and time are required.' });
  }

  try {
    const { rows } = await pool.query(
      'INSERT INTO posts (question, answer, address, time, visible, ambiguous_mode, llm_breakable) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [question, answer, address, time, false, ambiguous_mode || false, llm_breakable || false]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Error adding new post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint to update a post's visibility based on answer correctness
app.post('/api/update-visibility', async (req, res) => {
  const { postId, isCorrect } = req.body;

  try {
    const { rows } = await pool.query(
      'UPDATE posts SET visible = $1 WHERE id = $2 RETURNING *',
      [isCorrect, postId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    res.json({ message: 'Visibility updated successfully.', post: rows[0] });
  } catch (error) {
    console.error('Error updating post visibility:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
