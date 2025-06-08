const express = require('express');
const router = express.Router();
const { runGeneticAlgorithm } = require('../services/geneticAlgorithm');

router.post('/run', (req, res) => {
  const params = req.body;
  try {
    const result = runGeneticAlgorithm(params);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
