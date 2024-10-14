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
   PORT=8080
   ```

4. Start the local database:
   ```
   brew services restart postgresql@14
   ```

5. Start the backend server:
   You have two options:

   a. Using npm:
   ```
   npm start
   ```

   b. Using Docker:
   ```
   docker run -p 8080:8080 gcr.io/ango-438501/ango-backend
   ```

6. Start the frontend development server:
   ```
   npm run dev
   ```

## Usage

1. Open your browser and navigate to `http://localhost:3000` (or the port specified by your frontend)
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

For more details on the API endpoints, refer to the server.js and controllers/postController.js files.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
