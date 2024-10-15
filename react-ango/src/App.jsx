// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header.jsx';
import Form from './components/Form.jsx';
import PostList from './components/PostList.jsx';
import InfoPage from './components/InfoPage.jsx';
import API_URL from './config';

function App() {
  const [posts, setPosts] = useState([]);

  const handleAddPost = async (postData) => {
    try {
      const response = await fetch(`${API_URL}/api/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
      });
      if (response.ok) {
        const newPost = await response.json();
        console.log('Post added successfully');
        setPosts(prevPosts => [newPost, ...prevPosts]);
      } else {
        console.error('Failed to add post');
      }
    } catch (error) {
      console.error('Error adding post:', error);
    }
  };

  return (
    <Router>
      <div className="App" style={styles.appContainer}>
        <div style={styles.headerContainer}>
          <Header />
        </div>
        <Routes>
          <Route path="/" element={
            <>
              <Form onAddPost={handleAddPost} />
              <PostList posts={posts} setPosts={setPosts} />
            </>
          } />
          <Route path="/info" element={<InfoPage />} />
        </Routes>
        <div style={styles.infoLinkContainer}>
          <a href="/info" style={styles.infoLink}>info</a>
        </div>
      </div>
    </Router>
  );
}

const styles = {
  appContainer: {
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f4f4f9',
    color: '#333',
    margin: 0,
    padding: '20px',
    maxWidth: '100%',
    boxSizing: 'border-box',
  },
  headerContainer: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    marginBottom: '20px',
  },
  infoLinkContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '20px',
  },
  infoLink: {
    color: '#007BFF',
    textDecoration: 'none',
    fontSize: '14px',
  }
};

export default App;
