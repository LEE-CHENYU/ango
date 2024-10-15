import React, { useState, useEffect } from 'react';
import posthog from 'posthog-js';
import API_URL from '../config';

function PostItem({ post }) {
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheckAnswer = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/api/check-answer-ambiguity`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          correctAnswer: post.answer, 
          userAnswer: userAnswer,
          ambiguousMode: post.ambiguous_mode
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
    <div style={postContainerStyle}>
      <p><strong>Question:</strong> {post.question} {isCorrect ? '✅' : isCorrect === false ? '❌' : ''}
      {post.llmBreakable && <span role="img" aria-label="LLM Breakable">🤖</span>}
      {post.ambiguous_mode && <span role="img" aria-label="Ambiguous Mode">🌫️</span>}
      </p>
      <p><strong>Address:</strong> {post.address}</p>
      <p><strong>Time:</strong> {post.time}</p>
      {post.visible && (
        <div className="visible-content" style={visibleContentStyle}>
          <p>This content is visible because the answer was verified.</p>
          <p><strong>Answer:</strong> {post.answer}</p>
        </div>
      )}
      <div style={answerSectionStyle}>
        <input
          type="text"
          placeholder="Your Answer"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          style={answerInputStyle}
        />
        <button
          onClick={handleCheckAnswer}
          style={checkButtonStyle}
          disabled={isLoading || userAnswer.trim() === ''}
        >
          {isLoading ? 'Checking...' : 'Check Answer'}
        </button>
      </div>
      {error && <p style={errorTextStyle}>{error}</p>}
    </div>
  );
}

// Inline Styles
const postContainerStyle = {
  marginBottom: '20px',
  padding: '10px',
  border: '1px solid #ccc',
  borderRadius: '5px',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  backgroundColor: '#fff'
};

const visibleContentStyle = {
  marginTop: '10px',
  padding: '10px',
  backgroundColor: '#e9f7ef',
  borderRadius: '5px'
};

const answerSectionStyle = {
  marginTop: '15px'
};

const answerInputStyle = {
  padding: '8px',
  borderRadius: '4px',
  border: '1px solid #ccc',
  width: '60%'
};

const checkButtonStyle = {
  padding: '8px',
  borderRadius: '4px',
  border: '1px solid #ccc',
  width: '20%',
  marginLeft: '10px'
};

const errorTextStyle = {
  color: 'red',
  marginLeft: '10px'
};

export default PostItem;
