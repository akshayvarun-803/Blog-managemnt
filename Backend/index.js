require('dotenv').config(); // Add this line at the top

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const articleRoutes = require('./routes/articleRoutes');
const commentRoutes = require('./routes/commentRoutes');
const likeRoutes = require('./routes/likeRoutes');
const savedPostRoutes = require('./routes/savedPostRoutes');
const authRoutes = require('./routes/authRoutes');
const homeRoutes = require('./routes/homeRoutes');
const followRoutes = require('./Routes/followRoutes');
const { pool } = require('./db');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(cors());
app.use(express.json());

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Define the routes for authentication
app.use('/auth', authRoutes);

// Define the routes for home page and user profiles
app.use('/', homeRoutes);

// Define the routes for articles
// app.use('/create-article', articleRoutes);

app.use('/articles',articleRoutes);

app.use('/user/follow',followRoutes);

// Dynamic Routes for other functionalities
app.use('/api', articleRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/:username/saved-posts', savedPostRoutes);


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});