# ANGO Gathering

ANGO Gathering is a web application that allows users to create and participate in cryptic gatherings using ANGO (A New Gathering Opportunity) posts.

## Table of Contents

1. [Features](#features)
2. [Installation](#installation)
3. [Usage](#usage)
4. [API Endpoints](#api-endpoints)
5. [Contributing](#contributing)
6. [License](#license)

## Features

- Create ANGO posts with questions, answers, addresses, and times
- Check answer breakability using LLM
- Ambiguous matching mode for answers
- Refresh and view existing ANGO posts
- Interactive user interface for answering ANGO questions

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/ango-gathering.git
   cd ango-gathering
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following:
   ```
   PORT=8000
   ```

4. Start the development server:
   ```
   npm run dev
   ```

## Usage

1. Open your browser and navigate to `http://localhost:8000`
2. Click on "Create ANGO" to create a new ANGO post
3. Fill in the required fields: ANGO (question), Match (answer), Address, and Time
4. Check the answer breakability by clicking the "Check ANGO" button
5. Submit the form to create the ANGO post
6. View and interact with existing ANGO posts on the main page
7. Refresh the posts list using the refresh icon

## API Endpoints

- `GET /api/posts`: Fetch all ANGO posts
- `POST /api/posts`: Create a new ANGO post
- `POST /api/check-answer-breakability`: Check if an answer is breakable by LLM
- `POST /api/check-answer-ambiguity`: Check if a user's answer matches the correct answer (with ambiguous mode support)

For more details on the API endpoints, refer to the following files:

```1:38:server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const { exec } = require('child_process');

// Initialize Express app
const app = express();
const PORT = 8000;

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
```



```36:93:controllers/postController.js
// @desc: Create a post
// @route: POST /api/posts
export const createPost = (req, res, next) => {
    const newPost = {
        id: posts.length + 1,
        question: req.body.question,
        address: req.body.address || 'TBA',
        time: req.body.time || 'TBA',
        answer: req.body.answer,
        llmBreakable: req.body.llmBreakable || false,
        ambiguousMode: req.body.ambiguousMode || false
    };

    if (!newPost.question) {
        const error = new Error('Question is required');
        error.status = 400;
        return next(error);
    }

    posts.push(newPost);
    res.status(201).json(newPost);
}

// @desc: Update a post
// @route: PUT /api/posts/:id
export const updatePost = (req, res, next) => {
    const id = parseInt(req.params.id);
    const post = posts.find((post) => post.id === id);

    if (!post) {
        return res
        .status(404)
        .json({ message: 'Post not found' });
    }
    if (!req.body.question) {
        return res
        .status(400)
        .json({ message: 'Question is required' });
    }

    post.question = req.body.question;
    if (req.body.address) {
        post.address = req.body.address;
    }
    if (req.body.time) {
        post.time = req.body.time;
    }
    if (req.body.answer) {
        post.answer = req.body.answer;
    }
    if (req.body.llmBreakable !== undefined) {
        post.llmBreakable = req.body.llmBreakable;
    }
    if (req.body.ambiguousMode !== undefined) {
        post.ambiguousMode = req.body.ambiguousMode;
    }
    res.status(200).json(post);
}
```


## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
