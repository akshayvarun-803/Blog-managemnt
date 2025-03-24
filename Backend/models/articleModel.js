const { pool } = require('../db');

// Create a new article
const createArticle = async (userId, title, content) => {
  const result = await pool.query(
    'INSERT INTO articles (user_id, title, content) VALUES ($1, $2, $3) RETURNING *',
    [userId, title, content]
  );
  return result.rows[0];
};

const getAllArticles = async () => {
  const result = await pool.query(
    `SELECT 
        articles.id,
        articles.title,
        articles.content,
        articles.created_at,
        users.username AS author,
        array_agg(images.url) AS images
     FROM 
        articles
     INNER JOIN 
        users ON articles.user_id = users.id
     LEFT JOIN 
        images ON articles.id = images.article_id
     GROUP BY 
        articles.id, users.username
     ORDER BY 
        articles.created_at DESC
     LIMIT 10`
  );
  console.log(`database Results for home page are : ${result.rows}`)
  return result.rows;
};

const getArticlesByUsername = async (username) => {
  const result = await pool.query(
    `SELECT articles.*, array_agg(images.url) AS images
     FROM articles
     LEFT JOIN images ON articles.id = images.article_id
     JOIN users ON articles.user_id = users.id
     WHERE users.username = $1
     GROUP BY articles.id`,
    [username]
  );
  return result.rows;
};

// Get total articles count
const getTotalArticlesCount = async () => {
  const result = await pool.query('SELECT COUNT(*) FROM articles');
  return parseInt(result.rows[0].count, 10);
};

// Get a specific article by ID
const getArticleById = async (id) => {
  const result = await pool.query(
    `SELECT articles.*, array_agg(images.url) AS images
     FROM articles
     LEFT JOIN images ON articles.id = images.article_id
     WHERE articles.id = $1
     GROUP BY articles.id`,
    [id]
  );
  return result.rows[0];
};

// Add images to an article
const addImagesToArticle = async (articleId, imageUrls) => {
  const query = 'INSERT INTO images (article_id, url) VALUES ($1, $2)';
  const promises = imageUrls.map(url => pool.query(query, [articleId, url]));
  await Promise.all(promises);
};

module.exports = { createArticle,getAllArticles, getTotalArticlesCount,getArticlesByUsername, getArticleById, addImagesToArticle };