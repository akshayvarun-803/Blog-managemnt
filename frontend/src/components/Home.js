import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaHeart, FaComment, FaShare, FaBookmark} from "react-icons/fa";
// import io from 'socket.io-client';
// import CommentForm from "./CommentForm";

const Home = () => {
  const [articles, setArticles] = useState([]);
  // const [commentModalOpen, setCommentModalOpen] = useState(false);
  // const [selectedArticle, setSelectedArticle] = useState(null);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // If you're using Socket.IO for real-time, initialize it here
  // Just as an example; not strictly required if you only do HTTP requests
  // useEffect(() => {
  //   const socket = io('http://localhost:5000');
  //   socket.on('connect', () => {
  //     console.log('Connected to Socket.IO server');
  //   });
  //   return () => socket.disconnect();
  // }, []);

  const fetchArticles = async () => {
    try {
      const response = await fetch(`http://localhost:5000/articles/feed`);
      if (!response.ok) {
        throw new Error("Error fetching articles");
      }
      const data = await response.json();
      setArticles(data.articles);
    } catch (error) {
      console.error("Error fetching articles:", error.message);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleArticleClick = (id) => {
    navigate(`/articles/${id}`);
  };

  const handleLike = async (article) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/likes/${currentUser.username}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ articleId: article.id }),
        }
      );
      if (!response.ok) throw new Error("Error liking article");
      const updatedArticle = await response.json();
      
      setArticles((prevArticles) =>
        prevArticles.map((a) => (a.id === updatedArticle.id ? updatedArticle : a))
      );
    } catch (error) {
      console.error("Error liking article:", error.message);
    }
  };

  const handleSave = async (article) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/${article.author}/saved-posts`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ articleId: article.id }),
        }
      );
      if (!response.ok) throw new Error("Error saving article");
      const updatedArticle = await response.json();
      
      setArticles((prevArticles) =>
        prevArticles.map((a) => (a.id === updatedArticle.id ? updatedArticle : a))
      );
    } catch (error) {
      console.error("Error saving article:", error.message);
    }
  };

  // const handleCommentClick = (article) => {
  //   // setSelectedArticle(article);
  //   // setCommentModalOpen(true);
  //   navigate(`/articles/${article.id}`);
  // };

  // // Called when a new comment is created by CommentForm
  // const onCommentAdded = (newComment) => {
  //   setArticles((prevArticles) =>
  //     prevArticles.map((article) => 
  //       article.id === newComment.article_id 
  //         ? { ...article, comments: [...(article.comments || []), newComment] }
  //         : article
  //     )
  //   );
  //   setCommentModalOpen(false);
  // };

  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 py-7 flex flex-col lg:flex-row">
        {/* Articles Section */}
        <div className="lg:w-2/3">
          <h1 className="text-4xl font-bold text-center lg:text-left mb-8">Latest Articles</h1>

          <div className="space-y-6">
            {articles.map((article) => (
              <div
                key={article.id}
                className="flex flex-col sm:flex-row bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                {/* Image Section */}
                {article.images && article.images.length > 0 && (
                  <img
                    src={`http://localhost:5000${article.images[0]}`}
                    alt={`Thumbnail for ${article.title}`}
                    className="w-full sm:w-1/4 h-48 sm:h-auto object-cover rounded-t-lg sm:rounded-l-lg sm:rounded-t-none"
                  />
                )}

                {/* Content Section */}
                <div className="flex flex-col justify-between p-4 flex-1">
                  <div>
                    <h2
                      className="text-xl font-semibold mb-2 text-gray-100 hover:text-teal-400 cursor-pointer"
                      onClick={() => handleArticleClick(article.id)}
                    >
                      {article.title}
                    </h2>
                    <p className="text-gray-400 text-sm mb-4">
                      {article.description || "No description available."}
                    </p>
                    <Link
                      to={`/user/${article.author}`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-teal-400 hover:text-yellow-400 text-sm"
                    >
                      By {article.author}
                    </Link>
                  </div>

                  {/* Action Icons */}
                  <div className="flex items-center justify-between mt-4">
                    <button 
                      onClick={() => handleLike(article)} 
                      className={`flex items-center ${article.likes > 0 ? 'text-red-500' : 'text-gray-400'} hover:text-red-500 transition-all duration-300`}
                    >
                      <FaHeart className={`mr-2 ${article.likes > 0 ? '' : ''}`} />
                      {article.likes > 0 ? article.likes : 'No'} Likes
                    </button>
                    
                    {/* <button 
                      onClick={() => handleArticleClick()} 
                      className="flex items-center text-gray-400 hover:text-blue-500"
                    >
                      <FaComment className="mr-2" /> Comment
                    </button> */}

                    <button className="flex items-center text-gray-400 hover:text-green-500">
                      <FaShare className="mr-2" /> Share
                    </button>

                    <button 
                      onClick={() => handleSave(article)}  
                      className="flex items-center text-gray-400 hover:text-yellow-500"
                    >
                      <FaBookmark className="mr-2" /> Save
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Suggestions Section */}
        <div className="lg:w-1/3 lg:pl-8 mt-8 lg:mt-0">
          <h2 className="text-2xl font-semibold mb-4">Suggestions</h2>
          <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
            <p className="text-gray-400">
              Here are some suggestions for you based on your interests.
            </p>
            <ul className="mt-4 space-y-2">
              <li className="text-teal-400 hover:text-yellow-400 cursor-pointer">
                Suggested Article 1
              </li>
              <li className="text-teal-400 hover:text-yellow-400 cursor-pointer">
                Suggested Article 2
              </li>
              <li className="text-teal-400 hover:text-yellow-400 cursor-pointer">
                Suggested Article 3
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
