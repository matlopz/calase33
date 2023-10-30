const express = require('express');
const router = express.Router();
const generateProducts = require('../utils/mock.utils');

router.get('/', (req, res) => {
    const { numProduct=1 } = req.query
    const products = generateProducts(numProduct);
    res.json(products);
  });

  module.exports = router;