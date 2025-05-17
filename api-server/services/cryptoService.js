const axios = require('axios');
const CryptoStat = require('../models/CryptoStat');

const COINS = ['bitcoin', 'ethereum', 'matic-network'];


const storeCryptoStats = async () => {
  try {
    console.log('Fetching crypto stats from CoinGecko...');
    
    const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
      params: {
        vs_currency: 'usd',
        ids: COINS.join(','),
        order: 'market_cap_desc',
        per_page: 100,
        page: 1,
        sparkline: false,
        price_change_percentage: '24h'
      }
    });

    const statsPromises = response.data.map(async (coinData) => {
      const coin = coinData.id;
      const priceUsd = coinData.current_price;
      const marketCapUsd = coinData.market_cap;
      const change24h = coinData.price_change_percentage_24h || 0;

      const cryptoStat = new CryptoStat({
        coin,
        priceUsd,
        marketCapUsd,
        change24h
      });

      return cryptoStat.save();
    });

    await Promise.all(statsPromises);
    console.log('Crypto stats stored successfully');
    
    return { success: true };
  } catch (error) {
    console.error('Error storing crypto stats:', error.message);
    return { 
      success: false, 
      error: error.message 
    };
  }
};


const getLatestStats = async (coin) => {
  if (!COINS.includes(coin)) {
    throw new Error(`Invalid coin: ${coin}. Supported coins are: ${COINS.join(', ')}`);
  }
  
  const latestStat = await CryptoStat.findOne({ coin })
    .sort({ timestamp: -1 })
    .lean();
    
  if (!latestStat) {
    throw new Error(`No data found for ${coin}`);
  }
  
  return {
    price: latestStat.priceUsd,
    marketCap: latestStat.marketCapUsd,
    "24hChange": latestStat.change24h
  };
};


const calculatePriceDeviation = async (coin) => {
  if (!COINS.includes(coin)) {
    throw new Error(`Invalid coin: ${coin}. Supported coins are: ${COINS.join(', ')}`);
  }
  
  const stats = await CryptoStat.find({ coin })
    .sort({ timestamp: -1 })
    .limit(100)
    .select('priceUsd')
    .lean();
    
  if (stats.length === 0) {
    throw new Error(`No data found for ${coin}`);
  }
  
  const prices = stats.map(stat => stat.priceUsd);
  

  const mean = prices.reduce((sum, price) => sum + price, 0) / prices.length;
  
  const squaredDiffsSum = prices.reduce((sum, price) => {
    const diff = price - mean;
    return sum + (diff * diff);
  }, 0);
  
  const stdDev = Math.sqrt(squaredDiffsSum / prices.length);
  
  return {
    deviation: parseFloat(stdDev.toFixed(2))
  };
};

module.exports = {
  storeCryptoStats,
  getLatestStats,
  calculatePriceDeviation,
  COINS
}; 