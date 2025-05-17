require('dotenv').config();
const cron = require('node-cron');
const { connect, StringCodec } = require('nats');

const sc = StringCodec();

const CRYPTO_UPDATE_SUBJECT = 'crypto.update';

let natsConnection = null;

const connectToNats = async () => {
  try {

    natsConnection = await connect({
      servers: process.env.NATS_URL || 'nats://localhost:4222',
    });
    
    console.log(`Connected to NATS at ${natsConnection.getServer()}`);
    
    natsConnection.closed().then(() => {
      console.log('NATS connection closed');
      natsConnection = null;
 
      setTimeout(connectToNats, 5000);
    });
    
    return true;
  } catch (error) {
    console.error('Error connecting to NATS:', error.message);
    setTimeout(connectToNats, 5000);
    return false;
  }
};


const publishUpdateEvent = async () => {
  if (!natsConnection) {
    console.log('Not connected to NATS. Attempting to connect...');
    const connected = await connectToNats();
    if (!connected) {
      return false;
    }
  }
  
  try {
    const data = { trigger: 'update', timestamp: new Date().toISOString() };
    natsConnection.publish(CRYPTO_UPDATE_SUBJECT, sc.encode(JSON.stringify(data)));
    console.log(`Published message to ${CRYPTO_UPDATE_SUBJECT}:`, data);
    return true;
  } catch (error) {
    console.error('Error publishing message:', error.message);
    return false;
  }
};

connectToNats();

cron.schedule('*/15 * * * * ', async () => {
  console.log('Running scheduled task to trigger crypto stats update...');
  await publishUpdateEvent();
});

publishUpdateEvent();

console.log('Worker server started. Scheduled to publish updates every 15 minutes.'); 