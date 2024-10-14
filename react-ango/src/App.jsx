// src/App.jsx
import React, { useState } from 'react';
import Header from './components/Header.jsx';
import Form from './components/Form.jsx';
import PostList from './components/PostList.jsx';
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
        setPosts(prevPosts => [newPost, ...prevPosts]); // Update posts state
      } else {
        console.error('Failed to add post');
      }
    } catch (error) {
      console.error('Error adding post:', error);
    }
  };

  return (
    <div className="App" style={styles.appContainer}>
      <div style={styles.headerContainer}>
        <Header />
      </div>
      <Form onAddPost={handleAddPost} />
      <PostList posts={posts} setPosts={setPosts} />
    </div>
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
  }
};

export default App;
