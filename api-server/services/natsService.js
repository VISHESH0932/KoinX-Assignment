const { connect, StringCodec } = require('nats');
const cryptoService = require('./cryptoService');

const sc = StringCodec();


const CRYPTO_UPDATE_SUBJECT = 'crypto.update';


const connectToNats = async () => {
  try {
   
    const nc = await connect({
      servers: process.env.NATS_URL || 'nats://localhost:4222',
    });
    
    console.log(`Connected to NATS at ${nc.getServer()}`);

    const sub = nc.subscribe(CRYPTO_UPDATE_SUBJECT);
    
    console.log(`Subscribed to ${CRYPTO_UPDATE_SUBJECT}`);

    for await (const msg of sub) {
      try {
        const data = JSON.parse(sc.decode(msg.data));
        console.log(`Received message: ${JSON.stringify(data)}`);
        
        if (data.trigger === 'update') {
          console.log('Triggering crypto stats update...');
          await cryptoService.storeCryptoStats();
        }
      } catch (error) {
        console.error('Error processing NATS message:', error.message);
      }
    }
    
    console.log('Subscription closed');
  } catch (error) {
    console.error('Error connecting to NATS:', error.message);
    setTimeout(connectToNats, 5000);
  }
};

module.exports = {
  connectToNats
}; 