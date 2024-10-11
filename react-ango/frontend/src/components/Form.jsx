// src/components/Form.jsx
import React, { useState } from 'react';

function Form({ onAddPost }) {
  const [formVisible, setFormVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [question, setQuestion] = useState('');
  const [address, setAddress] = useState('');
  const [time, setTime] = useState('');
  const [ambiguousMode, setAmbiguousMode] = useState(false);
  const [visible, setVisible] = useState(false);
  const [visibilityIcon, setVisibilityIcon] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (typeof onAddPost === 'function') {
      await onAddPost({ title, question, address, time, visible, ambiguousMode });
      setFormVisible(false);
      // Reset form fields
      setTitle('');
      setQuestion('');
      setAddress('');
      setTime('');
      setAmbiguousMode(false);
      setVisible(false);
      setVisibilityIcon('');
      setError('');
    } else {
      console.error('onAddPost is not a function.');
    }
  };

  const checkAnswerVisibility = async () => {
    const questionText = question;
    setVisibilityIcon(''); // Clear the icon before checking
    setError('');
    if (questionText) {
      try {
        const response = await fetch('http://localhost:8000/api/check-answer-visibility', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ question: questionText })
        });
        const result = await response.json();
        if (result.isVisible) {
          setVisibilityIcon('✅');
          setVisible(true);
        } else {
          setVisibilityIcon('❌');
          setVisible(false);
        }
      } catch (error) {
        console.error('Error checking answer visibility:', error);
        setError('Failed to verify the answer. Please try again.');
      }
    } else {
      setError('Please enter a question to check.');
    }
  };

  return (
    <div style={styles.container}>
      <button onClick={() => setFormVisible(!formVisible)}>Create ANGO</button>
      {formVisible && (
        <form onSubmit={handleSubmit} style={styles.form}>
          <span onClick={() => setFormVisible(false)} style={styles.closeIcon}>&times;</span>
          <label style={styles.labelStyle}>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={styles.inputStyle}
            required
          />
          <label style={styles.labelStyle}>Question:</label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            style={styles.inputStyle}
            required
          />
          <button
            type="button"
            onClick={checkAnswerVisibility}
            style={styles.checkButton}
          >
            Check Visibility {visibilityIcon && <span style={styles.iconStyle}>{visibilityIcon}</span>}
          </button>
          {error && <p style={styles.errorText}>{error}</p>}
          <label style={styles.labelStyle}>Address:</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            style={styles.inputStyle}
            required
          />
          <label style={styles.labelStyle}>Time:</label>
          <input
            type="text"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            style={styles.inputStyle}
            required
          />
          <div style={styles.checkboxContainer}>
            <input
              type="checkbox"
              id="ambiguous-mode"
              checked={ambiguousMode}
              onChange={(e) => setAmbiguousMode(e.target.checked)}
              style={styles.checkboxStyle}
            />
            <label htmlFor="ambiguous-mode" style={styles.checkboxLabelStyle}>
              Use Ambiguous Matching Mode
            </label>
          </div>
          <button
            type="submit"
            style={styles.submitButton}
            disabled={!visible} // Disable if not visible
          >
            Add Post
          </button>
        </form>
      )}
    </div>
  );
}

const styles = {
  container: {
    marginTop: '20px'
  },
  toggleButton: {
    backgroundColor: '#007BFF',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px'
  },
  formStyle: {
    marginTop: '20px',
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    position: 'relative'
  },
  closeIcon: {
    cursor: 'pointer',
    position: 'absolute',
    top: '10px',
    right: '15px',
    fontSize: '24px',
    color: '#007BFF'
  },
  labelStyle: {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold'
  },
  inputStyle: {
    width: '100%',
    padding: '8px',
    marginBottom: '15px',
    borderRadius: '4px',
    border: '1px solid #ccc'
  },
  checkButton: {
    backgroundColor: '#17a2b8',
    color: '#fff',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    marginBottom: '15px'
  },
  submitButton: {
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    width: '100%'
  },
  checkboxContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '15px'
  },
  checkboxStyle: {
    marginRight: '10px'
  },
  checkboxLabelStyle: {
    fontFamily: 'Courier New, monospace',
    color: '#007BFF',
    fontSize: '14px'
  },
  iconStyle: {
    marginLeft: '5px',
    fontSize: '16px'
  },
  errorText: {
    color: 'red',
    marginBottom: '15px'
  }
};

export default Form;