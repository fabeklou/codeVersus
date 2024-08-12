import mongoose from 'mongoose';

const dbURI = process.env.DB_SERVER_URI || 'mongodb://localhost:27017/test_db';

const connectDB = async () => {
  try {
    const dbConnection = await mongoose.connect(dbURI);
    const db = dbConnection.connection;

    db.on('connected', () => {
      console.log('Mongoose connected to MongoDB');
    });

    db.on('error', (err) => {
      console.log(`Mongoose connection error: ${err}`);
    });

    db.on('disconnected', () => {
      console.log('Mongoose disconnected');
    });

    return db;
  } catch (error) {
    console.error('Error connecting to MongoDB', error);
    throw error;
  }
}

const db = await connectDB();
export default db;
