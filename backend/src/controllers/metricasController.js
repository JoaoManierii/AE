const express = require('express');
const router = express.Router();
const { calcularMetricas } = require('../services/metricasService');

router.post('/calcular', (req, res) => {
  const params = req.body;
  try {
    const result = calcularMetricas(params);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
