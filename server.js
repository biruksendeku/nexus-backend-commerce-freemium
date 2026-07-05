

// make .env available everywhere
require('dotenv').config();


// import packages
const { createServer } = require('http');
const mongoose = require('mongoose');
const formatName = require('./src/utils/string/formatName');

const PORT = process.env.PORT || 3000;
const nodeEnv = formatName(process.env.NODE_ENV);


// put them all in async function
// for tge step by step process
const start = async () => {
  try {
    // step 1 - connect to MongoDB first
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Database Connected');
    
    
    /**
    // * drop database - clear everything
    mongoose.connection.db.dropDatabase()
    .then(() => console.log('Cleared database'))
    .catch((err) => console.log('Cannot clear db: ', err.message));
    */
    
    
    // step 2 - load app after connection
    const app = require('./src/app');
    const server = createServer(app);
    
    server.listen(PORT, () => {
      console.log(`${nodeEnv} server started on port ${PORT}...`);
    });
    
    // step 3 - handle graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      server.close(() => {
        console.log(`${nodeEnv} server and database connection closed`);
        process.exit(0);
      });
    });

  } catch (err) {
    console.error('Failed to connect to MongoDB:', err.message);
    console.error(err);
    process.exit(1);
  }
};


// then call the function
start();
