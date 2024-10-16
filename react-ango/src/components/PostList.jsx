import React, { useState, useEffect } from 'react';
import PostItem from './PostItem';
import { FiRefreshCw, FiSearch } from 'react-icons/fi';
import API_URL from '../config';

function PostList({ posts, setPosts }) {
  const [searchInput, setSearchInput] = useState('');
  const [rankedPosts, setRankedPosts] = useState([]);
  const [noRelevantResults, setNoRelevantResults] = useState(false);
  const [breakCounts, setBreakCounts] = useState({});
  const [postRatios, setPostRatios] = useState({});
  const [isSearching, setIsSearching] = useState(false);

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

  const fetchBreakCounts = async () => {
    try {
      const response = await fetch(`${API_URL}/api/break-counts`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      setBreakCounts(data);

      // Calculate ratios
      const ratios = Object.entries(data).reduce((acc, [postId, counts]) => {
        acc[postId] = counts.attempts > 0 ? counts.breakCount / counts.attempts : 0;
        return acc;
      }, {});
      setPostRatios(ratios);
    } catch (error) {
      console.error('Error fetching break counts:', error);
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

    setIsSearching(true);
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
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  /**
   * Updated updateBreakCount to accept isCorrect flag
   */
  const updateBreakCount = async (postId, isCorrect) => {
    try {
      const response = await fetch(`${API_URL}/api/update-break-count/${postId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isCorrect }) // Pass the isCorrect flag correctly
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const updatedCounts = await response.json();
      setBreakCounts(updatedCounts);

      // Recalculate ratios after update
      const updatedRatios = Object.entries(updatedCounts).reduce((acc, [id, counts]) => {
        acc[id] = counts.attempts > 0 ? counts.breakCount / counts.attempts : 0;
        return acc;
      }, {});
      setPostRatios(updatedRatios);
    } catch (error) {
      console.error('Error updating break count:', error);
    }
  };

  return (
    <div>
      <div style={styles.controlsContainer}>
        <h3 style={styles.title}>ANGOs</h3>
        <div style={styles.searchContainer}>
          <input
            type="text"
            value={searchInput}
            onChange={handleSearchInputChange}
            placeholder="Search ANGOs..."
            style={styles.searchInput}
          />
          <button onClick={rankPosts} style={styles.searchButton}>
            <FiSearch />
          </button>
        </div>
        <div style={styles.refreshIconContainer} onClick={fetchPosts}>
          <FiRefreshCw style={styles.refreshIcon} />
        </div>
      </div>
      {isSearching && (
        <div style={styles.searchingMessage}>
          Searching very hard...
        </div>
      )}
      {noRelevantResults && (
        <div style={styles.noResultsMessage}>
          No relevant results found
        </div>
      )}
      <div id="output" style={styles.outputContainer}>
        {rankedPosts.length === 0 ? (
          <div style={styles.noAngosContainer}>
            <p style={styles.noAngosText}>No ANGOs available.</p>
          </div>
        ) : (
          rankedPosts.map((post) => (
            <PostItem
              key={post.id}
              post={post}
              breakCount={breakCounts[post.id]?.breakCount || 0}
              attempts={breakCounts[post.id]?.attempts || 0}
              ratio={postRatios[post.id] || 0}
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
    fontFamily: 'Lato, sans-serif',
  },
  title: {
    margin: '0 20px 0 0',
    fontSize: '16px',
    fontWeight: '600',
    fontFamily: 'Lato, sans-serif',
  },
  searchContainer: {
    display: 'flex',
    flex: 1,
    fontFamily: 'Lato, sans-serif',
  },
  searchInput: {
    flex: 1,
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '4px 0 0 4px',
    fontFamily: 'Lato, sans-serif',
  },
  searchButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10px',
    fontSize: '16px',
    backgroundColor: '#4285F4',
    color: '#fff',
    border: 'none',
    borderRadius: '0 4px 4px 0',
    cursor: 'pointer',
    fontFamily: 'Lato, sans-serif',
  },
  refreshIconContainer: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px',
    cursor: 'pointer',
    marginLeft: '10px',
    fontFamily: 'Lato, sans-serif',
  },
  refreshIcon: {
    fontSize: '20px',
    color: '#4285F4',
    fontFamily: 'Lato, sans-serif',
  },
  searchingMessage: {
    color: '#4285F4',
    marginBottom: '20px',
    fontFamily: 'Lato, sans-serif',
    textAlign: 'center',
  },
  noResultsMessage: {
    color: 'red',
    marginBottom: '20px',
    fontFamily: 'Lato, sans-serif',
  },
  outputContainer: {
    fontFamily: 'Lato, sans-serif',
  },
  noAngosContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '200px',
  },
  noAngosText: {
    fontSize: '18px',
    color: '#666',
    fontFamily: 'Lato, sans-serif',
  },
};

export default PostList;