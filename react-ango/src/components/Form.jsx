// src/components/Form.jsx
import React, { useState } from 'react';
import API_URL from '../config';

function Form({ onAddPost }) {
  const [formVisible, setFormVisible] = useState(false);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [address, setAddress] = useState('');
  const [time, setTime] = useState('');
  const [ambiguous_mode, setAmbiguous_mode] = useState(false);
  const [llm_breakable, setLlm_breakable] = useState(false);
  const [breakabilityStatus, setBreakabilityStatus] = useState('Check Breakability');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (typeof onAddPost === 'function') {
      // Check if any field is empty
      if (!question.trim() || !answer.trim() || !address.trim() || !time.trim()) {
        setError('All fields are required. Please fill in all the information.');
        return;
      }
      await onAddPost({ question, answer, address, time, llm_breakable, ambiguous_mode });
      setFormVisible(false);
      // Reset form fields
      setQuestion('');
      setAnswer('');
      setAddress('');
      setTime('');
      setAmbiguous_mode(false);
      setLlm_breakable(false);
      setBreakabilityStatus('Check Breakability');
      setError('');
    } else {
      console.error('onAddPost is not a function.');
    }
  };

  const checkQuestionBreakability = async () => {
    setError('');
    if (question.trim()) {
      try {
        const response = await fetch(`${API_URL}/api/check-answer-breakability`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ question })
        });
        const result = await response.json();
        if (result.isBreakable) {
          setBreakabilityStatus('❌ LLM Breakable');
          setLlm_breakable(true);
        } else {
          setBreakabilityStatus('✅ LLM Unbreakable');
          setLlm_breakable(false);
        }
      } catch (error) {
        console.error('Error checking answer breakability:', error);
        setError('Failed to verify the answer breakability. Please try again.');
      }
    } else {
      setError('Please enter a question to check.');
    }
  };

  return (
    <div style={{ ...styles.container, marginTop: '40px', marginBottom: '40px' }}>
      <button onClick={() => setFormVisible(!formVisible)} style={styles.createButton}>Create ANGO</button>
      {formVisible && (
        <div style={{ ...styles.formContainer, paddingRight: '30px', position: 'relative', marginTop: '20px' }}>
          <span onClick={() => setFormVisible(false)} style={styles.closeIcon}>&times;</span>
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={{ marginTop: '30px' }}>
              <div style={styles.inputGroup}>
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  style={styles.inputStyle}
                  required
                  placeholder="ANGO"
                />
              </div>
              <div style={styles.inputGroup}>
                <input
                  type="text"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  style={styles.inputStyle}
                  required
                  placeholder="Match Word"
                />
              </div>
              <div style={styles.checkboxContainer}>
                <input
                  type="checkbox"
                  id="ambiguous-mode"
                  checked={ambiguous_mode}
                  onChange={(e) => setAmbiguous_mode(e.target.checked)}
                  style={styles.checkboxStyle}
                />
                <label htmlFor="ambiguous-mode" style={styles.checkboxLabelStyle}>
                  Getting my meaning is fine!
                </label>
                <button
                  type="button"
                  onClick={checkQuestionBreakability}
                  style={{...styles.checkButton, marginLeft: 'auto'}}
                >
                  {breakabilityStatus}
                </button>
              </div>
              {error && <p style={styles.errorText}>{error}</p>}
              <div style={styles.inputGroup}>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  style={styles.inputStyle}
                  required
                  placeholder="Address"
                />
              </div>
              <div style={styles.inputGroup}>
                <input
                  type="text"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  style={styles.inputStyle}
                  required
                  placeholder="Time"
                />
              </div>
              <button
                type="submit"
                style={styles.submitButton}
              >
                Add ANGO
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    marginTop: '20px'
  },
  formContainer: {
    maxWidth: '500px',
    margin: '0 auto',
    backgroundColor: '#f9fafc',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.05)'
  },
  createButton: {
    backgroundColor: '#007BFF',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '16px',
    fontFamily: 'Lato, sans-serif',
    fontWeight: '450'
  },
  form: {
    position: 'relative'
  },
  closeIcon: {
    cursor: 'pointer',
    position: 'absolute',
    top: '10px',
    right: '15px',
    fontSize: '24px',
    color: '#4a90e2'
  },
  labelStyle: {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
    fontFamily: 'Lato, sans-serif'
  },
  inputStyle: {
    width: '100%',
    padding: '8px',
    marginBottom: '15px',
    borderRadius: '4px',
    border: '1px solid #e1e4e8',
    fontFamily: 'Lato, sans-serif'
  },
  inputGroup: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
    width: '100%'
  },
  checkButton: {
    backgroundColor: '#4a90e2',
    color: '#fff',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontFamily: 'Lato, sans-serif',
    whiteSpace: 'nowrap',
    marginLeft: '10px'
  },
  submitButton: {
    backgroundColor: '#4a90e2',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    width: '100%',
    fontFamily: 'Lato, sans-serif'
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
    fontFamily: 'Lato, sans-serif',
    color: '#4a90e2',
    fontSize: '14px'
  },
  errorText: {
    color: '#ff6b6b',
    marginBottom: '15px',
    fontFamily: 'Lato, sans-serif'
  }
};

export default Form;