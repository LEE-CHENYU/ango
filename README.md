# ANGO Gathering

ANGO Gathering is a web application that allows users to create and participate in cryptic gatherings using ANGO (A New Gathering Opportunity) posts.

## Table of Contents

1. [Features](#features)
2. [Installation](#installation)
3. [Usage](#usage)
4. [API Endpoints](#api-endpoints)
5. [Project Structure](#project-structure)
6. [Contributing](#contributing)
7. [License](#license)

## Features

- Create ANGO posts with questions, answers, addresses, and times
- Check answer breakability using LLM
- Ambiguous matching mode for answers
- Refresh and view existing ANGO posts
- Interactive user interface for answering ANGO questions
- Ranking system for posts based on user input
- Break count tracking for posts

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/ango-gathering.git
   cd ango-gathering
   ```

2. Install dependencies for both backend and frontend:
   ```
   npm install
   cd react-ango
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following:
   ```
   PORT=8080
   DATABASE_URL=your_postgres_database_url
   OPENAI_API_KEY=your_openai_api_key
   ```

4. Start the local database:
   ```
   brew services restart postgresql@14
   ```

5. Start the backend server:
   ```
   npm start
   ```

6. Start the frontend development server:
   ```
   cd react-ango
   npm run dev
   ```

## Usage

1. Open your browser and navigate to `http://localhost:3000`
2. Use the "Create ANGO" button to create a new ANGO post
3. Fill in the required fields: ANGO (question), Match (answer), Address, and Time
4. Check the answer breakability by clicking the "Check Breakability" button
5. Submit the form to create the ANGO post
6. View and interact with existing ANGO posts on the main page
7. Use the search functionality to find and rank relevant posts

## API Endpoints

- `GET /api/posts`: Fetch all ANGO posts
- `POST /api/posts`: Create a new ANGO post
- `POST /api/check-answer-breakability`: Check if an answer is breakable by LLM
- `POST /api/check-answer-ambiguity`: Check if a user's answer matches the correct answer
- `POST /api/rank-posts`: Rank posts based on user input
- `GET /api/break-counts`: Get break counts for all posts
- `POST /api/update-break-count/:postId`: Update break count for a specific post

## Project Structure

- `server.js`: Main backend server file
- `react-ango/`: Frontend React application
- `controllers/`: Backend controllers for handling requests
- `routes/`: API route definitions
- `middleware/`: Custom middleware (logger, error handling)
- `db.js`: Database connection setup
- `answer_checker.py`: Python script for answer checking
- `post_ranker.py`: Python script for ranking posts

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
