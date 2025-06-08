const express = require('express');
const router = express.Router();
const { executePPC } = require('../services/ppcService');

router.post('/execute', (req, res) => {
  const params = req.body;
  try {
    const result = executePPC(params);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
