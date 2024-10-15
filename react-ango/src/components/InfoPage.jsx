import React from 'react';

function InfoPage() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Gather with ANGO</h1>
      <div style={styles.poem}>
        <p style={styles.line}>In cryptic gatherings, we unite,</p>
        <p style={styles.line}>ANGO's platform, a puzzling delight.</p>
        <p style={styles.line}>Create and solve, with minds so keen,</p>
        <p style={styles.line}>New friendships forged, in this scene.</p>
      </div>
      <div style={styles.creditSection}>
        <p style={styles.creditTitle}>Credits:</p>
        <p style={styles.creditItem}>@ Cheney Li - Creator, Engineer</p>
        <p style={styles.creditItem}>@ Chunhan Chen - Designer</p>
      </div>
      <a href="/" style={styles.backLink}>Return to the gathering</a>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '40px',
    fontFamily: '"Garamond", serif',
    backgroundColor: '#f9f9f9',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    fontSize: '36px',
    color: '#333',
    marginBottom: '30px',
    textAlign: 'center',
    fontWeight: 'normal',
    fontStyle: 'italic',
  },
  poem: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  line: {
    fontSize: '18px',
    color: '#555',
    lineHeight: '1.6',
    margin: '0 0 10px 0',
  },
  creditSection: {
    marginTop: '20px',
    borderTop: '1px solid #ddd',
    paddingTop: '20px',
    textAlign: 'center',
  },
  creditTitle: {
    fontSize: '20px',
    color: '#333',
    marginBottom: '10px',
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
  creditItem: {
    fontSize: '16px',
    color: '#666',
    marginBottom: '5px',
    fontStyle: 'italic',
  },
  backLink: {
    marginTop: '20px',
    color: '#007BFF',
    textDecoration: 'none',
    fontSize: '18px',
    fontStyle: 'italic',
    transition: 'color 0.3s ease',
  },
};

export default InfoPage;
