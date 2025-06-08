const express = require('express');
const geneticRoutes = require('./controllers/geneticController');
const ppcRoutes = require('./controllers/ppcController');
const metricasRoutes = require('./controllers/metricasController');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/genetic', geneticRoutes);
app.use('/api/ppc', ppcRoutes);
app.use('/api/metricas', metricasRoutes);

module.exports = app;
