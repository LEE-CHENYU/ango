import React, { useState, useEffect } from 'react';
import PostItem from './PostItem.jsx';
import { FiRefreshCw, FiSearch } from 'react-icons/fi';
import API_URL from '../config';

function PostList({ posts, setPosts }) {
  const [searchInput, setSearchInput] = useState('');
  const [rankedPosts, setRankedPosts] = useState([]);
  const [noRelevantResults, setNoRelevantResults] = useState(false);
  const [breakCounts, setBreakCounts] = useState({});

  const fetchPosts = async () => {
    try {
      const response = await fetch(`${API_URL}/api/posts`);
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
    fetchBreakCounts();
  }, []);

  // Update rankedPosts whenever posts change
  useEffect(() => {
    setRankedPosts(posts);
  }, [posts]);

  const rankPosts = async () => {
    if (searchInput.trim() === '') {
      setRankedPosts(posts);
      setNoRelevantResults(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/rank-posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input: searchInput, posts }),
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      const { ranked_posts, explanation, success } = await response.json();
      setRankedPosts(ranked_posts);
      setNoRelevantResults(!success);
      console.log('Ranking explanation:', explanation);
    } catch (error) {
      console.error('Error ranking posts:', error);
      setRankedPosts(posts);
      setNoRelevantResults(false);
    }
  };

  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const fetchBreakCounts = async () => {
    try {
      const response = await fetch(`${API_URL}/api/break-counts`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      setBreakCounts(data);
    } catch (error) {
      console.error('Error fetching break counts:', error);
    }
  };

  const updateBreakCount = async (postId) => {
    try {
      const response = await fetch(`${API_URL}/api/update-break-count/${postId}`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      const updatedCounts = await response.json();
      setBreakCounts(updatedCounts);
    } catch (error) {
      console.error('Error updating break count:', error);
    }
  };

  const getHardnessEmoji = (breakCount, attempts) => {
    if (attempts === 0) return '😐'; // No attempts yet
    const ratio = breakCount / attempts;
    if (ratio > 0.66) return '🤣'; // Easy
    if (ratio > 0.33) return '😅'; // Medium
    if (ratio > 0.1) return '😰'; // Hard
    return '😱'; // Extremely hard
  };

  return (
    <div>
      <div style={styles.controlsContainer}>
        <div style={styles.refreshIconContainer}>
          <FiRefreshCw
            onClick={fetchPosts}
            style={styles.refreshIcon}
          />
        </div>
        <input
          type="text"
          value={searchInput}
          onChange={handleSearchInputChange}
          placeholder="Search posts..."
          style={styles.searchInput}
        />
        <button onClick={rankPosts} style={styles.searchButton}>
          <FiSearch />
        </button>
      </div>
      {noRelevantResults && (
        <div style={styles.noResultsMessage}>
          No relevant results found
        </div>
      )}
      <div id="output" style={styles.outputContainer}>
        {rankedPosts.length === 0 ? (
          <p>No posts available.</p>
        ) : (
          rankedPosts.map((post) => (
            <PostItem 
              key={post.id} 
              post={post} 
              breakCount={breakCounts[post.id]?.breakCount || 0}
              attempts={breakCounts[post.id]?.attempts || 0}
              onQuestionBroken={updateBreakCount}
            />
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  controlsContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px',
  },
  refreshIconContainer: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px',
    border: '2px solid #007BFF',
    borderRadius: '4px',
    cursor: 'pointer',
    marginRight: '10px',
  },
  refreshIcon: {
    fontSize: '24px',
    color: '#007BFF',
  },
  searchInput: {
    flex: 1,
    padding: '10px',
    fontSize: '16px',
    border: '2px solid #007BFF',
    borderRadius: '4px',
    marginRight: '10px',
  },
  searchButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10px',
    fontSize: '16px',
    backgroundColor: '#007BFF',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  outputContainer: {
    marginTop: '20px',
  },
  noResultsMessage: {
    textAlign: 'center',
    color: 'rgba(0, 0, 0, 0.5)',
    fontSize: '14px',
    marginTop: '10px',
    marginBottom: '10px',
  },
};

export default PostList;