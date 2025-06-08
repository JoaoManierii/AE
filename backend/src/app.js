const express = require('express');
const geneticRoutes = require('./controllers/geneticController');
const cors = require('cors');
const knightsTourRoutes = require('./routes/knightsTour');

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/genetic', geneticRoutes);
app.use('/api/knights-tour', knightsTourRoutes);

module.exports = app;
