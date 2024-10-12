import React, { useState, useEffect } from 'react';
import PostItem from './PostItem.jsx';
import { FiRefreshCw } from 'react-icons/fi';

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
      <div style={styles.refreshIconContainer}>
        <FiRefreshCw
          onClick={fetchPosts}
          style={styles.refreshIcon}
        />
      </div>
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
  refreshIconContainer: {
    display: 'inline-block',
    padding: '8px',
    border: '2px solid #007BFF',
    borderRadius: '4px',
    cursor: 'pointer',
    marginBottom: '20px'
  },
  refreshIcon: {
    fontSize: '24px',
    color: '#007BFF'
  },
  outputContainer: {
    marginTop: '20px'
  }
};

export default PostList;