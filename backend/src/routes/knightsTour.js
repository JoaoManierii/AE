const express = require('express');
const router = express.Router();
const knightsTour = require('../utils/knightsTourAlgorithm'); // Ajuste o caminho conforme necessário

router.post('/calculate', (req, res) => {
  const { startX, startY } = req.body;
  
  // Validação básica
  if (startX < 0 || startX > 7 || startY < 0 || startY > 7) {
    return res.status(400).json({ error: 'Posição inicial inválida' });
  }

  try {
    const path = knightsTour(startX, startY);
    return res.json(path);
  } catch (error) {
    console.error('Erro ao calcular percurso:', error);
    return res.status(500).json({ error: 'Falha ao calcular o percurso' });
  }
});

module.exports = router;