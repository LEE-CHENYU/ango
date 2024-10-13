// src/components/PostItem.jsx
import React, { useState } from 'react';

function PostItem({ post }) {
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheckAnswer = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:8080/api/check-answer-ambiguity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          correctAnswer: post.answer, 
          userAnswer: userAnswer,
          ambiguousMode: post.ambiguous_mode // Assuming the post object has this property
        })
      });

      if (!response.ok) {
        console.error(`Server Error: ${response.status} - ${response.statusText}`);
        const errorBody = await response.text();
        console.error(`Error body: ${errorBody}`);
        throw new Error(`Server Error: ${response.status} - ${response.statusText}. Details: ${errorBody}`);
      }

      const result = await response.json();

      if (result.isCorrect) {
        setIsCorrect(true);
      } else {
        setIsCorrect(false);
      }
    } catch (err) {
      console.error('Error checking answer:', err);
      setError('Failed to verify the answer. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div style={styles.postContainer}>
      {post.question} {isCorrect ? '✅' : isCorrect === false ? '❌' : ''}
      {post.llm_breakable && <span role="img" aria-label="LLM Breakable">🤖</span>}
      {post.ambiguous_mode && <span role="img" aria-label="Ambiguous Mode">🌫️</span>}
      
      <div style={styles.answerSection}>
        <input
          type="text"
          placeholder="Enter your answer"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          style={styles.answerInput}
        />
        <button
          onClick={handleCheckAnswer}
          style={styles.checkButton}
          disabled={isLoading || userAnswer.trim() === ''}
        >
          {isLoading ? 'Checking...' : 'Check Answer'}
        </button>
      </div>

      {error && <p style={styles.errorText}>{error}</p>}
      
      {isCorrect && (
        <div style={styles.detailsContainer}>
          <p><strong>Address:</strong> {post.address}</p>
          <p><strong>Time:</strong> {post.time}</p>
          {/* Add more details as needed */}
        </div>
      )}
    </div>
  );
}

// Inline Styles
const styles = {
  postContainer: {
    marginBottom: '20px',
    padding: '15px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.05)',
    backgroundColor: '#fff'
  },
  answerSection: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '10px'
  },
  answerInput: {
    flex: 1,
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    marginRight: '10px'
  },
  checkButton: {
    padding: '8px 16px',
    backgroundColor: '#007BFF',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  detailsContainer: {
    marginTop: '15px',
    padding: '10px',
    backgroundColor: '#e6f2ff',
    borderRadius: '5px'
  },
  errorText: {
    color: 'red',
    marginTop: '10px'
  }
};

export default PostItem;
