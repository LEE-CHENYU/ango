import React, { useState, useEffect } from 'react';
import PostItem from './PostItem.jsx';

function PostList({ posts, setPosts }) {
  const fetchPosts = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/posts'); // Ensure the URL is correct
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []); // Removed eslint-disable comment

  return (
    <div>
      <button
        onClick={fetchPosts}
        style={styles.refreshButton}
      >
        Refresh Posts
      </button>
      <div id="output" style={styles.outputContainer}>
        {posts.length === 0 ? (
          <p>No posts available.</p>
        ) : (
          posts.map(post => (
            <PostItem key={post.id} post={post} />
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  refreshButton: {
    backgroundColor: '#007BFF',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    marginBottom: '20px'
  },
  outputContainer: {
    marginTop: '20px'
  }
};

export default PostList;