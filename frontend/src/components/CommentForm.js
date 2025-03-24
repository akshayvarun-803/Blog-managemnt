import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const CommentForm = ({ articleId, onCommentAdded }) => {
  const [commentText, setCommentText] = useState('');
  const { currentUser } = useAuth();

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const response = await fetch(`http://localhost:5000/api/comments/${currentUser.username}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'
         },
        body: JSON.stringify({
          articleId,
          content: commentText
        }),
      });

      if (!response.ok) throw new Error('Error posting comment');
      const newComment = await response.json();

      // Let the parent update local article state
      onCommentAdded(newComment);
      setCommentText('');
    } catch (error) {
      console.error('Error posting comment:', error.message);
    }
  };

  return (
    <form onSubmit={handleCommentSubmit} className="mt-4">
      <textarea
        className="w-full bg-gray-700 text-white rounded p-2 mb-4"
        rows="4"
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        placeholder="Write your comment here..."
      />
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
      >
        Post Comment,{currentUser.username}
      </button>
    </form>
  );
};

export default CommentForm;
