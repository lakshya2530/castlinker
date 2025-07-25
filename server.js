
const express = require('express');
const cors = require('cors');
const fs = require('fs');
require('dotenv').config();
const { Server } = require('socket.io');
const path = require('path');

const app = express();

let server;
if (process.env.NODE_ENV === 'production') {
  const https = require('https');
  const options = {
    key: fs.readFileSync('private-key.pem'),
    cert: fs.readFileSync('certificate.pem'),
  };
  server = https.createServer(options, app);
} else {
  const http = require('http');
  server = http.createServer(app);
}

// Initialize Socket.IO with the server
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});


// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// app.use((req, res, next) => {
//   if (req.headers['x-forwarded-proto'] !== 'https') {
//     return res.redirect('https://' + req.headers.host + req.url);
//   }
//   next();
// });

// Routes
const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/jobs');
const projectRoutes = require('./routes/projectRoutes');
const articleRoutes = require('./routes/articles');
const eventRoutes = require('./routes/events');
const courseRoutes = require('./routes/courses');
const resourceRoutes = require('./routes/resources');
const likeRoutes = require('./routes/likes');
const savedRoutes = require('./routes/savedJobs');
const dashboardRoutes = require('./routes/dashboard');
const userRoutes = require('./routes/users');
const notificationRoutes = require('./routes/notifications');
const chatRoutes = require('./routes/chat');
const postRoutes = require('./routes/posts');
const expRoutes = require('./routes/experience');
const portfolioRoutes = require('./routes/portfolio');
const userAdminRoutes = require('./routes/auth');
const userAdminDashboardRoutes = require('./routes/admin');
const paymentRoutes = require('./routes/payment');
const connectRoutes = require('./routes/connection');

//Admin
app.use('/api', userAdminRoutes);
app.use('/api/admin', userAdminDashboardRoutes);

app.use('/api/connection', connectRoutes);
app.use('/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/jobs', savedRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/experience', expRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/payment', paymentRoutes);

// Socket.io real-time logic
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });

  socket.on('send_message', (data) => {
    const { sender_id, receiver_id, content } = data;

    io.to(receiver_id).emit('receive_message', {
      sender_id,
      receiver_id,
      content,
      created_at: new Date()
    });

    console.log(`Message from ${sender_id} to ${receiver_id}: ${content}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// ✅ Corrected: start server with Socket.IO attached
server.listen(3000, () => {
  console.log('Server running on port 3000');
});






