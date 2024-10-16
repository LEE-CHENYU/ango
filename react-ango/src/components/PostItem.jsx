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
  const [resultMessage, setResultMessage] = useState('');
  const [showHardnessEmoji, setShowHardnessEmoji] = useState(true);

  const getHardnessEmoji = (ratioValue) => {
    if (attempts === 0) return '😐';
    console.log(`Post ${post.id} - Ratio: ${ratioValue.toFixed(2)}, Breaks: ${breakCount}, Attempts: ${attempts}`);
    if (ratioValue > 0.66) return `😅`;
    if (ratioValue > 0.33) return `😓`;
    if (ratioValue > 0.1) return `😰`;
    return `😱`;
  };

  const handleCheckAnswer = async () => {
    setIsLoading(true);
    setError('');
    setShowHardnessEmoji(false);
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
        const errorData = await response.json();
        throw new Error(errorData.message || `Server Error: ${response.status} - ${response.statusText}`);
      }

      const result = await response.json();

      if (result.isCorrect) {
        setIsCorrect(true);
        posthog.capture('question_broken', { 
          postId: post.id,
          question: post.question
        });
        const newBreakCount = breakCount + 1;
        const newAttempts = attempts + 1;
        const newRatio = newBreakCount / newAttempts;
        setCurrentRatio(newRatio);
        await onQuestionBroken(post.id, true);
      } else {
        setIsCorrect(false);
        const newBreakCount = breakCount;
        const newAttempts = attempts + 1;
        const newRatio = newBreakCount / newAttempts;
        setCurrentRatio(newRatio);
        await onQuestionBroken(post.id, false);
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

  useEffect(() => {
    setCurrentRatio(ratio);
  }, [ratio]);

  return (
    <div style={styles.postContainer}>
      <div style={styles.headerContainer}>
        <div style={styles.questionContainer}>
          {post.question}
          {post.llm_breakable === false && <span role="img" aria-label="LLM Breakable">🔒</span>}
          {post.ambiguous_mode && <span role="img" aria-label="Ambiguous Mode">🤖</span>}
        </div>
        <div style={styles.emojiContainer}>
          {showHardnessEmoji ? (
            <span style={styles.hardnessEmoji}>{getHardnessEmoji(currentRatio)}</span>
          ) : (
            <span>{isCorrect ? '✅' : isCorrect === false ? '❌' : ''}</span>
          )}
        </div>
      </div>
      <div style={styles.answerSection}>
        <input
          type="text"
          placeholder="Your answer"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          style={styles.answerInput}
        />
        <button
          onClick={handleCheckAnswer}
          style={styles.checkButton}
          disabled={isLoading || userAnswer.trim() === ''}
        >
          {isLoading ? 'Checking...' : 'Check'}
        </button>
      </div>
      {error && <p style={styles.errorText}>{error}</p>}
      {isCorrect && (
        <div style={styles.detailsContainer}>
          <p><strong>Address:</strong> {post.address}</p>
          <p><strong>Time:</strong> {post.time}</p>
        </div>
      )}
    </div>
  );
}

const styles = {
  postContainer: {
    marginBottom: '20px',
    padding: '15px',
    border: '1px solid transparent',
    borderRadius: '8px',
    backgroundColor: '#fff',
    fontFamily: 'Lato, sans-serif',
  },
  headerContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
    fontFamily: 'Lato, sans-serif',
  },
  questionContainer: {
    flex: 1,
    fontSize: '16px',
    fontFamily: 'Lato, sans-serif',
    fontWeight: 300,
  },
  emojiContainer: {
    minWidth: '30px',
    textAlign: 'right',
    fontFamily: 'Lato, sans-serif',
  },
  answerSection: {
    display: 'flex',
    alignItems: 'center',
    fontFamily: 'Lato, sans-serif',
    fontWeight: 100,
  },
  answerInput: {
    flex: 1,
    padding: '8px 0',
    fontSize: '16px',
    border: 'none',
    borderBottom: '1px solid rgba(0, 0, 0, 0.2)',
    backgroundColor: 'transparent',
    marginRight: '10px',
    outline: 'none',
    fontFamily: 'Lato, sans-serif',
  },
  checkButton: {
    padding: '8px 16px',
    backgroundColor: 'transparent',
    color: '#4285F4',
    border: '2px solid #4285F4',
    borderRadius: '12px',
    cursor: 'pointer',
    fontFamily: 'Lato, sans-serif',
    fontSize: '16px',
    fontWeight: 200,
    textTransform: 'capitalize',
  },
  errorText: {
    color: 'red',
    marginTop: '10px',
    fontFamily: 'Lato, sans-serif',
  },
  detailsContainer: {
    marginTop: '15px',
    padding: '10px',
    backgroundColor: '#e6f2ff',
    borderRadius: '5px',
    fontFamily: 'Lato, sans-serif',
  },
  hardnessEmoji: {
    fontSize: '1.2em',
    fontFamily: 'Lato, sans-serif',
  }
};

export default PostItem;
