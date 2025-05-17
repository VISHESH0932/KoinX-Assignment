const cryptoService = require('../services/cryptoService');

/**
 * @route   GET /stats
 * @desc    Get latest stats for a cryptocurrency
 * @access  Public
 */
const getStats = async (req, res) => {
  try {
    const { coin } = req.query;
    
    if (!coin) {
      return res.status(400).json({ 
        success: false, 
        error: 'Coin parameter is required' 
      });
    }
    
    const stats = await cryptoService.getLatestStats(coin);
    return res.json(stats);
  } catch (error) {
    return res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
};

/**
 * @route   GET /deviation
 * @desc    Get standard deviation of price for a cryptocurrency
 * @access  Public
 */
const getDeviation = async (req, res) => {
  try {
    const { coin } = req.query;
    
    if (!coin) {
      return res.status(400).json({ 
        success: false, 
        error: 'Coin parameter is required' 
      });
    }
    
    const deviation = await cryptoService.calculatePriceDeviation(coin);
    return res.json(deviation);
  } catch (error) {
    return res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
};

/**
 * @route   POST /store-stats
 * @desc    Manually trigger stats storage (for testing)
 * @access  Public
 */
const triggerStoreStats = async (req, res) => {
  try {
    const result = await cryptoService.storeCryptoStats();
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

module.exports = {
  getStats,
  getDeviation,
  triggerStoreStats
}; 