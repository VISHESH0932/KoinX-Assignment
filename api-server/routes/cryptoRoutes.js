const express = require('express');
const router = express.Router();
const cryptoController = require('../controllers/cryptoController');


router.get('/stats', cryptoController.getStats);
router.get('/deviation', cryptoController.getDeviation);
router.post('/store-stats', cryptoController.triggerStoreStats);

module.exports = router; 