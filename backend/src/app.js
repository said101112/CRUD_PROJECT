const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const projectRoutes = require('./routes/projectRoutes');

app.use(cors());
app.use(express.json());

app.use('/api/projects', projectRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Mini Project Management API' });
});

// Port configuration
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
