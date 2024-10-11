import React, { useState } from 'react';

function PostItem({ post }) {
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);
  const [isAmbiguous, setIsAmbiguous] = useState(false);

  const handleAnswerInput = async (e) => {
    const answerInput = e.target.value.toLowerCase();
    setUserAnswer(answerInput);

    const isAmbiguousMode = post.ambiguousMode;

    if (isAmbiguousMode) {
      try {
        const response = await fetch('http://localhost:8000/check-answer-ambiguity', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ userAnswer: answerInput, answer: post.answer })
        });
        const result = await response.json();
        setIsCorrect(result.isCorrect);
      } catch (error) {
        console.error('Error checking answer ambiguity:', error);
      }
    } else {
      setIsCorrect(answerInput === post.answer.toLowerCase());
    }
  };

  const toggleDisplay = () => {
    // This function can toggle additional content if needed
  };

  return (
    <div style={postContainerStyle}>
      <h3>
        {post.title} {post.visible ? '👁️' : ''}
      </h3>
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
          onChange={handleAnswerInput}
          style={answerInputStyle}
        />
        {isCorrect === true && <span style={correctStyle}>✅ Correct</span>}
        {isCorrect === false && <span style={incorrectStyle}>❌ Incorrect</span>}
      </div>
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

const correctStyle = {
  color: 'green',
  marginLeft: '10px'
};

const incorrectStyle = {
  color: 'red',
  marginLeft: '10px'
};

export default PostItem;