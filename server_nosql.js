const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const { exec } = require('child_process');

// Initialize Express app
const app = express();
const PORT = 8080;

// CORS Configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3002'], // Adjust if frontend runs on a different origin
  methods: ['GET', 'POST'],
  credentials: true
}));

// Middleware
app.use(bodyParser.json());

// Sample data (Replace with your database)
let postsData = [
  {
    id: 1,
    question: 'What the name of the cat that lives in 404?',
    address: '123 Cat St, NYC',
    time: '3:00 PM',
    answer: 'Kou',
    visible: false,
    ambiguousMode: true,
    llmBreakable: true
  },
  {
    id: 2,
    question: 'What is soursop best for?',
    address: '456 Fruit Ave, NYC',
    time: '4:00 PM',
    answer: 'Cocktail',
    visible: false,
    ambiguousMode: false,
    llmBreakable: false
  },
  {
    id: 3,
    question: 'What is the capital of France?',
    answer: 'Paris',
    address: '123 Eiffel Tower, Paris',
    time: '10:00 AM',
    visible: false,
    ambiguousMode: false,
    llmBreakable: true
  }
];

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
app.post('/api/check-answer-ambiguity', (req, res) => {
  const { correctAnswer, userAnswer } = req.body;

  if (!correctAnswer || !userAnswer) {
    console.error('Missing input:', { correctAnswer, userAnswer });
    return res.status(400).json({ message: 'Both userAnswer and correctAnswer are required.', details: { correctAnswer, userAnswer } });
  }

  // Execute the Python script
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
});

// Endpoint to get all posts
app.get('/api/posts', (req, res) => {
  res.json(postsData);
});

// Endpoint to add a new post
app.post('/api/posts', (req, res) => {
  const { question, answer, address, time, ambiguousMode, llmBreakable } = req.body;

  if (!question || !answer || !address || !time) {
    return res.status(400).json({ message: 'question, answer, address, and time are required.' });
  }

  const newPost = {
    id: postsData.length + 1,
    question,
    answer,
    address,
    time,
    visible: false,
    ambiguousMode: ambiguousMode || false,
    llmBreakable: llmBreakable || false
  };

  postsData.push(newPost);
  res.status(201).json(newPost);
});

// Endpoint to update a post's visibility based on answer correctness
app.post('/api/update-visibility', (req, res) => {
  const { postId, isCorrect } = req.body;

  const post = postsData.find(p => p.id === postId);

  if (!post) {
    return res.status(404).json({ message: 'Post not found.' });
  }

  post.visible = isCorrect;
  res.json({ message: 'Visibility updated successfully.', post });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});