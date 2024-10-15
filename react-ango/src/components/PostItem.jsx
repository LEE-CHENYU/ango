// src/components/PostItem.jsx
import React, { useState, useEffect } from 'react';
import API_URL from '../config';
import posthog from 'posthog-js';

function PostItem({ post, breakCount, attempts, ratio, onQuestionBroken }) {
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentRatio, setCurrentRatio] = useState(ratio);

  const getHardnessEmoji = (ratioValue) => {
    if (attempts === 0) return '😐'; // No attempts yet
    console.log(`Post ${post.id} - Ratio: ${ratioValue.toFixed(2)}, Breaks: ${breakCount}, Attempts: ${attempts}`);
    if (ratioValue > 0.66) return `😅`; // Easy
    if (ratioValue > 0.33) return `😓`; // Medium
    if (ratioValue > 0.1) return `😰`; // Hard
    return `😱`; // Extremely hard
  };

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
        throw new Error(`Server Error: ${response.status} - ${response.statusText}`);
      }

      const result = await response.json();

      if (result.isCorrect) {
        setIsCorrect(true);
        posthog.capture('question_broken', { 
          postId: post.id,
          question: post.question
        });
        onQuestionBroken(post.id);
        // Update the ratio locally
        setCurrentRatio((prevRatio) => {
          const newBreakCount = breakCount + 1;
          const newAttempts = attempts + 1;
          return newBreakCount / newAttempts;
        });
      } else {
        setIsCorrect(false);
        // Update attempts locally
        setCurrentRatio((prevRatio) => {
          const newAttempts = attempts + 1;
          return breakCount / newAttempts;
        });
      }
    } catch (err) {
      console.error('Error checking answer:', err);
      setError('Failed to verify the answer. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isCorrect) {
      posthog.capture('post_contents_viewed', { 
        postId: post.id,
        question: post.question
      });
    }
  }, [isCorrect]);

  // Update current ratio if the ratio prop changes (e.g., after fetching new data)
  useEffect(() => {
    setCurrentRatio(ratio);
  }, [ratio]);

  return (
    <div style={styles.postContainer}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          {post.question}
          {post.llm_breakable && <span role="img" aria-label="LLM Breakable">🤖</span>}
          {post.ambiguous_mode && <span role="img" aria-label="Ambiguous Mode">🌫️</span>} 
          <span style={styles.hardnessEmoji}>{getHardnessEmoji(currentRatio)}</span>
        </div>
        <div>
          {isCorrect ? '✅' : isCorrect === false ? '❌' : ''}
        </div>
      </div>
      
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
  hardnessEmoji: {
    fontSize: '1.2em',
    marginLeft: '10px',
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