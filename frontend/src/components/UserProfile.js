import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';

const UserProfile = () => {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [articles, setArticles] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false); // State to track follow status
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`http://localhost:5000/user/${username}`);
        if (!response.ok) {
          throw new Error('User not found');
        }
        const data = await response.json();
        console.log(data);
        setUser(data.user);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    const fetchArticles = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/${username}/articles`);
        if (!response.ok) {
          throw new Error('Articles not found');
        }
        const data = await response.json();
        console.log(data);
        setArticles(data.articles);
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    };

    const checkFollowingStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/user/${username}/is-following`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setIsFollowing(data.isFollowing);
      } catch (error) {
        console.error('Error checking following status:', error);
      }
    };

    fetchUser();
    fetchArticles();
    checkFollowingStatus();
  }, [username]);

  const handleFollowToggle = async () => {
    try {
      const token = localStorage.getItem('token'); // Retrieve the token from localStorage
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`http://localhost:5000/user/follow/${username}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Add the token to the Authorization header
        },
        body: JSON.stringify({ follow: !isFollowing }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update follow status');
      }

      const data = await response.json();
      console.log("This is response from backend for follow request:", data);
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error('Error updating follow status:', error);
    }
  };

  const handleArticleClick = (id) => {
    navigate(`/articles/${id}`);
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div
      style={{
        margin: '5% 5% 1% 5%',
        color: '#000',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f9f9f9',
        padding: '20px',
        borderRadius: '10px',
        width: '80%'
      }}
      className="user-profile-container"
    >
      <h1 style={{ textAlign: 'center' }}>{user.username}</h1>
      <p style={{ textAlign: 'center', marginBottom: '20px' }}>Email: {user.email}</p>
      <button
        onClick={handleFollowToggle}
        className="follow-button"
        style={{
          display: 'block',
          margin: '0 auto 30px auto',
          backgroundColor: isFollowing ? 'red' : 'green',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        {isFollowing ? 'Unfollow' : 'Follow'}
      </button>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Articles</h2>
      <div
        className="articles-list"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        {articles.map((article) => (
          <div
            className="article-card"
            key={article.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#f9f9f9',
              borderRadius: '10px',
              overflow: 'hidden',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.2s',
              cursor: 'pointer',
            }}
            onClick={() => handleArticleClick(article.id)}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            {article.images && article.images.length > 0 && (
              <img
                src={`http://localhost:5000${article.images[0]}`}
                alt={`Thumbnail for ${article.title}`}
                style={{
                  width: '150px',
                  height: '150px',
                  objectFit: 'cover',
                  flexShrink: 0,
                }}
              />
            )}
            <div
              className="article-content"
              style={{ padding: '15px', color: '#000', flexGrow: 1 }}
            >
              <h3
                className="article-title"
                style={{
                  fontSize: '18px',
                  marginBottom: '10px',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                }}
              >
                {article.title}
              </h3>
              <Link
                to={`/user/${user.username}`}
                onClick={(e) => e.stopPropagation()}
                style={{ textDecoration: 'none', color: '#1e90ff' }}
              >
                <p className="article-author">By {user.username}</p>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserProfile;
