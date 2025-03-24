 // controllers/articleController.js

const createArticle = (req, res) => {
  const { title, content } = req.body;
  
  // Assuming you have some way to store articles, e.g., in a database
  const newArticle = {
    title,
    content,
    author: req.user.uid,  // You can use the user ID from the decoded token
    createdAt: new Date(),
  };

  // Simulate saving the article (replace with actual database code)
  console.log('Article created by:', req.user.displayName);
  console.log('Article data:', newArticle);

  res.status(201).json({
    message: 'Article created successfully',
    article: newArticle,
  });
};

const getArticles = (req, res) => {
  // Your logic for fetching articles (e.g., from the database)
  res.status(200).json({ articles: [] }); // Just returning an empty array for now
};

module.exports = {
  createArticle,
  getArticles,
};
