import mongoose from 'mongoose';
import UserModel from '../models/User.js';

class DBClient {
  constructor() {
    const DB_URI = process.env.DB_SERVER_URI || 'mongodb://127.0.0.1:27017/test_db';

    const main = async () => {
      try {
        await mongoose.connect(DB_URI);
        console.log('Connected to MongoDB');
      } catch (error) {
        console.log('Error connecting to MongoDB:', error);
      }
    }

    main();
  }

  async isAlive() {
    const connectedCode = 1;
    while (mongoose.connection.readyState === 2) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    return mongoose.connection.readyState === connectedCode;
  }

  async nbUsers() {
    const status = await this.isAlive();
    if (status) return UserModel.countDocuments();
    return -1;
  }
  async nbSnippets() {
    /** GET number of snippets */
  }
}

const dbClient = new DBClient();

export default dbClient;
