import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';  
import { exec } from 'child_process'; // Import child_process module
import posts from './routes/posts.js';
import logger from './middleware/logger.js';
import errorHandler from './middleware/error.js';
import notFound from './middleware/notFound.js';
const port = process.env.PORT || 8000;

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// const json = '{"question": "What is the capital of France?"}';

app.get('/js/main.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'js', 'main.js'));
  });

app.use(express.json());

// Endpoint to execute the Python script
app.post('/check-answer-breakability', (req, res) => {
    // req.body = json;
    // const requestBody = JSON.parse(req.body);
    // const question = requestBody.question;
    const question = req.body.question;
    exec(`python3 /Users/chenyusu/ango/answer_checker.py "${question}"`, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return res.status(500).json({ 
                error: 'Error executing script', 
                details: error.message 
            });
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return res.status(500).json({ 
                error: 'Script error', 
                details: stderr 
            });
        }
        res.json({ result: stdout.trim() });
    });
});

app.post('/check-answer-ambiguity', (req, res) => {
    const { userAnswer, answer } = req.body;
    // const requestBody1 = JSON.parse('{"question": "KOU"}');
    // const userAnswer = requestBody1.question;
    // const requestBody2 = JSON.parse('{"question": "Kou"}');
    // const answer = requestBody2.question;
    exec(`python3 /Users/chenyusu/ango/answer_checker.py "${userAnswer}" "${answer}"`, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return res.status(500).json({ 
                error: 'Error executing script', 
                details: error.message 
            });
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return res.status(500).json({ 
                error: 'Script error', 
                details: stderr 
            });
        }
        res.json({ isCorrect: stdout.trim() === '1' });
    });
});

// Body parser middleware
app.use(express.urlencoded({ extended: false }));
app.use(logger);

//setup static folder
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/posts', posts);

app.use(notFound);
app.use(errorHandler);

// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

// app.get('/about', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'about.html'));
// });

app.listen(port, () => console.log(`Server is running on port ${port}`));