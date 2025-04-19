// require('dotenv').config();
// const express = require('express');
// const db = require('./models'); // Import db from models/index.js
// const jobRoutes = require('./routes/jobs'); // Ensure this path is correct

// const app = express();
// const PORT = process.env.PORT || 3000;

// // Middleware
// app.use(express.json());
// app.use('/api/jobs', jobRoutes); // Ensure the correct path is used

// // Sync the database
// db.sequelize.sync()
//   .then(() => console.log('Database synced!'))
//   .catch(err => console.error('Error syncing database:', err));

// // Routes and other middleware (if any)
// // const userRoutes = require('./routes/users');
// // app.use('/api/users', userRoutes);

// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });


// const express = require('express');
// const dotenv = require('dotenv');
// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 3000;

// app.use(express.json());

// // Routes
// const jobRoutes = require('./routes/jobs');
// app.use('/api/jobs', jobRoutes);

// // Sequelize sync
// const db = require('./models');
// db.sequelize.sync().then(() => {
//   app.listen(PORT, () => {
//     console.log(`🚀 Server running at http://localhost:${PORT}`);
//   });
// });


const express = require('express');
const app = express();
require('dotenv').config();

app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/jobs');
const projectRoutes = require('./routes/projectRoutes');

app.use('/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/projects', projectRoutes);

app.listen(3000, () => console.log('Server running on port 3000'));


