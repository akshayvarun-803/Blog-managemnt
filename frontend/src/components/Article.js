import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; 

const Article = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [article, setArticle] = useState(null);
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);


  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(`http://localhost:5000/articles/${id}`);
        if (!response.ok) {
          throw new Error("Error fetching article");
        }
        const data = await response.json();
        setArticle(data.article);
        setComments(data.article.comments || []);
      } catch (error) {
        console.error("Error fetching article:", error);
      }
    };

    fetchArticle();
  }, [id]);


  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/comments/articles/${id}`);
        if (!response.ok) throw new Error("Error fetching comments");
        const data = await response.json();
        setComments(data.comments);
        console.log(`Comments for article ${id}😎:`, data.comments);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };
    fetchComments();
  }, [id]);

  const toggleComments = () => {
    setIsCommentOpen(!isCommentOpen);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const response = await fetch(`http://localhost:5000/api/comments/${currentUser.username}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          articleId: id,
          content: commentText
        }),
      });

      if (!response.ok) throw new Error('Error posting comment');
      const newComment = await response.json();

      // Update local comments state
      setComments(prevComments => [...prevComments, newComment]);
      setCommentText('');
    } catch (error) {
      console.error('Error posting comment:', error.message);
    }
  };

  if (!article) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main style={{top:"5vh"}} className="px-8 py-6 max-w-5xl mx-auto relative">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          {article.title}
        </h1>
        
        {/* Action Buttons */}
        <div style={{borderTop:"1.3px lightgrey solid", borderBottom:"1.3px lightgrey solid",padding:"10px 0px"}} 
          className="flex items-center space-x-6 mb-8 text-gray-600">
          <button className="flex items-center space-x-2">
            <span className="text-xl">👍</span>
            <span>Like</span>
          </button>
          <button className="flex items-center space-x-2">
            <span className="text-xl">👤</span>
            <span>Follow</span>
          </button>
          <button
            className="flex items-center space-x-2"
            onClick={toggleComments}
          >
            <span className="text-xl">💬</span>
            <span>Comment ({comments.length})</span>
          </button>
        </div>

        <p className="text-gray-700 leading-relaxed text-lg">{article.content}</p>
        
        {article.images && (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {article.images.map((image, index) => (
              <img
                key={index}
                src={`http://localhost:5000${image}`}
                alt={`Article ${article.id} Image ${index}`}
                className="w-full h-auto rounded-lg shadow-md"
              />
            ))}
          </div>
        )}

        <div className="mt-12 flex justify-end">
          <button
            className="px-6 py-2 text-white bg-gray-600 rounded-md hover:bg-gray-700"
            onClick={() => navigate(-1)}
          >
            Go Back
          </button>
        </div>
      </main>

      {/* Comment Section */}
      {isCommentOpen && (
        <div>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-25 z-40"
            onClick={toggleComments}
          ></div>

          {/* Comment Pop-Up */}
          <div
            className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-50 transform transition-transform ${
              isCommentOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">Comments</h2>
              <button
                className="text-gray-500 hover:text-gray-900 text-sm font-medium"
                onClick={toggleComments}
              >
                Close ✖
              </button>
            </div>

            <div className="p-4 overflow-y-auto" style={{ height: "calc(100% - 180px)" }}>
              {comments.length > 0 ? (
                <ul>
                  {comments.map((comment, index) => (
                    <li key={index} className="mb-4 border-b pb-2">
                      <div className="flex items-center mb-2">
                        <span className="font-medium text-sm">{comment.username}</span>
                        <span className="text-xs text-gray-500 ml-2">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{comment.content}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm">No comments yet. Be the first to comment!</p>
              )}
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-white">
              <form onSubmit={handleCommentSubmit}>
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write a comment..."
                  className="w-full h-20 p-2 border rounded-md resize-none focus:ring focus:ring-teal-300"
                ></textarea>
                <button 
                  type="submit"
                  className="mt-2 w-full bg-teal-500 text-white py-2 rounded-md hover:bg-teal-600"
                  disabled={!commentText.trim()}
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Article;
